"use client";

import { BadRequestError } from "@/network/errors/httpErrors";
import { CreateLeaseForm } from "@/components/forms/create-lease-form";
import { LeaseCreateFormValues } from "@/schemas/lease";
import { Property } from "@/models/property";
import { cn } from "@/utils/tw-merge";
import { toast } from "sonner";
import { useCreateLeaseMutation } from "@/network/client/leases";
import { useRouter } from "next/navigation";

interface CreateLeaseClientProps {
    className?: string;
    selectedProperty?: string;
    properties: Property[];
}

export function CreateLeaseClient({
    className,
    selectedProperty,
    properties,
}: CreateLeaseClientProps) {
    const { data, mutate, isPending, error, isSuccess, isError } =
        useCreateLeaseMutation();
    const router = useRouter();

    const onSubmit = async (values: LeaseCreateFormValues) => {
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
        toast.success("Lease created successfully!");
        router.push("/leases");
        router.refresh();
    }

    // If property is selected, set it as the default value
    const defaultValues = selectedProperty
        ? { propertyId: selectedProperty }
        : {};

    return (
        <div className={cn("flex justify-center h-screen", className)}>
            <div className="w-1/2">
                <CreateLeaseForm
                    properties={properties}
                    onSubmit={onSubmit}
                    loading={isPending}
                    defaultValues={defaultValues}
                />
            </div>
        </div>
    );
}
