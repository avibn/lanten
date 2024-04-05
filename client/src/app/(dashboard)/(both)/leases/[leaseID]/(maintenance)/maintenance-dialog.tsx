"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FileImage, Trash2 } from "lucide-react";
import {
    MaintenanceRequest,
    STATUS_BACKGROUND_COLORS,
    STATUS_TEXT,
} from "@/models/maintenance";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { IconButton } from "@/components/buttons/icon-button";
import Image from "next/image";
import { MainButton } from "@/components/buttons/main-button";
import { WithAuthorized } from "@/providers/with-authorized";
import { formatTime } from "@/utils/format-time";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/use-auth-store";
import { useDeleteMaintenanceRequestMutation } from "@/network/client/maintenance";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface MaintenanceDialogProps {
    maintenanceRequest: MaintenanceRequest;
    children: React.ReactNode;
}

export function MaintenanceDialog({
    maintenanceRequest,
    children,
}: MaintenanceDialogProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const user = useAuthStore((state) => state.user);
    const router = useRouter();
    const deleteRequestMutation = useDeleteMaintenanceRequestMutation();

    const handleDelete = async () => {
        deleteRequestMutation.mutate(maintenanceRequest.id);
    };

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
                        <p>{maintenanceRequest.description}</p>
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
                            <MainButton
                                icon={<Trash2 size={18} />}
                                text="Delete Document"
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
