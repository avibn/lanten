import { z } from "zod";

export const updatePasswordSchema = z.object({
    oldPassword: z.string().min(8).max(100),
    newPassword: z
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

export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;
