"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DocumentFormValues, documentSchema } from "@/schemas/document";
import { useEffect, useState } from "react";

import { DocumentsList } from "@/models/document";
import { Form } from "@/components/ui/form";
import { FormTextField } from "@/components/forms/fields/form-text-field";
import { FormUploadField } from "@/components/forms/fields/form-upload-field";
import { IconButton } from "@/components/buttons/icon-button";
import { MainButton } from "@/components/buttons/main-button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/use-auth-store";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useUploadDocumentMutation } from "@/network/client/documents";
import { zodResolver } from "@hookform/resolvers/zod";

interface DocumentUploadDialogProps {
    leaseID: string;
    documents: DocumentsList;
}

export function DocumentUploadDialog({
    leaseID,
    documents,
}: DocumentUploadDialogProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isMaxDocuments, setIsMaxDocuments] = useState(false);
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const { mutate, isPending, isSuccess, isError, error, reset } =
        useUploadDocumentMutation(leaseID);

    const form = useForm<DocumentFormValues>({
        resolver: zodResolver(documentSchema),
        defaultValues: {
            name: "",
            file: new File([], ""),
        },
    });

    const handleUpload = async (data: DocumentFormValues) => {
        mutate(data);
    };

    if (isError) {
        toast.error("Failed to upload document. Please try again later.");
        console.error(error);
        reset();
    }

    if (isSuccess) {
        toast.success("Document uploaded successfully.");

        // Reset form and close dialog
        reset();
        form.reset();
        setDialogOpen(false);

        // Refresh the page
        router.refresh();
    }

    // Max 5 documents
    useEffect(() => {
        if (
            (user?.userType === "LANDLORD" &&
                documents.landlordDocs.length >= 5) ||
            (user?.userType === "TENANT" && documents.tenantDocs.length >= 5)
        ) {
            setIsMaxDocuments(true);
        }
    }, [documents, user]);

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild={!isMaxDocuments} disabled={isMaxDocuments}>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                        {/* Number of documents uploaded */}
                        {user?.userType === "LANDLORD"
                            ? documents.landlordDocs.length
                            : documents.tenantDocs.length}
                        /5
                    </span>
                    <IconButton
                        variant="default"
                        icon={<Upload size={18} color="white" />}
                        isDisabled={isMaxDocuments}
                    />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload Document</DialogTitle>
                    <DialogDescription>
                        Valid file types: PDF, DOC, and DOCX
                    </DialogDescription>
                </DialogHeader>
                <div className="gap-4 mt-2">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleUpload)}
                            className="flex flex-col gap-4 w-full px-2"
                        >
                            <FormTextField
                                form={form}
                                name="name"
                                label="Document Name"
                                inputPlaceholder="The document name"
                            />
                            <FormUploadField
                                form={form}
                                name="file"
                                label="Document File"
                                inputPlaceholder="Select a file"
                                accept={[
                                    "application/pdf",
                                    "application/msword",
                                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                ]}
                            />
                            <MainButton
                                text="Upload"
                                loadingText="Uploading"
                                isLoading={isPending}
                            />
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
