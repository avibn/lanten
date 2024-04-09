"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpdatePasswordValues, updatePasswordSchema } from "@/schemas/user";

import { Form } from "@/components/ui/form";
import { FormTextField } from "@/components/forms/fields/form-text-field";
import { MainButton } from "@/components/buttons/main-button";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useUpdatePasswordMutation } from "@/network/client/users";
import { zodResolver } from "@hookform/resolvers/zod";

export function SettingsClient() {
    const form = useForm<UpdatePasswordValues>({
        resolver: zodResolver(updatePasswordSchema),
    });
    const updatePasswordMutation = useUpdatePasswordMutation();

    const handleSubmit = (values: UpdatePasswordValues) => {
        updatePasswordMutation.mutate(values);
    };

    if (updatePasswordMutation.isSuccess) {
        form.reset(); // todo:: doesn't seem to work
        form.setValue("oldPassword", "");
        form.setValue("newPassword", "");
        toast.success("Password updated successfully");
        updatePasswordMutation.reset();
    }

    if (updatePasswordMutation.isError) {
        toast.error(updatePasswordMutation.error.message);
        updatePasswordMutation.reset();
    }

    return (
        <div className="space-y-5">
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Update Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-5"
                        >
                            <FormTextField
                                form={form}
                                name="oldPassword"
                                label="Current Password"
                                inputPlaceholder="Current Password"
                                inputType="password"
                            />
                            <FormTextField
                                form={form}
                                name="newPassword"
                                label="New Password"
                                inputPlaceholder="New Password"
                                inputType="password"
                                description="Password must contain at least one uppercase letter and one number."
                            />
                            <MainButton
                                text="Update Password"
                                loadingText="Updating Password"
                                isLoading={updatePasswordMutation.isPending}
                            />
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
