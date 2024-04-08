"use client";

import { PropertyFormValues, propertySchema } from "@/schemas/property";

import { Form } from "@/components/ui/form";
import { FormTextField } from "@/components/forms/fields/form-text-field";
import { FormUploadField } from "./fields/form-upload-field";
import { MainButton } from "@/components/buttons/main-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface CreatePropertyFormProps {
    onSubmit(values: any): void;
    loading?: boolean;
    defaultValues?: PropertyFormValues;
}

export function CreatePropertyForm({
    onSubmit,
    loading,
    defaultValues,
}: CreatePropertyFormProps) {
    const form = useForm<PropertyFormValues>({
        resolver: zodResolver(propertySchema),
        defaultValues: {
            name: "",
            description: "",
            address: "",
            ...defaultValues,
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormTextField
                    form={form}
                    name="name"
                    label="Name"
                    inputPlaceholder="Property A"
                    description="This is the custom name for your property."
                />
                <FormTextField
                    form={form}
                    name="description"
                    label="Description"
                    inputPlaceholder="Extra information about property"
                    description="This is the description of your property."
                />
                <FormTextField
                    form={form}
                    name="address"
                    label="Address"
                    inputPlaceholder="1 Main Road, City, County, Postcode"
                    description="This is the address of your property."
                />
                <FormUploadField
                    form={form}
                    name="file"
                    label="Banner Image"
                    inputPlaceholder="Select an image"
                    accept={["image/png", "image/jpeg", "image/jpg"]}
                />
                <MainButton
                    text={defaultValues ? "Update Property" : "Create Property"}
                    loadingText={
                        defaultValues
                            ? "Updating Property..."
                            : "Creating Property..."
                    }
                    isLoading={loading}
                    className="w-full"
                />
            </form>
        </Form>
    );
}
