"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Link, Trash2 } from "lucide-react";

import { Document } from "@/models/document";
import { MainButton } from "@/components/buttons/main-button";
import { formatTime } from "@/utils/format-time";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/use-auth-store";
import { useDeleteDocumentMutation } from "@/network/client/documents";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DocumentDialogProps {
    loading: boolean;
    document: Document;
    children: React.ReactNode;
}

export function DocumentDialog({
    loading,
    document,
    children,
}: DocumentDialogProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const { mutate, isPending, isSuccess, isError, error, reset } =
        useDeleteDocumentMutation();

    // Landlord or author can delete document
    const canDelete =
        user?.userType == "LANDLORD" || user?.id == document.author?.id;

    const handleDelete = async () => {
        mutate(document.id);
    };

    if (isError) {
        toast.error("Failed to delete document. Please try again later.");
        reset();
    }

    if (isSuccess) {
        toast.success("Document deleted successfully.");

        // Reset form and close dialog
        reset();
        setDialogOpen(false);

        // Refresh the page
        router.refresh();
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild={!loading} disabled={loading}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Document</DialogTitle>
                    <DialogDescription>
                        View details about the document below.
                    </DialogDescription>
                </DialogHeader>
                <div className="gap-4 mt-2">
                    <div className="grid grid-cols-2 gap-2">
                        <p>Author</p>
                        <p>
                            {document.author?.name} ({document.author?.email})
                        </p>
                        <p>Uploaded on</p>
                        <p>{formatTime(document.createdAt)}</p>
                        <p>Document name</p>
                        <p>{document.name}</p>
                        <p>Document type</p>
                        <p>
                            {document.type == "LANDLORD"
                                ? "Landlord"
                                : "Tenant"}
                        </p>
                        <p>File name</p>
                        <p>{document.fileName.split("/").pop()}</p>
                        <p>File type</p>
                        <p>{document.fileType}</p>
                    </div>
                    {/* Buttons in a row width full evenly */}
                    <div className="flex w-full justify-between gap-2 mt-6">
                        <a
                            target="_blank"
                            href={`/documents/${document.id}`}
                            rel="noreferrer noopener"
                            className="flex-grow"
                        >
                            <MainButton
                                icon={<Link size={18} />}
                                text="View Document"
                                className="w-full"
                            />
                        </a>
                        {canDelete && (
                            <MainButton
                                icon={<Trash2 size={18} />}
                                text="Delete Document"
                                variant="destructive"
                                className="flex-grow"
                                isLoading={isPending}
                                onClick={handleDelete}
                            />
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
