import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FILE_TYPES = ["image/jpeg", "image/png"];

export const maintenanceRequestSchema = z.object({
    requestTypeId: z.string(),
    description: z.string().min(20).max(500),
    files: z
        .array(z.instanceof(File))
        .max(5)
        .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), {
            message: `File size should be less than ${
                MAX_FILE_SIZE / 1024 / 1024
            }MB`,
        })
        .refine(
            (files) =>
                files.every((file) => SUPPORTED_FILE_TYPES.includes(file.type)),
            {
                message: `File type should be either jpeg, jpg, or png`,
            }
        ),
});

export const maintenanceRequestUpdateSchema = z.object({
    requestTypeId: z.string(),
    description: z.string().min(20).max(500),
});

export const maintenanceStatusSchema = z.object({
    status: z.enum([
        "PENDING",
        "IN_PROGRESS",
        "RESOLVED",
        "REJECTED",
        "CANCELLED",
    ]),
});

export type MaintenanceRequestFormValues = z.infer<
    typeof maintenanceRequestSchema
>;
export type MaintenanceRequestUpdateFormValues = z.infer<
    typeof maintenanceRequestUpdateSchema
>;
export type MaintenanceStatusFormValues = z.infer<
    typeof maintenanceStatusSchema
>;
