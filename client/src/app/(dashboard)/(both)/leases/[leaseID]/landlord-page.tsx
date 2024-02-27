import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime, formatTimeToDateString } from "@/utils/format-time";

import { Lease } from "@/models/lease";
import Link from "next/link";
import { MainButton } from "@/components/buttons/main-button";
import { Separator } from "@/components/ui/separator";
import { User } from "@/models/user";

interface LandlordPageProps {
    user: User;
    lease: Lease;
}

export function LandlordPage({ user, lease }: LandlordPageProps) {
    const leaseDates = `${formatTimeToDateString(
        lease.startDate
    )} - ${formatTimeToDateString(lease.endDate)}`;

    const leaseDurationMonths =
        (new Date(lease.endDate).getMonth() -
            new Date(lease.startDate).getMonth() +
            12) %
        12;

    return (
        <>
            <div className="flex flex-col xl:flex-row gap-4 w-full">
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
                            <p className="font-medium leading-none">
                                Total Rent
                            </p>
                            <p>£{lease.totalRent} / month</p>
                            <p className="font-medium leading-none">Property</p>
                            <p>
                                <Link
                                    href={`/properties/${lease.propertyId}`}
                                    className="link-primary"
                                >
                                    {lease.property?.name}
                                </Link>
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
                                    <p className="font-medium leading-none">
                                        Created
                                    </p>
                                    <p>{formatTime(lease.createdAt)}</p>
                                </>
                            )}
                        </div>
                    </CardHeader>
                </Card>
                <Card className="flex-1">
                    <CardHeader>
                        <div className="grid grid-cols-2 gap-3">
                            <p className="font-medium leading-none">Tenants</p>
                            <p>{lease._count?.tenants}</p>
                            <p className="font-medium leading-none">Payments</p>
                            <p>{lease._count?.payments}</p>
                        </div>
                    </CardHeader>
                </Card>
            </div>
            <div className="flex flex-col xl:flex-row gap-4 w-full">
                <Card className="flex-1">
                    <CardHeader>
                        <div className="flex items-center justify-between w-full">
                            <CardTitle className="text-lg font-medium">
                                Tenants ({lease._count?.tenants})
                            </CardTitle>
                            <MainButton text="Add Tenant" />
                        </div>
                        <ul>
                            {lease.tenants?.map((tenant) => (
                                <li key={tenant.id}>{tenant.email}</li>
                            ))}
                        </ul>
                    </CardHeader>
                </Card>
                <Card className="flex-1">
                    <CardHeader>
                        <div className="flex items-center justify-between w-full">
                            <CardTitle className="text-lg font-medium">
                                Payments ({lease._count?.payments})
                            </CardTitle>
                            <MainButton text="Add Payment" />
                        </div>
                    </CardHeader>
                </Card>
            </div>
            <div className="flex flex-col xl:flex-row gap-4 w-full">
                <Card className="flex-1">
                    <CardHeader>
                        <div className="flex items-center justify-between w-full mb-3">
                            <CardTitle className="text-lg font-medium">
                                Announcement Board
                            </CardTitle>
                            {/* View all link */}
                            <MainButton text="View All" variant="link" />
                        </div>
                        <Separator />
                        <div>
                            <p className="text-lg leading-none mb-2">
                                Announcement title
                            </p>
                            <p>Announcement content</p>
                        </div>
                        <Separator />
                    </CardHeader>
                </Card>
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">
                            Maintenance Requests
                        </CardTitle>
                        <p className="text-gray-500">Latest requests:</p>
                        <p>Coming soon...</p>
                    </CardHeader>
                </Card>
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">
                            Documents
                        </CardTitle>
                        <p>Coming soon...</p>
                    </CardHeader>
                </Card>
            </div>
        </>
    );
}
