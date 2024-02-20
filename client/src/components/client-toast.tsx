"use client";

import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ClientToastProps {
    message: string;
    type: "error" | "success";
}

const errorMessages: { [key: string]: string } = {
    UnauthorizedPageAccess: "You are not authorized to access this page.",
};

export function ClientToast({ message, type }: ClientToastProps) {
    const router = useRouter();
    useEffect(() => {
        if (type === "error") {
            setTimeout(() => {
                toast.error(errorMessages[message] || "An error occurred.");
            }, 0);
        } else if (type === "success") {
            toast.success(message);
        }
    }, [message, type]);

    return <></>;
}
