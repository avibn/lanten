import AnnouncementsCard from "./(announcements)/announcements-card";
import CardLoadingSkeleton from "@/components/card-loading-skeleton";
import DocumentsCard from "./(documents)/documents-card";
import { Lease } from "@/models/lease";
import LeaseDetailsCard from "./(details)/lease-details-card";
import LeaseInfoCard from "./(info)/lease-info-card";
import MaintenanceCard from "./(maintenance)/maintenance-card";
import PaymentsCard from "./(payments)/payments-card";
import { Suspense } from "react";
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
                <Suspense
                    fallback={
                        <CardLoadingSkeleton loadingText="Loading tenants" />
                    }
                >
                    <LeaseInfoCard lease={lease} />
                </Suspense>
            </div>
            <div className="flex flex-col xl:flex-row gap-4 w-full">
                <Suspense
                    fallback={
                        <CardLoadingSkeleton loadingText="Loading tenants" />
                    }
                >
                    <AnnouncementsCard lease={lease} />
                </Suspense>
                <Suspense
                    fallback={
                        <CardLoadingSkeleton loadingText="Loading tenants" />
                    }
                >
                    <PaymentsCard lease={lease} />
                </Suspense>
            </div>
            <div className="flex flex-col xl:flex-row gap-4 w-full">
                <Suspense
                    fallback={
                        <CardLoadingSkeleton loadingText="Loading maintenance" />
                    }
                >
                    <MaintenanceCard lease={lease} />
                </Suspense>
                <Suspense
                    fallback={
                        <CardLoadingSkeleton loadingText="Loading documents" />
                    }
                >
                    <DocumentsCard lease={lease} />
                </Suspense>
            </div>
        </>
    );
}
