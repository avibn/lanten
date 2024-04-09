import { MaintenanceRequest } from "@/models/maintenance";
import { SharedMaintenanceClient } from "./shared-maintenance-client";
import { getSharedMaintenanceRequest } from "@/network/server/maintenance";

interface PageProps {
    params: {
        sharedID: string;
    };
}

export default async function Page({ params: { sharedID } }: PageProps) {
    let maintenanceRequest: MaintenanceRequest;
    try {
        maintenanceRequest = await getSharedMaintenanceRequest(sharedID);
    } catch (error) {
        console.error(error);
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <p className="text-red-500">
                    Failed to load maintenance request. Please try again later.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center h-full w-full pt-10">
            <SharedMaintenanceClient maintenanceRequest={maintenanceRequest} />
        </div>
    );
}
