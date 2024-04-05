import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
    MaintenanceRequest,
    STATUS_BACKGROUND_COLORS,
    STATUS_TEXT,
} from "@/models/maintenance";

import CardError from "@/components/card-error";
import { Lease } from "@/models/lease";
import { MainButton } from "@/components/buttons/main-button";
import { MaintenanceDialog } from "./maintenance-dialog";
import { WithAuthorized } from "@/providers/with-authorized";
import { formatTimeToDateString } from "@/utils/format-time";
import { getMaintenanceRequests } from "@/network/server/maintenance";

interface MaintenanceCardProps {
    lease: Lease;
}

export default async function MaintenanceCard({ lease }: MaintenanceCardProps) {
    let maintenanceRequests: MaintenanceRequest[] = [];
    try {
        const response = await getMaintenanceRequests(lease.id, 5);
        maintenanceRequests = response;
    } catch (error) {
        console.error(error);
        return <CardError message="Failed to load maintenance requests" />;
    }

    return (
        <Card className="flex-1">
            <CardHeader>
                <div className="flex items-center justify-between w-full">
                    <CardTitle className="text-lg font-medium">
                        Maintenance Requests
                    </CardTitle>
                    <WithAuthorized role="TENANT">
                        <MainButton text="Add Request" />
                    </WithAuthorized>
                </div>
                <p className="text-gray-500">Latest requests:</p>
                {maintenanceRequests.map((request) => (
                    <MaintenanceDialog
                        key={request.id}
                        maintenanceRequest={request}
                    >
                        <div
                            className={
                                "flex flex-col gap-2 justify-between items-center px-3 w-full border rounded p-2 text-sm " +
                                "cursor-pointer hover:bg-gray-50 transition-colors ease-in-out duration-200 "
                            }
                        >
                            <div className="flex flex-row gap-1 items-center justify-between w-full">
                                <p>{request.requestType.name}</p>
                                <p className="text-gray-600 text-sm">
                                    {formatTimeToDateString(request.createdAt)}
                                </p>
                                <span
                                    className={`${
                                        STATUS_BACKGROUND_COLORS[request.status]
                                    } px-1 py-1 rounded-full`}
                                >
                                    {STATUS_TEXT[request.status] ||
                                        request.status}
                                </span>
                            </div>
                            <p className="truncate w-full max-w-[200px]">
                                {request.description}
                            </p>
                        </div>
                    </MaintenanceDialog>
                ))}
            </CardHeader>
        </Card>
    );
}
