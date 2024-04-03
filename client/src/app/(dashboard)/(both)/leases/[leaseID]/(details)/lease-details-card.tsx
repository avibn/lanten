import { Card, CardHeader } from "@/components/ui/card";
import { formatTime, formatTimeToDateString } from "@/utils/format-time";

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
