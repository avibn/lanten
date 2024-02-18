import { z } from "zod";

export const propertySchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(2).max(1000),
    address: z.string().min(2).max(100),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
