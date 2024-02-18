"use client";

import { BadRequestError } from "@/network/errors/httpErrors";
import { CreatePropertyForm } from "@/components/forms/create-property-form";
import { PropertyFormValues } from "@/schemas/property";
import { toast } from "sonner";
import { useCreatePropertyMutation } from "@/network/client/properties";
import { useRouter } from "next/navigation";

export function CreatePropertyClient() {
    const { data, mutate, isPending, error, isSuccess, isError } =
        useCreatePropertyMutation();
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
        toast.success("Property created successfully!");
        router.push("/properties");
        router.refresh();
    }

    return (
        <div className="flex justify-center h-screen">
            <div className="w-1/2">
                <CreatePropertyForm onSubmit={onSubmit} loading={isPending} />
            </div>
        </div>
    );
}
