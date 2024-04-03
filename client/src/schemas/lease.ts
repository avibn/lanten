import { CurrencyType, DateType } from "./other";

import { z } from "zod";

// currently only date picker, so conversion to datetime ISO is necessary for backend
export const leaseUpdateSchema = z.object({
    startDate: DateType,
    endDate: DateType,
    totalRent: CurrencyType,
});

export const leaseCreateSchema = leaseUpdateSchema.extend({
    propertyId: z.string(),
});

export const updateLeaseDescriptionSchema = z.object({
    description: z.string().max(500),
});

export type LeaseCreateFormValues = z.infer<typeof leaseCreateSchema>;
export type LeaseUpdateFormValues = z.infer<typeof leaseUpdateSchema>;
export type UpdateLeaseDescriptionFormValues = z.infer<
    typeof updateLeaseDescriptionSchema
>;
