import { z } from "zod";

export const messageSchema = z.object({
    text: z.string().min(1).max(250),
});

export type MessageFormValues = z.infer<typeof messageSchema>;
