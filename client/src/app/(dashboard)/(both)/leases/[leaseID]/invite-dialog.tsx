"use client";

import { BadRequestError, NotFoundError } from "@/network/errors/httpErrors";
import { Copy, CopyCheck, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { TenantInviteFormValues, tenantInviteSchema } from "@/schemas/tenant";
import { useEffect, useState } from "react";
import {
    useInviteTenantMutation,
    useRemoveInviteMutation,
} from "@/network/client/tenants";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormTextField } from "@/components/forms/fields/form-text-field";
import { Input } from "@/components/ui/input";
import { Invite } from "@/models/invite";
import { Label } from "@/components/ui/label";
import { Lease } from "@/models/lease";
import { MainButton } from "@/components/buttons/main-button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface InviteDialogProps {
    lease: Lease;
    getCurrentInvites: () => Promise<Invite[]>;
}

export function InviteDialog({ lease, getCurrentInvites }: InviteDialogProps) {
    const [copied, setCopied] = useState(false);
    const [inviteCode, setInviteCode] = useState(lease.inviteCode);
    const [inviteURL, setInviteURL] = useState("");
    const [invites, setInvites] = useState<Invite[]>([]);
    const [inviteBeingRemoved, setInviteBeingRemoved] = useState("");
    const form = useForm<TenantInviteFormValues>({
        resolver: zodResolver(tenantInviteSchema),
        defaultValues: {
            tenantEmail: "",
        },
    });

    const inviteTenantMutation = useInviteTenantMutation(lease.id);
    const removeInviteMutation = useRemoveInviteMutation(lease.id);

    const fetchInvites = async () => {
        const invites = await getCurrentInvites();
        setInvites(invites);
    };

    useEffect(() => {
        fetchInvites();
    }, []);

    // Set invite URL
    useEffect(() => {
        setInviteURL(`${window.location.origin}/leases/invite/${inviteCode}`);
    }, [inviteCode]);

    const handleInvite = (values: TenantInviteFormValues) => {
        // todo:: send invite
        inviteTenantMutation.mutate(values.tenantEmail);
    };

    const handleCopyInvite = () => {
        setCopied(true);

        // copy to clipboard
        navigator.clipboard.writeText(inviteURL);
        toast.success("Invite link copied to clipboard.");

        setTimeout(() => {
            setCopied(false);
        }, 3000);
    };

    const handleRemoveInvite = (inviteID: string) => {
        setInviteBeingRemoved(inviteID);
        removeInviteMutation.mutate(inviteID);
    };

    // Invite mutations
    if (inviteTenantMutation.isError) {
        const error = inviteTenantMutation.error;
        if (error instanceof NotFoundError) {
            toast.error("Lease not found.");
        } else if (error instanceof BadRequestError) {
            toast.error(error.message);
        } else {
            toast.error("Something went wrong!");
        }

        inviteTenantMutation.reset();
    }
    if (inviteTenantMutation.isSuccess) {
        toast.success("Tenant invited successfully!");

        // Add invite to list
        fetchInvites();

        inviteTenantMutation.reset();
        form.reset();
    }

    // Remove invite mutations
    if (removeInviteMutation.isError) {
        toast.error("Something went wrong!");
        removeInviteMutation.reset();
        setInviteBeingRemoved("");
    }
    if (removeInviteMutation.isSuccess) {
        toast.success("Invite removed successfully!");

        // Remove invite from list
        setInvites((invites) =>
            invites.filter((invite) => invite.id !== inviteBeingRemoved)
        );
        setInviteBeingRemoved("");

        // Reset mutation
        removeInviteMutation.reset();
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <MainButton text="Invite Tenant" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Invite Tenant</DialogTitle>
                    <DialogDescription>
                        Invite a tenant to this lease.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 mt-2">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleInvite)}
                            className="flex flex-col gap-4 w-full"
                        >
                            <div className="grid gap-4">
                                <FormTextField
                                    form={form}
                                    name="tenantEmail"
                                    inputPlaceholder="email@email.com"
                                    inputType="email"
                                    readOnly={inviteTenantMutation.isPending}
                                />
                            </div>
                            <MainButton
                                text="Send Invite"
                                loadingText="Sending Invite"
                                isLoading={inviteTenantMutation.isPending}
                                variant="default"
                            />
                        </form>
                    </Form>
                    <Separator />

                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">
                                Link
                            </Label>
                            <Input id="link" value={inviteURL} readOnly />
                        </div>
                        {/* Copy button */}
                        <Button
                            type="submit"
                            size="sm"
                            className="px-3"
                            variant="secondary"
                            disabled={copied}
                            onClick={handleCopyInvite}
                        >
                            <span className="sr-only">
                                {copied ? "Copied" : "Copy"}
                            </span>
                            {copied ? (
                                <CopyCheck className="h-4 w-4" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                    <Separator />
                    <div>
                        <h2 className="text-md">Current Invites</h2>
                        <div className="flex flex-col mt-2">
                            {invites.length === 0 && (
                                <p className="text-sm text-gray-500">
                                    No pending invites.
                                </p>
                            )}
                            {invites.map((invite) => (
                                <div
                                    key={invite.id}
                                    className="flex items-center justify-between"
                                >
                                    <p className="text-sm">{invite.email}</p>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                            handleRemoveInvite(invite.id)
                                        }
                                        disabled={
                                            removeInviteMutation.isPending
                                        }
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
