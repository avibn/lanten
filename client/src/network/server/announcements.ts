import { Announcement } from "@/models/announcement";
import { fetchDataServer } from "../helpers/fetch-data-server";

export async function getAnnouncements(
    leaseId: string,
    max?: number
): Promise<Announcement[]> {
    const response = await fetchDataServer(
        `/leases/${leaseId}/announcements` + (max ? `?max=${max}` : ""),
        {
            next: {
                revalidate: 20,
                tags: ["LeaseAnnouncements"],
            },
        }
    );
    return await response.json();
}

interface AnnouncementCreateBody {
    title: string;
    message: string;
}

export async function addAnnouncement(
    leaseId: string,
    data: AnnouncementCreateBody
): Promise<Announcement> {
    const response = await fetchDataServer(`/leases/${leaseId}/announcements`, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return await response.json();
}

export async function editAnnouncement(
    announcementId: string,
    data: AnnouncementCreateBody
): Promise<Announcement> {
    const response = await fetchDataServer(`/announcements/${announcementId}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    return await response.json();
}
