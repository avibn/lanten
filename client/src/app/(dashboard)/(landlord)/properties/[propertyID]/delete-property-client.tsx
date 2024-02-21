"use client";

import { DeleteButton } from "@/components/buttons/delete-button";
import { toast } from "sonner";
import { useDeletePropertyMutation } from "@/network/client/properties";
import { useRouter } from "next/navigation";

interface DeletePropertyCLientProps {
    propertyID: string;
}

export function DeletePropertyCLient({
    propertyID,
}: DeletePropertyCLientProps) {
    const router = useRouter();
    const { mutate, isPending, isSuccess, isError, error } =
        useDeletePropertyMutation();

    const onConfirm = () => {
        mutate(propertyID);
    };

    if (isError) {
        toast.error("Property could not be deleted. Please try again.");
    }

    if (isSuccess) {
        toast.success("Property deleted successfully!");
        router.push("/properties");
        router.refresh();
    }

    return (
        <DeleteButton
            text="Delete Property"
            alertTitle="Delete Property"
            alertDescription={
                <>
                    <b className="text-red-500">
                        This will also delete all leases associated with this
                        property.
                    </b>
                    <br />
                    Are you sure you want to delete this property?
                </>
            }
            onConfirm={onConfirm}
            isLoading={isPending}
        />
    );
}
