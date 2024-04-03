"use client";

import { ReminderFormValues, reminderSchema } from "@/schemas/reminder";

import { Error } from "@/models/error";
import { Form } from "@/components/ui/form";
import { FormTextField } from "@/components/forms/fields/form-text-field";
import { MainButton } from "@/components/buttons/main-button";
import { Reminder } from "@/models/reminder";
import { cn } from "@/utils/tw-merge";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

interface ReminderFormProps {
    handleFormSubmit: (data: ReminderFormValues) => Promise<Reminder | Error>;
    className?: string;
}

export function ReminderForm({
    handleFormSubmit,
    className,
}: ReminderFormProps) {
    const [loading, setLoading] = useState(false);
    const form = useForm<ReminderFormValues>({
        resolver: zodResolver(reminderSchema),
    });

    const handleReminderForm = async (data: ReminderFormValues) => {
        setLoading(true);
        const response = await handleFormSubmit(data);
        // check if response has error
        if ("error" in response) {
            toast.error("Something went wrong. Please try again later.");
        }
        setLoading(false);
    };
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleReminderForm)}
                className={cn("flex flex-col gap-4 w-full", className)}
            >
                <FormTextField
                    form={form}
                    label="Number of days before payment to be reminded"
                    name="daysBefore"
                    inputType="number"
                    inputPlaceholder="Enter number of days before payment"
                />
                <MainButton
                    text="Add Reminder"
                    loadingText="Adding Reminder"
                    type="submit"
                    isLoading={loading}
                />
            </form>
        </Form>
    );
}
