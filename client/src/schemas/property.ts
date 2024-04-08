import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FILE_TYPES = ["image/jpeg", "image/png"];

export const propertySchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(1000),
    address: z.string().min(2).max(100),
    file: z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: `File size should be less than ${
                MAX_FILE_SIZE / 1024 / 1024
            }MB`,
        })
        .refine((file) => SUPPORTED_FILE_TYPES.includes(file.type), {
            message: `File type should be either jpeg, jpg, or png`,
        })
        .optional(),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
