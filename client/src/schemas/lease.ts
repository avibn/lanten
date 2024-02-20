import { z } from "zod";

// currently only date picker, so conversion to datetime ISO is necessary for backend
export const leaseUpdateSchema = z.object({
    startDate: z.coerce.date().transform((val) => new Date(val).toISOString()),
    endDate: z.coerce.date().transform((val) => new Date(val).toISOString()),
    totalRent: z.coerce
        .number()
        .positive()
        .multipleOf(0.01, "Rent must be a valid currency amount")
        .min(0)
        .max(1000000),
});

export const leaseCreateSchema = leaseUpdateSchema.extend({
    propertyId: z.string(),
});

export type LeaseCreateFormValues = z.infer<typeof leaseCreateSchema>;
export type LeaseUpdateFormValues = z.infer<typeof leaseUpdateSchema>;
