import { Announcement } from "@/models/announcement";
import { AnnouncementFormDialog } from "@/app/(dashboard)/(both)/leases/[leaseID]/(announcements)/announcement-form-dialog";
import { AnnouncementFormValues } from "@/schemas/announcement";
import { DeleteAnnouncementClient } from "@/app/(dashboard)/(both)/leases/[leaseID]/(announcements)/delete-announcement-client";
import { Error } from "@/models/error";
import { Separator } from "@/components/ui/separator";
import { WithAuthorized } from "@/providers/with-authorized";
import { editAnnouncement } from "@/network/server/announcements";
import { formatTime } from "@/utils/format-time";
import { revalidateTag } from "next/cache";

interface AnnouncementContainerProps {
    announcement: Announcement;
    textWrap?: boolean;
}

export function AnnouncementContainer({
    announcement,
    textWrap = true,
}: AnnouncementContainerProps) {
    // Handle edit announcement
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
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <p className="text-lg leading-none">{announcement.title}</p>
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
            {textWrap ? (
                <p className="text-wrap break-words text-gray-600 max-w-[300px]">
                    {announcement.message}
                </p>
            ) : (
                <p className="text-gray-600">{announcement.message}</p>
            )}
            <p className="text-sm text-gray-500">
                {announcement.updatedAt > announcement.createdAt
                    ? `Updated at ${formatTime(announcement.updatedAt)}`
                    : `Created at ${formatTime(announcement.createdAt)}`}
            </p>
                            <Separator className="my-3" />
        </div>
    );
}
