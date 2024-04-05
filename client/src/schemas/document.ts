import { z } from "zod";

export const documentSchema = z.object({
    name: z.string().min(1).max(30),
    file: z.instanceof(File).refine((file) => file.size > 0, {
        message: "File cannot be empty",
    }),
});

export type DocumentFormValues = z.infer<typeof documentSchema>;
