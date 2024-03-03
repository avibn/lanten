import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime, formatTimeToDateString } from "@/utils/format-time";

import CardLoadingSkeleton from "@/components/card-loading-skeleton";
import CardTenats from "./card-tenants";
import { Error } from "@/models/error";
import { InfoEditDialog } from "./info-edit-dialog";
import { Lease } from "@/models/lease";
import Link from "next/link";
import { MainButton } from "@/components/buttons/main-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import { UpdateLeaseDescriptionFormValues } from "@/schemas/lease";
import { User } from "@/models/user";
import { revalidateTag } from "next/cache";
import { sanitizeText } from "@/utils/sanitizeText";
import { updateLeaseDescription } from "@/network/server/leases";

interface LandlordPageProps {
    user: User;
    lease: Lease;
}

export function LandlordPage({ user, lease }: LandlordPageProps) {
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

    // todo:: lease.tenants shouldnt return password!!

    const editLeaseInfo = async (
        data: UpdateLeaseDescriptionFormValues
    ): Promise<Lease | Error> => {
        "use server";
        try {
            const response = await updateLeaseDescription(
                lease.id,
                data.description
            );
            revalidateTag("leases");
            return response;
        } catch (error) {
            return { error: "Something went wrong!" };
        }
    };

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
                        <div className="flex items-center justify-between w-full">
                            <CardTitle className="text-lg font-medium">
                                Lease Information
                            </CardTitle>
                            <InfoEditDialog
                                description={lease.description}
                                editLeaseInfo={editLeaseInfo}
                            />
                        </div>
                        {lease.description ? (
                            <ScrollArea>
                                <div
                                    dangerouslySetInnerHTML={sanitizeText(
                                        lease.description
                                    )}
                                    className="max-h-48 rich-text-area"
                                ></div>
                            </ScrollArea>
                        ) : (
                            <p>A description has not been added yet.</p>
                        )}
                    </CardHeader>
                </Card>
            </div>
            <div className="flex flex-col xl:flex-row gap-4 w-full">
                <Suspense
                    fallback={
                        <CardLoadingSkeleton loadingText="Loading tenants" />
                    }
                >
                    <CardTenats lease={lease} />
                </Suspense>
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
