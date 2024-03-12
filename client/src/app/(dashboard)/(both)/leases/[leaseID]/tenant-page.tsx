import AnnouncementsCard from "./announcements-card";
import DocumentsCard from "./documents-card";
import { Lease } from "@/models/lease";
import LeaseDetailsCard from "./lease-details-card";
import LeaseInfoCard from "./lease-info-card";
import MaintenanceCard from "./maintenance-card";
import PaymentsCard from "./payments-card";
import { User } from "@/models/user";

interface TenantPageProps {
    user: User;
    lease: Lease;
}

export function TenantPage({ user, lease }: TenantPageProps) {
    return (
        <>
            <div className="flex flex-col xl:flex-row gap-4 w-full">
                <LeaseDetailsCard lease={lease} />
                <LeaseInfoCard lease={lease} />
            </div>
            <div className="flex flex-col xl:flex-row gap-4 w-full">
                <AnnouncementsCard lease={lease} />
                <PaymentsCard lease={lease} />
            </div>
            <div className="flex flex-col xl:flex-row gap-4 w-full">
                <MaintenanceCard lease={lease} />
                <DocumentsCard lease={lease} />
            </div>
        </>
    );
}
