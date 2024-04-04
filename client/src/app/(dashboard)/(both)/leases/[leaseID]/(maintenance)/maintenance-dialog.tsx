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

import { FileImage } from "lucide-react";
import { IconButton } from "@/components/buttons/icon-button";
import Image from "next/image";
import { formatTime } from "@/utils/format-time";
import { useAuthStore } from "@/stores/use-auth-store";
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

    const handleDelete = async () => {
        // mutate(maintenanceRequest.id);
    };

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
                        <p className="font-semibold">Created:</p>
                        <p>{formatTime(maintenanceRequest.createdAt)}</p>
                        <p className="font-semibold">Last Updated:</p>
                        <p>{formatTime(maintenanceRequest.updatedAt)}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
