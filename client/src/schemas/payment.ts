import { CurrencyType, DateType } from "./other";

import { z } from "zod";

export const paymentSchema = z.object({
    name: z.string().min(1).max(25),
    description: z.string().max(255).optional(),
    amount: CurrencyType,
    type: z.enum(["RENT", "DEPOSIT", "UTILITIES", "OTHER"]).default("OTHER"),
    paymentDate: DateType,
    recurringInterval: z
        .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY", "NONE"])
        .default("NONE"),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;
