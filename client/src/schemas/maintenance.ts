import { z } from "zod";

export const maintenanceRequestSchema = z.object({
    requestTypeId: z.string(),
    description: z.string().min(20).max(500),
    file: z.instanceof(File).refine((file) => file.size > 0, {
        message: "File cannot be empty",
    }),
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
