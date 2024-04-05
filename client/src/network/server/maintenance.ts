import {
    MaintenanceRequest,
    MaintenanceRequestType,
} from "@/models/maintenance";

import { fetchDataServer } from "../helpers/fetch-data-server";

export async function getMaintenanceRequests(
    leaseId: string,
    maxResults: number
): Promise<MaintenanceRequest[]> {
    const response = await fetchDataServer(
        `/leases/${leaseId}/maintenance/requests${
            maxResults ? `?max=${maxResults}` : ""
        }`,
        {
            next: {
                revalidate: 0,
                tags: ["LeaseMaintenance"],
            },
        }
    );
    return await response.json();
}

export async function getMaintenanceRequestTypes(): Promise<
    MaintenanceRequestType[]
> {
    const response = await fetchDataServer("/maintenance/types", {
        next: {
            revalidate: 1 * 60 * 60, // 1 hour
            tags: ["MaintenanceTypes"],
        },
    });
    return await response.json();
}
