import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .email()
        .refine((value) => value, {
            message: "Invalid email address",
        }),
    password: z
        .string()
        .min(8)
        .max(100)
        .refine((password) => /[A-Z]/.test(password), {
            message: "Password must contain at least one uppercase letter",
        })
        .refine((password) => /\d/.test(password), {
            message: "Password must contain at least one number",
        }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
