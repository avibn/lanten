import { z } from "zod";

export const CurrencySchema = z
    .number()
    .multipleOf(0.01, "Rent must be a valid currency amount")
    .min(0)
    .max(1000000);
