"use client";

import { BadRequestError } from "@/network/errors/httpErrors";
import { CreateLeaseForm } from "@/components/forms/create-lease-form";
import { Lease } from "@/models/lease";
import { LeaseUpdateFormValues } from "@/schemas/lease";
import { cn } from "@/utils/tw-merge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUpdateLeaseMutation } from "@/network/client/leases";

interface EditLeaseClientProps {
    className?: string;
    lease: Lease;
}

export function EditLeaseClient({ lease, className }: EditLeaseClientProps) {
    const { mutate, isPending, error, isSuccess, isError } =
        useUpdateLeaseMutation(lease.id);
    const router = useRouter();

    const onSubmit = async (values: LeaseUpdateFormValues) => {
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
        toast.success("Lease updated successfully!");
        router.push(`/leases/${lease.id}`);
        router.refresh();
    }

    return (
        <div className={cn("flex justify-center h-screen", className)}>
            <div className="w-1/2">
                <CreateLeaseForm
                    onSubmit={onSubmit}
                    defaultValues={lease}
                    loading={isPending}
                    edit
                />
            </div>
        </div>
    );
}
