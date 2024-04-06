import {
    MaintenanceRequest,
    MaintenanceRequestType,
} from "@/models/maintenance";
import {
    getAllMaintenanceRequests,
    getMaintenanceRequestTypes,
} from "@/network/server/maintenance";

import { Error } from "@/models/error";
import { Lease } from "@/models/lease";
import { MaintenanceFormDialog } from "@/components/segments/maintenance/maintenance-form-dialog";
import { RequestsTable } from "./requests-table";
import { WithAuthorized } from "@/providers/with-authorized";
import { getLeasesList } from "@/network/server/leases";

export const metadata = {
    title: "Maintenance Requests",
    description: "Maintenance Requests",
};

export default async function Page() {
    // Get the list of maintenance requests
    let maintenanceRequests: MaintenanceRequest[] = [];
    try {
        const response = await getAllMaintenanceRequests();
        maintenanceRequests = response;
    } catch (error) {
        console.error(error);
    }

    const getRequestTypes = async (): Promise<
        MaintenanceRequestType[] | Error
    > => {
        "use server";

        try {
            const response = await getMaintenanceRequestTypes();
            return response;
        } catch (error) {
            console.error(error);
            return { error: "Failed to load request types" };
        }
    };

    const getListOfLeases = async (): Promise<Partial<Lease>[] | Error> => {
        "use server";

        try {
            const response = await getLeasesList();
            return response;
        } catch (error) {
            console.error(error);
            return { error: "Failed to load leases list" };
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold tracking-tight">
                    <WithAuthorized role="TENANT">My Requests</WithAuthorized>
                    <WithAuthorized role="LANDLORD">
                        All Requests
                    </WithAuthorized>
                </h3>
                <WithAuthorized role="TENANT">
                    <MaintenanceFormDialog
                        getRequestTypes={getRequestTypes}
                        getLeasesList={getListOfLeases}
                    />
                </WithAuthorized>
            </div>
            <div className="mt-5 flex flex-col gap-4">
                <RequestsTable requests={maintenanceRequests} />
            </div>
        </div>
    );
}
