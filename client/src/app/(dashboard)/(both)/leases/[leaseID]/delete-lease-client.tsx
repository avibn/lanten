"use client";

import { DeleteButton } from "@/components/buttons/delete-button";
import { toast } from "sonner";
import { useDeleteLeaseMutation } from "@/network/client/leases";
import { useRouter } from "next/navigation";

interface DeleteLeaseCLientProps {
    leaseID: string;
}

export function DeleteLeaseClient({ leaseID }: DeleteLeaseCLientProps) {
    const router = useRouter();
    const { mutate, isPending, isSuccess, isError, error } =
        useDeleteLeaseMutation();

    const onConfirm = () => {
        mutate(leaseID);
    };

    if (isError) {
        toast.error("Lease could not be deleted. Please try again.");
    }

    if (isSuccess) {
        toast.success("Lease deleted successfully!");
        router.push("/leases");
        router.refresh();
    }

    return (
        <DeleteButton
            text="Delete Lease"
            alertTitle="Delete Lease"
            alertDescription={
                <>
                    <b className="text-red-500">
                        This will also delete all associated payments,
                        announcements, documents, and other data.
                    </b>
                    <br />
                    Are you sure you want to delete this lease?
                </>
            }
            onConfirm={onConfirm}
            isLoading={isPending}
        />
    );
}
