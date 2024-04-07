import CardLoadingSkeleton from "@/components/card-loading-skeleton";
import { ClientToast } from "@/components/client-toast";
import { LatestAnnouncementsCard } from "./(announcements)/latest-announcements-card";
import { LatestLeasesCard } from "./(leases)/latest-leases-card";
import { LatestMessagesCard } from "./(messages)/latest-messages-card";
import { LatestRequestsCard } from "./(maintenance)/latest-requests-card";
import { Suspense } from "react";
import { getSessionUser } from "@/network/server/users";

export const metadata = {
    title: "Home",
    description: "Home",
};

interface HomeProps {
    searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function Home({ searchParams }: HomeProps) {
    const user = await getSessionUser();

    // Error message from the URL
    let error = searchParams?.error as string | undefined;

    return (
        <div>
            {error && <ClientToast message={error} type="error" />}
            <h3 className="text-xl font-semibold tracking-tight">
                Welcome, {user?.name}!
            </h3>
            <p className="mt-2 text-gray-500">
                The date is {new Date().toLocaleDateString()}.
            </p>
            <div className="mt-10 flex flex-col gap-4">
                <div className="flex flex-col xl:flex-row gap-4 w-full">
                    <Suspense
                        fallback={
                            <CardLoadingSkeleton loadingText="Loading your leases" />
                        }
                    >
                        <LatestLeasesCard />
                    </Suspense>
                    <Suspense
                        fallback={
                            <CardLoadingSkeleton loadingText="Loading latest messsages" />
                        }
                    >
                        <LatestMessagesCard />
                    </Suspense>
                </div>
                <div className="flex flex-col xl:flex-row gap-4 w-full">
                    <Suspense
                        fallback={
                            <CardLoadingSkeleton loadingText="Loading latest announcements" />
                        }
                    >
                        <LatestAnnouncementsCard />
                    </Suspense>
                    <Suspense
                        fallback={
                            <CardLoadingSkeleton loadingText="Loading latest maintenance requests" />
                        }
                    >
                        <LatestRequestsCard />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
