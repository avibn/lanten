"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2, FileImage, Save, Trash2 } from "lucide-react";
import {
    MaintenanceRequest,
    STATUS_BACKGROUND_COLORS,
    STATUS_TEXT,
} from "@/models/maintenance";
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
import {
    useDeleteMaintenanceRequestMutation,
    useUpdateMaintenanceRequestMutation,
} from "@/network/client/maintenance";
import { useEffect, useState } from "react";

import { Form } from "@/components/ui/form";
import { FormTextAreaField } from "@/components/forms/fields/form-text-area-field";
import { IconButton } from "@/components/buttons/icon-button";
import Image from "next/image";
import { MainButton } from "@/components/buttons/main-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WithAuthorized } from "@/providers/with-authorized";
import { formatTime } from "@/utils/format-time";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/use-auth-store";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
    const deleteRequestMutation = useDeleteMaintenanceRequestMutation();
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

    const handleDelete = async () => {
        deleteRequestMutation.mutate(maintenanceRequest.id);
    };

    // Deletion event handlers
    if (deleteRequestMutation.isSuccess) {
        toast.success("Maintenance request deleted successfully.");
        setDialogOpen(false);
        deleteRequestMutation.reset();

        // Refresh the page
        router.refresh();
    }

    if (deleteRequestMutation.isError) {
        toast.error(
            "Failed to delete maintenance request. Please try again later."
        );
        deleteRequestMutation.reset();
    }

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
                                <ScrollArea className="h-24 pr-2 text-sm">
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
                        <span
                            className={`${
                                STATUS_BACKGROUND_COLORS[
                                    maintenanceRequest.status
                                ]
                            } px-4 py-1 rounded-full w-max`}
                        >
                            {STATUS_TEXT[maintenanceRequest.status] ||
                                maintenanceRequest.status}
                        </span>
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
                            <MainButton
                                icon={<Trash2 size={18} />}
                                text="Delete"
                                variant="destructive"
                                className="flex-grow"
                                isLoading={deleteRequestMutation.isPending}
                                onClick={handleDelete}
                            />
                        </WithAuthorized>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
