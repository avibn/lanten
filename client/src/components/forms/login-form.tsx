import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormTextField } from "./fields/form-text-field";
import { Label } from "../ui/label";
import Link from "next/link";
import { MainButton } from "../main-button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
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

export type LoginFormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
    onSubmit(values: LoginFormValues): void;
    loading?: boolean;
}

export function LoginForm({ onSubmit, loading }: LoginFormProps) {
    // React hook form
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormTextField
                    form={form}
                    name="email"
                    label="Email"
                    inputPlaceholder="info@lanten.com"
                    inputType="email"
                    description="This is the email you used to sign up."
                />
                <FormTextField
                    form={form}
                    name="password"
                    label="Password"
                    inputPlaceholder="Password"
                    inputType="password"
                />
                <MainButton
                    text="Login"
                    loadingText="Logging in"
                    isLoading={loading}
                    className="w-full"
                />
            </form>
            <div className="text-center mt-4">
                <Label className="font-normal">
                    Don&apos;t have an account?
                    <Button variant="link" asChild>
                        <Link href="/signup">Sign up</Link>
                    </Button>
                </Label>
            </div>
        </Form>
    );
}
