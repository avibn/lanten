import { Announcement } from "@/models/announcement";
import { AnnouncementContainer } from "@/components/segments/announcement/announcement-container";
import { BackButton } from "@/components/buttons/back-button";
import { Metadata } from "next";
import { getAnnouncements } from "@/network/server/announcements";

interface PageProps {
    params: {
        leaseID: string;
    };
}

export const metadata: Metadata = {
    title: "Announcements",
    description: "Announcements for the lease",
};

export default async function Page({ params: { leaseID } }: PageProps) {
    let announcements: Announcement[] = [];
    try {
        announcements = await getAnnouncements(leaseID);
    } catch (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                Error fetching announcements. Please try again later.
            </div>
        );
    }

    return (
        <div className="flex flex-col items-start gap-5 page-content">
            <BackButton text="Lease" href={`/leases/${leaseID}`} />
            <div className="flex gap-4 items-center">
                <h1 className="text-xl font-bold">
                    Announcements ({announcements.length})
                </h1>
            </div>
            <div className="flex flex-col gap-8 w-full">
                {announcements.map((announcement) => (
                    <AnnouncementContainer
                        key={announcement.id}
                        announcement={announcement}
                        textWrap={false}
                    />
                ))}
            </div>
        </div>
    );
}
