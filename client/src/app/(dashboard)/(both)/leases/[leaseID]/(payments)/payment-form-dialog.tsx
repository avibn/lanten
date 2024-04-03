"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { PaymentFormValues, paymentSchema } from "@/schemas/payment";

import { EditIconButton } from "@/components/buttons/edit-icon-button";
import { Error } from "@/models/error";
import { Form } from "@/components/ui/form";
import { FormDateField } from "@/components/forms/fields/form-date-field";
import { FormSelectField } from "@/components/forms/fields/form-select-field";
import { FormTextAreaField } from "@/components/forms/fields/form-text-area-field";
import { FormTextField } from "@/components/forms/fields/form-text-field";
import { MainButton } from "@/components/buttons/main-button";
import { Payment } from "@/models/payment";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

interface PaymentFormDialogProps {
    paymentToEdit?: Payment;
    handleFormSubmit: (data: PaymentFormValues) => Promise<Payment | Error>;
}

export function PaymentFormDialog({
    paymentToEdit,
    handleFormSubmit,
}: PaymentFormDialogProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            name: paymentToEdit?.name,
            description: paymentToEdit?.description || undefined,
            amount: paymentToEdit?.amount,
            type: paymentToEdit?.type,
            paymentDate: paymentToEdit?.paymentDate,
            recurringInterval: paymentToEdit?.recurringInterval,
        },
    });

    const handlePaymentForm = async (data: PaymentFormValues) => {
        setLoading(true);
        const response = await handleFormSubmit(data);
        // check if response has error
        if ("error" in response) {
            toast.error("Something went wrong. Please try again later.");
        } else {
            setDialogOpen(false);
        }
        setLoading(false);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                {paymentToEdit ? (
                    <EditIconButton />
                ) : (
                    <MainButton text="Add Payment" />
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {paymentToEdit ? "Edit payment" : "Add payment"}
                    </DialogTitle>
                    <DialogDescription>
                        {paymentToEdit
                            ? "Edit the payment details and click save to update."
                            : "Add a new payment."}
                    </DialogDescription>
                </DialogHeader>
                <div className="gap-4 mt-2">
                    <Form {...form}>
                        <ScrollArea className="h-[70vh] pr-2">
                            <form
                                onSubmit={form.handleSubmit(handlePaymentForm)}
                                className="flex flex-col gap-4 w-full px-2"
                            >
                                <FormTextField
                                    form={form}
                                    name="name"
                                    label="Payment Name"
                                    inputPlaceholder="The payment name"
                                />
                                <FormTextAreaField
                                    form={form}
                                    name="description"
                                    label="Payment Description"
                                    inputPlaceholder="The payment description"
                                />
                                <FormTextField
                                    form={form}
                                    name="amount"
                                    inputPlaceholder="500"
                                    inputType="number"
                                    label="Payment Amount"
                                    description={
                                        <>The amount of the payment (in GBP).</>
                                    }
                                />
                                <FormSelectField
                                    form={form}
                                    name="type"
                                    label="Payment Type"
                                    options={[
                                        { value: "RENT", label: "Rent" },
                                        { value: "DEPOSIT", label: "Deposit" },
                                        {
                                            value: "UTILITIES",
                                            label: "Utilities",
                                        },
                                        { value: "OTHER", label: "Other" },
                                    ]}
                                    description={
                                        <>
                                            The type of the payment. If
                                            it&apos;s not rent, deposit, or
                                            utilities, select other.
                                        </>
                                    }
                                />
                                <FormDateField
                                    form={form}
                                    name="paymentDate"
                                    label="Payment Date"
                                />
                                <FormSelectField
                                    form={form}
                                    name="recurringInterval"
                                    label="Recurring Interval"
                                    options={[
                                        { value: "DAILY", label: "Daily" },
                                        { value: "WEEKLY", label: "Weekly" },
                                        { value: "MONTHLY", label: "Monthly" },
                                        { value: "YEARLY", label: "Yearly" },
                                        { value: "NONE", label: "None" },
                                    ]}
                                    description={
                                        <>
                                            If the payment is recurring, select
                                            the interval. Otherwise, select
                                            none.
                                        </>
                                    }
                                />
                                <MainButton
                                    text={
                                        paymentToEdit ? "Save" : "Add Payment"
                                    }
                                    loadingText={
                                        paymentToEdit
                                            ? "Saving"
                                            : "Adding Payment"
                                    }
                                    isLoading={loading}
                                />
                            </form>
                        </ScrollArea>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
