"use client";

import { Error } from "@/models/error";
import { IconButton } from "@/components/buttons/icon-button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface DeleteReminderClientProps {
    reminderID: string;
    handleDelete: (reminderID: string) => Promise<Error | undefined>;
}

export function DeleteReminderClient({
    reminderID,
    handleDelete,
}: DeleteReminderClientProps) {
    const [loading, setLoading] = useState(false);

    const handleDeleteClick = async () => {
        setLoading(true);
        const response = await handleDelete(reminderID);
        if (response && "error" in response) {
            toast.error("Something went wrong. Please try again later.");
        }
        setLoading(false);
    };

    return (
        <IconButton
            icon={<Trash2 size={16} className="text-red-600" />}
            onClick={handleDeleteClick}
            isDisabled={loading}
        />
    );
}
