"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2, FileImage, Save } from "lucide-react";
import {
    MaintenanceRequestUpdateFormValues,
    maintenanceRequestUpdateSchema,
} from "@/schemas/maintenance";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

import { DeleteRequestDialog } from "@/components/segments/maintenance/delete-request-dialog";
import { Form } from "@/components/ui/form";
import { FormTextAreaField } from "@/components/forms/fields/form-text-area-field";
import { IconButton } from "@/components/buttons/icon-button";
import Image from "next/image";
import { MainButton } from "@/components/buttons/main-button";
import { MaintenanceRequest } from "@/models/maintenance";
import { MaintenanceStatusBox } from "@/components/segments/maintenance/maintenance-status-box";
import { RequestBadge } from "@/components/segments/maintenance/request-badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WithAuthorized } from "@/providers/with-authorized";
import { formatTime } from "@/utils/format-time";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/use-auth-store";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useUpdateMaintenanceRequestMutation } from "@/network/client/maintenance";
import { zodResolver } from "@hookform/resolvers/zod";

interface MaintenanceDialogProps {
    maintenanceRequest: MaintenanceRequest;
    children: React.ReactNode;
}

export function MaintenanceDialog({
    maintenanceRequest,
    children,
}: MaintenanceDialogProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isUpdateView, setIsUpdateView] = useState(false);
    const user = useAuthStore((state) => state.user);
    const router = useRouter();
    const updateRequestMutation = useUpdateMaintenanceRequestMutation(
        maintenanceRequest.id
    );

    useEffect(() => {
        if (!dialogOpen) {
            setIsUpdateView(false);
        }
    }, [dialogOpen]);

    const updateForm = useForm<MaintenanceRequestUpdateFormValues>({
        resolver: zodResolver(maintenanceRequestUpdateSchema),
        defaultValues: {
            description: maintenanceRequest.description,
        },
    });

    const handleUpdate = async (data: MaintenanceRequestUpdateFormValues) => {
        updateRequestMutation.mutate(data);
    };

    // Updatation event handlers
    if (updateRequestMutation.isSuccess) {
        toast.success("Maintenance request updated successfully.");
        setIsUpdateView(false);
        updateRequestMutation.reset();

        // Refresh the page
        router.refresh();
    }

    if (updateRequestMutation.isError) {
        toast.error(
            "Failed to update maintenance request. Please try again later."
        );
        updateRequestMutation.reset();
    }

    const formatFileName = (fileName: string) => {
        return fileName.split("/").pop();
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Maintenance Request</DialogTitle>
                    <DialogDescription>
                        View and manage this maintenance request.
                    </DialogDescription>
                </DialogHeader>
                <div className="gap-4 mt-2">
                    <div className="grid grid-cols-2 gap-2">
                        <p className="font-semibold">Description:</p>
                        <p>
                            {!isUpdateView ? (
                                <ScrollArea className="h-24 pr-2 text-sm overflow-y-auto flex">
                                    <p className="overflow-hidden [overflow-wrap:anywhere]">
                                        {maintenanceRequest.description}
                                    </p>
                                </ScrollArea>
                            ) : (
                                <Form {...updateForm}>
                                    <form
                                        onSubmit={updateForm.handleSubmit(
                                            handleUpdate
                                        )}
                                    >
                                        <FormTextAreaField
                                            form={updateForm}
                                            name="description"
                                            inputPlaceholder="Describe the document"
                                        />
                                    </form>
                                </Form>
                            )}
                        </p>
                        {maintenanceRequest.images.length > 0 && (
                            <>
                                <p className="font-semibold">Images:</p>
                                <div>
                                    {maintenanceRequest.images.map(
                                        (image, index) => (
                                            <TooltipProvider key={index}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <a
                                                            href={image.url}
                                                            target="_blank"
                                                            rel="noreferrer noopener"
                                                        >
                                                            <IconButton
                                                                icon={
                                                                    <FileImage
                                                                        size={
                                                                            19
                                                                        }
                                                                    />
                                                                }
                                                            />
                                                        </a>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            <Image
                                                                src={image.url}
                                                                alt={
                                                                    image.fileName ||
                                                                    "An image of the maintenance request"
                                                                }
                                                                width={200}
                                                                height={200}
                                                                className="w-full h-24 object-contain"
                                                            />
                                                            {formatFileName(
                                                                image.fileName ||
                                                                    ""
                                                            )}
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )
                                    )}
                                </div>
                            </>
                        )}
                        <p className="font-semibold">Request Type:</p>
                        <p>{maintenanceRequest.requestType.name}</p>
                        <p className="font-semibold">Status:</p>
                        <WithAuthorized role="TENANT">
                            <RequestBadge status={maintenanceRequest.status} />
                        </WithAuthorized>
                        <WithAuthorized role="LANDLORD">
                            <div>
                                <MaintenanceStatusBox
                                    requestID={maintenanceRequest.id}
                                    initialStatus={maintenanceRequest.status}
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Click to update.
                                </p>
                            </div>
                        </WithAuthorized>
                        {maintenanceRequest.author && (
                            <>
                                <p className="font-semibold">Author:</p>
                                <p>
                                    {maintenanceRequest.author?.name} (
                                    {maintenanceRequest.author?.email})
                                </p>
                            </>
                        )}
                        <p className="font-semibold">Created:</p>
                        <p>{formatTime(maintenanceRequest.createdAt)}</p>
                        <p className="font-semibold">Last Updated:</p>
                        <p>{formatTime(maintenanceRequest.updatedAt)}</p>
                    </div>
                    <div className="flex w-full justify-between gap-2 mt-6">
                        <WithAuthorized role="TENANT">
                            {!isUpdateView ? (
                                <MainButton
                                    icon={<Edit2 size={17} />}
                                    text="Update"
                                    variant="secondary"
                                    className="flex-grow"
                                    onClick={() => setIsUpdateView(true)}
                                />
                            ) : (
                                <MainButton
                                    icon={<Save size={18} />}
                                    text="Save"
                                    isLoading={updateRequestMutation.isPending}
                                    onClick={updateForm.handleSubmit(
                                        handleUpdate
                                    )}
                                    className="flex-grow"
                                />
                            )}
                        </WithAuthorized>
                        <DeleteRequestDialog
                            requestID={maintenanceRequest.id}
                            setDialogOpen={setDialogOpen}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
