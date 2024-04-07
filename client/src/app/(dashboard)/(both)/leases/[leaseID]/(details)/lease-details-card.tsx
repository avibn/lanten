import { Card, CardHeader } from "@/components/ui/card";
import { Mail, MessageCircle } from "lucide-react";
import { formatTime, formatTimeToDateString } from "@/utils/format-time";

import { IconButton } from "@/components/buttons/icon-button";
import { Lease } from "@/models/lease";
import Link from "next/link";
import { WithAuthorized } from "@/providers/with-authorized";

interface LeaseDetailsCardProps {
    lease: Lease;
}

export default function LeaseDetailsCard({ lease }: LeaseDetailsCardProps) {
    // Lease date range string
    const leaseDates = `${formatTimeToDateString(
        lease.startDate
    )} - ${formatTimeToDateString(lease.endDate)}`;

    // Work out the duration of the lease in months
    const leaseStart = new Date(lease.startDate);
    const leaseEnd = new Date(lease.endDate);
    const leaseDurationMonths =
        (leaseEnd.getFullYear() - leaseStart.getFullYear()) * 12 +
        leaseEnd.getMonth() -
        leaseStart.getMonth();

    return (
        <Card className="flex-1">
            <CardHeader>
                <div className="grid grid-cols-2 gap-3">
                    <p className="font-medium leading-none">Duration</p>
                    <p>
                        {leaseDates}{" "}
                        <span className="whitespace-nowrap">
                            ({leaseDurationMonths} months)
                        </span>
                    </p>
                    <p className="font-medium leading-none">Total Rent</p>
                    <p>£{lease.totalRent} / month</p>
                    <p className="font-medium leading-none">Property</p>
                    <p>
                        <WithAuthorized role="LANDLORD">
                            <Link
                                href={`/properties/${lease.propertyId}`}
                                className="link-primary"
                            >
                                {lease.property?.name}
                            </Link>
                        </WithAuthorized>
                        <WithAuthorized role="TENANT">
                            {lease.property?.name}
                        </WithAuthorized>
                    </p>
                    <p className="font-medium leading-none">Address</p>
                    <p>{lease.property?.address}</p>
                    <p className="font-medium leading-none">Landlord</p>
                    <div className="flex items-center gap-3">
                        <p>
                            {lease.property?.landlord?.name || "Unknown"} (
                            {lease.property?.landlord?.email || "Unknown"})
                        </p>
                        <WithAuthorized role="TENANT">
                            <div className="flex items-center gap-1">
                                <IconButton
                                    icon={<MessageCircle size={14} />}
                                    href={`/messages/${lease.property?.landlord?.id}`}
                                />
                                <IconButton
                                    icon={<Mail size={14} />}
                                    href={`mailto:${lease.property?.landlord?.email}`}
                                    hrefNewTab
                                />
                            </div>
                        </WithAuthorized>
                    </div>
                    {lease.updatedAt > lease.createdAt ? (
                        <>
                            <p className="font-medium leading-none">
                                Last Updated
                            </p>
                            <p>{formatTime(lease.updatedAt)}</p>
                        </>
                    ) : (
                        <>
                            <p className="font-medium leading-none">Created</p>
                            <p>{formatTime(lease.createdAt)}</p>
                        </>
                    )}
                </div>
            </CardHeader>
        </Card>
    );
}
