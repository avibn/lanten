import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
    addAnnouncement,
    editAnnouncement,
    getAnnouncements,
} from "@/network/server/announcements";

import { Announcement } from "@/models/announcement";
import { AnnouncementFormDialog } from "./announcement-form-dialog";
import { AnnouncementFormValues } from "@/schemas/announcement";
import { DeleteAnnouncementClient } from "./delete-announcement-client";
import { Error } from "@/models/error";
import { Lease } from "@/models/lease";
import { MainButton } from "@/components/buttons/main-button";
import { Separator } from "@/components/ui/separator";
import { WithAuthorized } from "@/providers/with-authorized";
import { formatTime } from "@/utils/format-time";
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
    }; // todo:: lease.tenants shouldnt return password!!

    const handleEditAnnouncement = async (
        announcementId: string,
        data: AnnouncementFormValues
    ): Promise<Announcement | Error> => {
        "use server";

        try {
            const response = await editAnnouncement(announcementId, data);
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
                        <MainButton text="View All" variant="link" />
                        <WithAuthorized role="LANDLORD">
                            <AnnouncementFormDialog
                                handleFormSubmit={handleAddAnnouncement}
                            />
                        </WithAuthorized>
                    </div>
                </div>
                {/* <Separator /> */}
                {announcements.map((announcement, index) => (
                    <div key={announcement.id} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <p className="text-lg leading-none">
                                {announcement.title}
                            </p>
                            <WithAuthorized role="LANDLORD">
                                <div className="flex items-center">
                                    <AnnouncementFormDialog
                                        announcementToEdit={announcement}
                                        handleFormSubmit={async (data) => {
                                            "use server";
                                            return handleEditAnnouncement(
                                                announcement.id,
                                                data
                                            );
                                        }}
                                    />
                                    <DeleteAnnouncementClient
                                        announcementID={announcement.id}
                                    />
                                </div>
                            </WithAuthorized>
                        </div>
                        <p className="text-wrap break-words text-gray-600 max-w-[300px]">
                            {announcement.message}
                        </p>
                        <p className="text-sm text-gray-500">
                            {announcement.updatedAt > announcement.createdAt
                                ? `Updated at ${formatTime(
                                      announcement.updatedAt
                                  )}`
                                : `Created at ${formatTime(
                                      announcement.createdAt
                                  )}`}
                        </p>
                        {index !== announcements.length - 1 && (
                            <Separator className="my-3" />
                        )}
                    </div>
                ))}
            </CardHeader>
        </Card>
    );
}
