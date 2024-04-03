import { Reminder } from "@/models/reminder";
import { fetchDataServer } from "../helpers/fetch-data-server";

interface AddReminderBody {
    paymentId: string;
    daysBefore: number;
}

export async function addReminder(
    paymentId: string,
    data: AddReminderBody
): Promise<Reminder> {
    const response = await fetchDataServer(`/payments/${paymentId}/reminders`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
            daysBefore: data.daysBefore,
        }),
    });
    return await response.json();
}

export async function deleteReminder(reminderId: string): Promise<void> {
    await fetchDataServer(`/reminders/${reminderId}`, {
        method: "DELETE",
        credentials: "include",
    });
}
