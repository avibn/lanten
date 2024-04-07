import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import CardError from "@/components/card-error";
import { Lease } from "@/models/lease";
import Link from "next/link";
import { MainButton } from "@/components/buttons/main-button";
import { formatTimeToDateString } from "@/utils/format-time";
import { getLeases } from "@/network/server/leases";

export async function LatestLeasesCard() {
    let leases: Lease[] = [];
    try {
        const response = await getLeases();
        leases = response;
    } catch (error) {
        console.error(error);
        return <CardError message="Failed to load maintenance requests" />;
    }

    return (
        <Card className="flex-1">
            <CardHeader className="pb-4 h-full">
                <div className="flex items-center justify-between w-full">
                    <CardTitle className="text-lg font-medium">
                        Your Leases
                    </CardTitle>
                    <MainButton
                        text={`View All Leases`}
                        variant="link"
                        href={`/leases`}
                    />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                    <ScrollArea>
                        <div className="flex flex-row items-center w-96 gap-4 mb-4">
                            {leases.length === 0 && (
                                <p className="text-gray-500 text-sm">
                                    No leases to display.
                                </p>
                            )}
                            {leases.map((lease) => (
                                <Link
                                    key={lease.id}
                                    href={`/leases/${lease.id}`}
                                    passHref
                                >
                                    <div className="rounded-md border whitespace-nowrap p-3 hover-card">
                                        <p className="font-semibold">
                                            {lease.property?.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatTimeToDateString(
                                                lease.startDate
                                            )}{" "}
                                            -{" "}
                                            {formatTimeToDateString(
                                                lease.endDate
                                            )}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            </CardHeader>
        </Card>
    );
}
