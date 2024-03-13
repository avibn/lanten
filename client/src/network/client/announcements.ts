import { fetchData } from "../helpers/fetch-data";
import { useMutation } from "@tanstack/react-query";

async function deleteAnnouncement(announcementId: string) {
    await fetchData(`/announcements/${announcementId}`, {
        method: "DELETE",
        credentials: "include",
    });
}

export const useDeleteAnnouncementMutation = () => {
    return useMutation({
        mutationFn: (announcementId: string) =>
            deleteAnnouncement(announcementId),
    });
};
