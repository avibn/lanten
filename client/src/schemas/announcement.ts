import { z } from "zod";

export const announcementSchema = z.object({
    title: z.string().min(5).max(50),
    message: z.string().min(5).max(300),
});

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;
