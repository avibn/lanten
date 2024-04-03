"use client";

import { DeleteIconButton } from "@/components/buttons/delete-icon-button";
import { toast } from "sonner";
import { useDeletePaymentMutation } from "@/network/client/payments";
import { useRouter } from "next/navigation";

interface DeletePaymentCLientProps {
    paymentID: string;
}

export function DeletePaymentClient({ paymentID }: DeletePaymentCLientProps) {
    const router = useRouter();
    const { mutate, isPending, isSuccess, isError, error, reset } =
        useDeletePaymentMutation();

    const onConfirm = () => {
        mutate(paymentID);
    };

    if (isError) {
        toast.error("Payment could not be removed. Please try again.");
        reset();
    }

    if (isSuccess) {
        toast.success("Payment removed successfully!");
        reset();
        router.refresh();
    }

    return (
        <DeleteIconButton
            alertTitle="Remove Payment"
            alertDescription="Are you sure you want to remove this payment?"
            onConfirm={onConfirm}
            isLoading={isPending}
        />
    );
}
