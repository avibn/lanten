import { Card, CardHeader } from "@/components/ui/card";

import { AddButton } from "@/components/buttons/add-button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { Lease } from "@/models/lease";
import Link from "next/link";
import { WithAuthorized } from "@/providers/with-authorized";
import { formatTimeToDateString } from "@/utils/format-time";
import { getLeases } from "@/network/server/leases";
import { getSessionUser } from "@/network/server/users";

export const metadata = {
    title: "Leases",
    description: "Leases",
};

export default async function Page() {
    // Get session user
    // Todo:: can get it from useAuthStore in client
    const user = await getSessionUser();

    // Get the list of leases
    let leases: Lease[];
    try {
        leases = await getLeases();
    } catch (error) {
        leases = [];
    }

    const activeLeases = leases.filter((lease) => !lease.isDeleted);
    // todo:: add inactive leases

    return (
        <div className="page-content">
            <div className="flex items-center justify-between title-text">
                <h3 className="text-xl font-semibold tracking-tight">
                    {user?.userType === "LANDLORD"
                        ? "Active Leases"
                        : "Your Leases"}
                </h3>
                <WithAuthorized role="LANDLORD">
                    <AddButton text="Create Lease" href="/leases/create" />
                </WithAuthorized>
            </div>
            <div className="mt-5 flex flex-col gap-4">
                {activeLeases.map((lease) => (
                    <Link key={lease.id} href={`/leases/${lease.id}`}>
                        <Card className="hover-card">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center">
                                        <h3 className="text-xl font-semibold tracking-tight">
                                            {lease.property?.name}
                                        </h3>
                                        <p className="ml-3 text-sm font-light">
                                            {formatTimeToDateString(
                                                lease.startDate
                                            )}{" "}
                                            -{" "}
                                            {formatTimeToDateString(
                                                lease.endDate
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex flex-row gap-1">
                                        <Badge variant="default">
                                            Rent: £{lease.totalRent}
                                        </Badge>
                                        <Badge variant="outline">
                                            {lease._count?.tenants} Tenants
                                        </Badge>
                                        <Badge variant="outline">
                                            {lease._count?.payments} Payments
                                        </Badge>
                                        <Badge variant="outline">
                                            {lease._count?.announcements}{" "}
                                            Announcements
                                        </Badge>
                                    </div>
                                </div>
                                <div
                                    className="flex items-center self-stretch px-5 transform
                                hover:-translate-y-1 transition-transform duration-200"
                                >
                                    <ChevronRight size={24} />
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
