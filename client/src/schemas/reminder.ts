import { z } from "zod";

export const reminderSchema = z.object({
    daysBefore: z.coerce.number().int().min(0).max(7),
});

export type ReminderFormValues = z.infer<typeof reminderSchema>;
