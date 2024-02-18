import { SignupFormValues, signupSchema } from "@/schemas/signup";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormRadioField } from "./fields/form-radio-field";
import { FormTextField } from "./fields/form-text-field";
import { Label } from "../ui/label";
import Link from "next/link";
import { MainButton } from "../main-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface SignupFormProps {
    onSubmit(values: SignupFormValues): void;
    loading?: boolean;
}

export function SignupForm({ onSubmit, loading }: SignupFormProps) {
    // React hook form
    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            confirmPassword: "",
            type: "tenant",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                    name="name"
                    label="Name"
                    inputPlaceholder="Bob Bobson"
                    description="Your preferred name."
                />
                <FormTextField
                    form={form}
                    name="password"
                    label="Password"
                    inputPlaceholder="Password"
                    inputType="password"
                />
                <FormTextField
                    form={form}
                    name="confirmPassword"
                    label="Confirm Password"
                    inputPlaceholder="Password"
                    inputType="password"
                    description="Please confirm your password."
                />
                <FormRadioField
                    form={form}
                    name="type"
                    label="Who are you?"
                    options={[
                        {
                            value: "tenant",
                            label: "Tenant",
                        },
                        {
                            value: "landlord",
                            label: "Landlord",
                        },
                    ]}
                />
                <MainButton
                    text="Create account"
                    loadingText="Creating account"
                    isLoading={loading}
                    className="w-full"
                />
            </form>
            <div className="text-center mt-4">
                <Label className="font-normal">
                    Already have an account?{" "}
                    <Button variant="link" asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                </Label>
            </div>
        </Form>
    );
}
