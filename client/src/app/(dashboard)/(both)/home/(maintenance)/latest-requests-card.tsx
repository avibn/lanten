import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import CardError from "@/components/card-error";
import { MainButton } from "@/components/buttons/main-button";
import { MaintenanceDialog } from "@/components/segments/maintenance/maintenance-dialog";
import { MaintenanceRequest } from "@/models/maintenance";
import { RequestBadge } from "@/components/segments/maintenance/request-badge";
import { formatTimeToDateString } from "@/utils/format-time";
import { getAllMaintenanceRequests } from "@/network/server/maintenance";

export async function LatestRequestsCard() {
    let maintenanceRequests: MaintenanceRequest[] = [];
    try {
        const response = await getAllMaintenanceRequests(5);
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
                        Latest Maintenance Requests
                    </CardTitle>
                    <MainButton
                        text={`View All Requests`}
                        variant="link"
                        href={`/maintenance`}
                    />
                </div>
                {maintenanceRequests.length === 0 && (
                    <p className="text-gray-500 text-sm">
                        No maintenance requests to display.
                    </p>
                )}
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
                                <RequestBadge status={request.status} />
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
