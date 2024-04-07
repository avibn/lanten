import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { Announcement } from "@/models/announcement";
import { AnnouncementContainer } from "@/components/segments/announcement/announcement-container";
import CardError from "@/components/card-error";
import { getLatestAnnouncements } from "@/network/server/announcements";

export async function LatestAnnouncementsCard() {
    let announcements: Announcement[] = [];
    try {
        const response = await getLatestAnnouncements(3);
        announcements = response;
    } catch (error) {
        console.error(error);
        return <CardError message="Failed to load announcements" />;
    }

    return (
        <Card className="flex-1">
            <CardHeader>
                <div className="flex items-center justify-between w-full">
                    <CardTitle className="text-lg font-medium">
                        Latest Announcements
                    </CardTitle>
                </div>
                {announcements.length === 0 && (
                    <p className="text-gray-500 text-sm">
                        No announcements to display.
                    </p>
                )}
                {announcements.map((request) => (
                    <AnnouncementContainer
                        key={request.id}
                        announcement={request}
                        includeModifyOptions={false}
                        textWrap={false}
                        includeLeaseLink
                    />
                ))}
            </CardHeader>
        </Card>
    );
}
