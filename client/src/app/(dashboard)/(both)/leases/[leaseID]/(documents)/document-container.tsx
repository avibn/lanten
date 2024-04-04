"use client";

import { File, Link } from "lucide-react";

import { Document as Doc } from "@/models/document";
import { DocumentDialog } from "./document-dialog";
import { IconButton } from "@/components/buttons/icon-button";
import LoadingSpinner from "@/components/loading-spinner";
import { formatTimeToDateString } from "@/utils/format-time";
import { useState } from "react";

interface DocumentContainerProps {
    document: Doc;
}

export default function DocumentContainer({
    document,
}: DocumentContainerProps) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        // Open document in new tab
        window.open(`/documents/${document.id}`, "_blank");
        setLoading(false);
    };

    // Map file mime type to tailwind color
    const fileMimeToColor: { [key: string]: string } = {
        "application/pdf": "text-red-500",
        "application/msword": "text-blue-500",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            "text-blue-500",
    };

    return (
        <DocumentDialog loading={loading} document={document}>
            <div
                key={document.id}
                className={
                    "flex flex-row gap-1 items-center justify-between w-full border rounded p-2 text-sm " +
                    "cursor-pointer hover:bg-gray-50 transition-colors ease-in-out duration-200 " +
                    (loading ? "!cursor-not-allowed opacity-50" : "")
                }
                // onClick={handleClick}
            >
                <File
                    size={18}
                    className={fileMimeToColor[document.fileType]}
                />
                <p className="truncate w-1/2 max-w-[200px]">{document.name}</p>
                <p className="text-gray-600 text-sm">
                    {formatTimeToDateString(document.createdAt)}
                </p>
                <a
                    target="_blank"
                    href={`/documents/${document.id}`}
                    rel="noreferrer noopener"
                    className="z-50"
                    onClick={(event) => event.stopPropagation()}
                >
                    <IconButton
                        icon={
                            <>
                                {loading ? (
                                    // Center this
                                    <LoadingSpinner
                                        size={4}
                                        textOff
                                        className="ml-2"
                                    />
                                ) : (
                                    <Link size={14} />
                                )}
                            </>
                        }
                        variant="outline"
                        isDisabled={loading}
                    />
                </a>
            </div>
        </DocumentDialog>
    );
}
