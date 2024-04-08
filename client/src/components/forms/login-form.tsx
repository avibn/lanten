import { LoginFormValues, loginSchema } from "@/schemas/login";

import { Form } from "@/components/ui/form";
import { FormTextField } from "./fields/form-text-field";
import { MainButton } from "../buttons/main-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface LoginFormProps {
    onSubmit(values: LoginFormValues): void;
    loading?: boolean;
}

export function LoginForm({ onSubmit, loading }: LoginFormProps) {
    // React hook form
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
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
        </Form>
    );
}
