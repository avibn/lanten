"use client";

import { DeleteIconButton } from "@/components/buttons/delete-icon-button";
import { MainButton } from "@/components/buttons/main-button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDeleteMaintenanceRequestMutation } from "@/network/client/maintenance";
import { useRouter } from "next/navigation";

interface DeleteRequestDialogProps {
    requestID: string;
    setDialogOpen: (open: boolean) => void;
}

export function DeleteRequestDialog({
    requestID,
    setDialogOpen,
}: DeleteRequestDialogProps) {
    const router = useRouter();
    const { mutate, isPending, isSuccess, isError, error, reset } =
        useDeleteMaintenanceRequestMutation();

    const onConfirm = () => {
        mutate(requestID);
    };

    if (isError) {
        toast.error(
            "Failed to delete maintenance request. Please try again later."
        );
        reset();
    }

    if (isSuccess) {
        toast.success("Maintenance request deleted successfully.");
        reset();
        setDialogOpen(false);
        router.refresh();
    }

    return (
        <DeleteIconButton
            alertTitle="Remove request"
            alertDescription="Are you sure you want to remove this maintenance request?"
            onConfirm={onConfirm}
            isLoading={isPending}
        >
            <MainButton
                icon={<Trash2 size={18} />}
                text="Delete"
                variant="destructive"
                className="flex-grow"
                isLoading={isPending}
            />
        </DeleteIconButton>
    );
}
