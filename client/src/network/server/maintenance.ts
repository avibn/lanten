import { MaintenanceRequest } from "@/models/maintenance";
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
