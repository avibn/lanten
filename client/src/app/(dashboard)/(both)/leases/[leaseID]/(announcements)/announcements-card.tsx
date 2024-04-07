import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
    addAnnouncement,
    getAnnouncements,
} from "@/network/server/announcements";

import { Announcement } from "@/models/announcement";
import { AnnouncementContainer } from "@/components/segments/announcement/announcement-container";
import { AnnouncementFormDialog } from "./announcement-form-dialog";
import { AnnouncementFormValues } from "@/schemas/announcement";
import { Error } from "@/models/error";
import { Lease } from "@/models/lease";
import { MainButton } from "@/components/buttons/main-button";
import { WithAuthorized } from "@/providers/with-authorized";
import { revalidateTag } from "next/cache";

interface AnnouncementsCardProps {
    lease: Lease;
}

export default async function AnnouncementsCard({
    lease,
}: AnnouncementsCardProps) {
    let announcements: Announcement[] = [];
    try {
        announcements = await getAnnouncements(lease.id, 3);
    } catch (error) {
        console.error("Error fetching lease announcements", error);
    }

    const handleAddAnnouncement = async (
        data: AnnouncementFormValues
    ): Promise<Announcement | Error> => {
        "use server";

        try {
            const response = await addAnnouncement(lease.id, data);
            revalidateTag("LeaseAnnouncements");
            return response;
        } catch (error) {
            return { error: "Something went wrong!" };
        }
    };

    return (
        <Card className="flex-1">
            <CardHeader>
                <div className="flex items-center justify-between w-full mb-3">
                    <CardTitle className="text-lg font-medium">
                        Announcements
                    </CardTitle>
                    {/* View all link */}
                    <div className="flex items-center gap-2">
                        <MainButton
                            text={`View All (${lease._count?.announcements})`}
                            variant="link"
                            href={`/leases/${lease.id}/announcements`}
                        />
                        <WithAuthorized role="LANDLORD">
                            <AnnouncementFormDialog
                                handleFormSubmit={handleAddAnnouncement}
                            />
                        </WithAuthorized>
                    </div>
                </div>
                {announcements.map((announcement, index) => (
                    <AnnouncementContainer
                        key={index}
                        announcement={announcement}
                    />
                ))}
            </CardHeader>
        </Card>
    );
}
