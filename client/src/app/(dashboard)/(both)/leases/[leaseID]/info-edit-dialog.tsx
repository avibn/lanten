"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    UpdateLeaseDescriptionFormValues,
    updateLeaseDescriptionSchema,
} from "@/schemas/lease";

import { EditIconButton } from "@/components/buttons/edit-icon-button";
import { Error } from "@/models/error";
import { Form } from "@/components/ui/form";
import { FormRichField } from "@/components/forms/fields/form-rich-field";
import { Lease } from "@/models/lease";
import { MainButton } from "@/components/buttons/main-button";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

interface InfoEditDialogProps {
    description?: string;
    editLeaseInfo: (
        data: UpdateLeaseDescriptionFormValues
    ) => Promise<Lease | Error>; //todo
}
export function InfoEditDialog({
    description,
    editLeaseInfo,
}: InfoEditDialogProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const form = useForm<UpdateLeaseDescriptionFormValues>({
        resolver: zodResolver(updateLeaseDescriptionSchema),
        defaultValues: {
            description,
        },
    });

    const handleLeaseInfoEdit = async (
        data: UpdateLeaseDescriptionFormValues
    ) => {
        console.log(data);
        setLoading(true);
        const lease = await editLeaseInfo(data);
        // check if lease has "error"
        if ("error" in lease) {
            toast.error(
                "Something went wrong updating the lease description. Please try again later."
            );
        } else {
            setDialogOpen(false);
        }
        setLoading(false);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <EditIconButton />
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Lease Description</DialogTitle>
                    <DialogDescription>
                        Add any additional information that you want to share
                        with your tenants, such as rules, emergency contacts,
                        etc.
                    </DialogDescription>
                </DialogHeader>
                <div className="gap-4 mt-2">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleLeaseInfoEdit)}
                            className="flex flex-col gap-4 w-full"
                        >
                            <FormRichField
                                form={form}
                                name="description"
                                inputPlaceholder="Add a lease description"
                            />
                            <MainButton
                                text="Save"
                                loadingText="Saving"
                                isLoading={loading}
                                variant="default"
                            />
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
