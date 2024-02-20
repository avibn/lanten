"use client";

import { BadRequestError } from "@/network/errors/httpErrors";
import { CreatePropertyForm } from "@/components/forms/create-property-form";
import { Property } from "@/models/property";
import { PropertyFormValues } from "@/schemas/property";
import { cn } from "@/utils/tw-merge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUpdatePropertyMutation } from "@/network/client/properties";

interface EditPropertyClientProps {
    className?: string;
    property: Property;
}

export function EditPropertyClient({
    property,
    className,
}: EditPropertyClientProps) {
    const { mutate, isPending, error, isSuccess, isError } =
        useUpdatePropertyMutation(property.id);
    const router = useRouter();

    const onSubmit = async (values: PropertyFormValues) => {
        // Send the form data to the server
        mutate(values);
    };

    if (isError) {
        if (error instanceof BadRequestError) {
            toast.error("Invalid data provided. Please try again.");
        } else {
            toast.error("Something went wrong!");
        }
    }

    if (isSuccess) {
        toast.success("Property updated successfully!");
        router.push(`/properties/${property.id}`);
        router.refresh();
    }

    return (
        <div className={cn("flex justify-center h-screen", className)}>
            <div className="w-1/2">
                <CreatePropertyForm
                    onSubmit={onSubmit}
                    defaultValues={property}
                    loading={isPending}
                />
            </div>
        </div>
    );
}
