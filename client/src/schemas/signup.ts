import { z } from "zod";

export const signupSchema = z
    .object({
        email: z.string().email(),
        name: z.string().min(2).max(40),
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
        confirmPassword: z.string().min(8).max(100),
        type: z.enum(["tenant", "landlord"], {
            required_error: "A user type must be selected",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "The password does not match",
        path: ["confirmPassword"],
    });

export type SignupFormValues = z.infer<typeof signupSchema>;
