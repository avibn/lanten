"use client";

import { Document as Doc } from "@/models/document";
import { File } from "lucide-react";
import LoadingSpinner from "@/components/loading-spinner";
import { formatTimeToDateString } from "@/utils/format-time";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DocumentContainerProps {
    document: Doc;
}

export default function DocumentContainer({
    document,
}: DocumentContainerProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        // Open document in new tab
        window.open(`/documents/${document.id}`, "_blank");
        setLoading(false);
    };

    const fileMimeToColor: { [key: string]: string } = {
        "application/pdf": "text-red-500",
        "application/msword": "text-blue-500",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            "text-blue-500",
    };

    return (
        <div
            key={document.id}
            className={
                "flex flex-row gap-1 items-center justify-between w-full border rounded p-2 text-sm " +
                "cursor-pointer hover:bg-gray-100 transition-colors ease-in-out duration-200 " +
                (loading ? "cursor-not-allowed opacity-50" : "")
            }
            onClick={handleClick}
        >
            <File size={18} className={fileMimeToColor[document.fileType]} />
            <p className="truncate w-1/2 max-w-[200px]">{document.name}</p>
            <p className="text-gray-600">
                {formatTimeToDateString(document.createdAt)}
            </p>
            {loading && <LoadingSpinner size={4} textOff className="ml-2" />}
        </div>
    );
}
