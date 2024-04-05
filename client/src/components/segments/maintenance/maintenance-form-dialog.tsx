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
    MaintenanceRequestFormValues,
    maintenanceRequestSchema,
} from "@/schemas/maintenance";
import { useEffect, useState } from "react";

import { Error } from "@/models/error";
import { Form } from "@/components/ui/form";
import { FormComboboxField } from "@/components/forms/fields/form-combobox-field";
import { FormTextAreaField } from "@/components/forms/fields/form-text-area-field";
import { FormUploadField } from "@/components/forms/fields/form-upload-field";
import { MainButton } from "@/components/buttons/main-button";
import { MaintenanceRequestType } from "@/models/maintenance";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/use-auth-store";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useUploadMaintenanceRequestMutation } from "@/network/client/maintenance";
import { zodResolver } from "@hookform/resolvers/zod";

interface MaintenanceFormDialogProps {
    leaseID: string;
    getRequestTypes: () => Promise<MaintenanceRequestType[] | Error>;
}

export function MaintenanceFormDialog({
    leaseID,
    getRequestTypes,
}: MaintenanceFormDialogProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const { mutate, isPending, isSuccess, isError, error, reset } =
        useUploadMaintenanceRequestMutation(leaseID);
    const [requestTypes, setRequestTypes] =
        useState<MaintenanceRequestType[]>();

    useEffect(() => {
        async function asyncFetch() {
            const response = await getRequestTypes();
            if ("error" in response) {
                toast.error(response.error);
            } else {
                setRequestTypes(response);
            }
        }

        asyncFetch();
    }, [getRequestTypes]);

    const form = useForm<MaintenanceRequestFormValues>({
        resolver: zodResolver(maintenanceRequestSchema),
        defaultValues: {
            description: "",
            files: [],
        },
    });

    const handleUpload = async (data: MaintenanceRequestFormValues) => {
        mutate({
            requestTypeId: data.requestTypeId,
            description: data.description,
            files: data.files,
        });
    };

    if (isError) {
        toast.error("Failed to add maintenance request. Please try again.");
        console.error(error);
        reset();
    }

    if (isSuccess) {
        toast.success("Maintenance request created successfully.");

        // Reset form and close dialog
        reset();
        form.reset();
        setDialogOpen(false);

        // Refresh the page
        router.refresh();
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <MainButton text="Add Request" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Maintenance Request</DialogTitle>
                    <DialogDescription>
                        Submit a maintenance request for the property.
                    </DialogDescription>
                </DialogHeader>
                <div className="gap-4 mt-2">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleUpload)}
                            className="flex flex-col gap-4 w-full px-2"
                        >
                            <FormComboboxField
                                form={form}
                                name="requestTypeId"
                                label="Request Type"
                                placeholder="Select request type"
                                options={requestTypes?.map((type) => ({
                                    value: type.id,
                                    label: type.name,
                                }))}
                                optionName="request type"
                                isLoading={!requestTypes}
                            />
                            <FormTextAreaField
                                form={form}
                                name="description"
                                label="Description"
                                inputPlaceholder="Describe the document"
                            />
                            <FormUploadField
                                form={form}
                                name="files"
                                label="Images"
                                inputPlaceholder="Select images"
                                accept={["image/jpeg", "image/png"]}
                                description="Upload up to 5 images to support your request."
                                multiple
                            />
                            <MainButton
                                text="Send Request"
                                loadingText="Sending Request..."
                                isLoading={isPending}
                            />
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
