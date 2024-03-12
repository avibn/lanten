import AnnouncementsCard from "./announcements-card";
import CardLoadingSkeleton from "@/components/card-loading-skeleton";
import DocumentsCard from "./documents-card";
import { Lease } from "@/models/lease";
import LeaseDetailsCard from "./lease-details-card";
import LeaseInfoCard from "./lease-info-card";
import MaintenanceCard from "./maintenance-card";
import PaymentsCard from "./payments-card";
import { Suspense } from "react";
import TenantsCard from "./tenants-card";
import { User } from "@/models/user";

interface LandlordPageProps {
    user: User;
    lease: Lease;
}

export function LandlordPage({ user, lease }: LandlordPageProps) {
    return (
        <>
            <div className="flex flex-col xl:flex-row gap-4 w-full">
                <LeaseDetailsCard lease={lease} />
                <LeaseInfoCard lease={lease} />
            </div>
            <div className="flex flex-col xl:flex-row gap-4 w-full">
                <Suspense
                    fallback={
                        <CardLoadingSkeleton loadingText="Loading tenants" />
                    }
                >
                    <TenantsCard lease={lease} />
                </Suspense>
                <PaymentsCard lease={lease} />
            </div>
            <div className="flex flex-col xl:flex-row gap-4 w-full">
                <AnnouncementsCard lease={lease} />
                <MaintenanceCard lease={lease} />
                <DocumentsCard lease={lease} />
            </div>
        </>
    );
}
