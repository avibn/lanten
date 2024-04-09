"use client";

import { Mail, Printer } from "lucide-react";

import { IconButton } from "@/components/buttons/icon-button";
import Image from "next/image";
import { MaintenanceRequest } from "@/models/maintenance";
import { RequestBadge } from "@/components/segments/maintenance/request-badge";
import { formatTime } from "@/utils/format-time";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

interface SharedMaintenanceClientProps {
    maintenanceRequest: MaintenanceRequest;
}

export function SharedMaintenanceClient({
    maintenanceRequest,
}: SharedMaintenanceClientProps) {
    // Ref to the content to print
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        documentTitle: `Maintenance Request - ${maintenanceRequest.id}`,
        onBeforePrint: () => console.log("Printing..."),
        onAfterPrint: () => console.log("Printed!"),
        removeAfterPrint: true,
    });

    // Print the content
    const print = () => {
        handlePrint(null, () => contentToPrint.current);
    };

    return (
        <div>
            <div className="flex flex-row justify-between w-full px-10">
                <h1 className="text-xl font-semibold">Maintenance Request</h1>
                <IconButton icon={<Printer size={16} />} onClick={print} />
            </div>

            <div
                ref={contentToPrint}
                className="px-10 py-16 flex flex-col gap-10 text-base"
            >
                <div className="grid grid-cols-2 gap-2">
                    <p className="font-semibold">Description:</p>
                    <p className="max-w-md break-words">
                        {maintenanceRequest.description}
                    </p>
                    <p className="font-semibold">Request Type:</p>
                    <p>{maintenanceRequest.requestType.name}</p>
                    <p className="font-semibold">Status:</p>
                    <RequestBadge status={maintenanceRequest.status} />
                    <p className="font-semibold">Property Address:</p>
                    <p>{maintenanceRequest.lease?.property?.address}</p>
                    <p className="font-semibold">Landlord Email:</p>
                    <div className="flex flex-row items-center gap-3">
                        <p>
                            {
                                maintenanceRequest.lease?.property?.landlord
                                    ?.email
                            }
                        </p>
                        <IconButton
                            icon={<Mail size={14} />}
                            href={`mailto:${maintenanceRequest.lease?.property?.landlord?.email}`}
                            hrefNewTab
                        />
                    </div>

                    {maintenanceRequest.author && (
                        <>
                            <p className="font-semibold">Author Email:</p>
                            <div className="flex flex-row items-center gap-3">
                                <p>{maintenanceRequest.author?.email}</p>
                                <IconButton
                                    icon={<Mail size={14} />}
                                    href={`mailto:${maintenanceRequest.author?.email}`}
                                    hrefNewTab
                                />
                            </div>
                        </>
                    )}
                    <p className="font-semibold">Created:</p>
                    <p>{formatTime(maintenanceRequest.createdAt)}</p>
                    <p className="font-semibold">Last Updated:</p>
                    <p>{formatTime(maintenanceRequest.updatedAt)}</p>
                </div>
                {maintenanceRequest.images.length > 0 && (
                    <div>
                        <p className="font-semibold mb-3">Images:</p>
                        <div className="flex flex-col gap-10">
                            {maintenanceRequest.images.map((image) => (
                                <Image
                                    key={image.id}
                                    src={image.url}
                                    alt={image.fileName || "Maintenance Image"}
                                    height="393"
                                    width="700"
                                    className="rounded-xl"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
