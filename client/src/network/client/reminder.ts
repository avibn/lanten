import { fetchData } from "../helpers/fetch-data";
import { useMutation } from "@tanstack/react-query";

async function deleteReminder(reminderId: string) {
    await fetchData(`/reminders/${reminderId}`, {
        method: "DELETE",
        credentials: "include",
    });
}

export const useDeleteReminderMutation = () => {
    return useMutation({
        mutationFn: (reminderId: string) => deleteReminder(reminderId),
    });
};
