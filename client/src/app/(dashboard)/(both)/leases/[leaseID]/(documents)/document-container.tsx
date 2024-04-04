"use client";

import { Document as Doc } from "@/models/document";
import LoadingSpinner from "@/components/loading-spinner";
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
            <p className="truncate w-1/2 max-w-[200px] text-gray-600">
                {document.name}
            </p>
            <p>{document.fileType}</p>
            {loading && <LoadingSpinner size={4} textOff className="ml-2" />}
        </div>
    );
}
