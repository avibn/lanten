"use client";

import { DeleteIconButton } from "@/components/buttons/delete-icon-button";
import { revalidateTag } from "next/cache";
import { toast } from "sonner";
import { useDeleteAnnouncementMutation } from "@/network/client/announcements";
import { useRouter } from "next/navigation";

interface DeleteAnnouncementCLientProps {
    announcementID: string;
}

export function DeleteAnnouncementClient({
    announcementID,
}: DeleteAnnouncementCLientProps) {
    const router = useRouter();
    const { mutate, isPending, isSuccess, isError, error, reset } =
        useDeleteAnnouncementMutation();

    const onConfirm = () => {
        mutate(announcementID);
    };

    if (isError) {
        toast.error("Announcement could not be removed. Please try again.");
        reset();
    }

    if (isSuccess) {
        toast.success("Announcement removed successfully!");
        reset();
        router.refresh();
    }

    return (
        <DeleteIconButton
            alertTitle="Remove Announcement"
            alertDescription="Are you sure you want to remove this announcement?"
            onConfirm={onConfirm}
            isLoading={isPending}
        />
    );
}
