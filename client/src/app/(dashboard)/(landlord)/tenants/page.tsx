// import { RequestsTable } from "./requests-table";

import { ForbiddenError } from "@/network/errors/httpErrors";
import { LeaseTenant } from "@/models/lease-tenant";
import { TenantsTable } from "./tenants-table";
import { getAllTenants } from "@/network/server/tenants";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Maintenance Requests",
    description: "Maintenance Requests",
};

export default async function Page() {
    let leaseTenants: LeaseTenant[] = [];
    try {
        const response = await getAllTenants();
        leaseTenants = response;
    } catch (error) {
        console.error(error);
        if (error instanceof ForbiddenError) {
            redirect("/home");
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold tracking-tight">
                    Your Tenants
                </h3>
            </div>
            <div className="mt-5 flex flex-col gap-4">
                <TenantsTable leaseTenants={leaseTenants} />
            </div>
        </div>
    );
}
