import AnnouncementsCard from "./(announcements)/announcements-card";
import DocumentsCard from "./(documents)/documents-card";
import { Lease } from "@/models/lease";
import LeaseDetailsCard from "./(details)/lease-details-card";
import LeaseInfoCard from "./(info)/lease-info-card";
import MaintenanceCard from "./(maintenance)/maintenance-card";
import PaymentsCard from "./(payments)/payments-card";
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
