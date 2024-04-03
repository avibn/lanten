import { z } from "zod";

// Date type
export const DateType = z.coerce
    .date()
    .transform((val) => new Date(val).toISOString());

// Currency type
export const CurrencyType = z.coerce
    .number()
    .positive()
    .multipleOf(0.01, "Must be a valid currency amount")
    .min(0)
    .max(1000000);
