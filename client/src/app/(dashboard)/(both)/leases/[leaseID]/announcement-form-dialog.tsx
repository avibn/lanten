"use client";

import {
    AnnouncementFormValues,
    announcementSchema,
} from "@/schemas/announcement";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Announcement } from "@/models/announcement";
import { EditIconButton } from "@/components/buttons/edit-icon-button";
import { Error } from "@/models/error";
import { Form } from "@/components/ui/form";
import { FormTextAreaField } from "@/components/forms/fields/form-text-area-field";
import { FormTextField } from "@/components/forms/fields/form-text-field";
import { MainButton } from "@/components/buttons/main-button";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

interface AnnouncementFormDialogProps {
    announcementToEdit?: Announcement;
    handleFormSubmit: (
        data: AnnouncementFormValues
    ) => Promise<Announcement | Error>;
}
export function AnnouncementFormDialog({
    announcementToEdit,
    handleFormSubmit,
}: AnnouncementFormDialogProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<AnnouncementFormValues>({
        resolver: zodResolver(announcementSchema),
        defaultValues: {
            title: announcementToEdit?.title,
            message: announcementToEdit?.message,
        },
    });

    const handleAnnouncementForm = async (data: AnnouncementFormValues) => {
        console.log(data);
        setLoading(true);
        const response = await handleFormSubmit(data);
        // check if response has error
        if ("error" in response) {
            toast.error("Something went wrong. Please try again later.");
        } else {
            setDialogOpen(false);
        }
        setLoading(false);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                {announcementToEdit ? (
                    <EditIconButton />
                ) : (
                    <MainButton text="Add Announcement" />
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {announcementToEdit
                            ? "Edit announcement"
                            : "Add announcement"}
                    </DialogTitle>
                    <DialogDescription>
                        {announcementToEdit
                            ? "Edit the announcement details and click save to update the announcement."
                            : "Add a new announcement to the lease's announcement board."}
                    </DialogDescription>
                </DialogHeader>
                <div className="gap-4 mt-2">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleAnnouncementForm)}
                            className="flex flex-col gap-4 w-full"
                        >
                            <FormTextField
                                form={form}
                                name="title"
                                inputPlaceholder="Add a title"
                            />
                            <FormTextAreaField
                                form={form}
                                name="message"
                                inputPlaceholder="Add a message"
                            />
                            <MainButton
                                text={announcementToEdit ? "Save" : "Add Announcement"}
                                loadingText={
                                    announcementToEdit
                                        ? "Saving"
                                        : "Adding Announcement"
                                }
                                isLoading={loading}
                            />
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
