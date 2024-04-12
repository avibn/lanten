import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { addReminder, deleteReminder } from "@/network/server/reminders";

import { BadRequestError } from "@/network/errors/httpErrors";
import { Bell } from "lucide-react";
import { DeleteReminderClient } from "./delete-reminder-client";
import { IconButton } from "@/components/buttons/icon-button";
import { Payment } from "@/models/payment";
import { Reminder } from "@/models/reminder";
import { ReminderForm } from "./reminder-form";
import { ReminderFormValues } from "@/schemas/reminder";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatTimeToDateString } from "@/utils/format-time";
import { revalidateTag } from "next/cache";

interface RemindersDialogProps {
    payment: Payment;
    reminders: Reminder[];
}

export function RemindersDialog({ payment, reminders }: RemindersDialogProps) {
    const handleAddReminder = async (data: ReminderFormValues) => {
        "use server";

        try {
            const response = await addReminder(payment.id, {
                paymentId: payment.id,
                daysBefore: data.daysBefore,
            });
            revalidateTag("LeasePayments");
            return response;
        } catch (error) {
            if (error instanceof BadRequestError) {
                return {
                    error: "Reminder already exists. Please try another.",
                };
            }
            return { error: "Something went wrong!" };
        }
    };

    const handleDeleteReminder = async (reminderID: string) => {
        "use server";

        try {
            await deleteReminder(reminderID);
            revalidateTag("LeasePayments");
        } catch (error) {
            return { error: "Something went wrong!" };
        }
    };

    return (
        <Sheet>
            <SheetTrigger>
                <IconButton
                    icon={<Bell size={16} />}
                    className="text-gray-600"
                />
            </SheetTrigger>
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle>Reminders for {payment.name}</SheetTitle>
                    <SheetDescription>
                        <p>
                            Add reminders for payment{" "}
                            <span className="font-semibold">
                                {payment.name} (£{payment.amount} at{" "}
                                {formatTimeToDateString(payment.paymentDate)})
                            </span>
                            :
                        </p>
                        <ReminderForm
                            handleFormSubmit={handleAddReminder}
                            className="mt-4"
                        />
                        <div className="mt-8">
                            {reminders.length === 0 ? (
                                <p className="text-gray-600">
                                    There are currently no reminders set.
                                </p>
                            ) : (
                                <>
                                    <p className="text-gray-600">
                                        Current reminders set for this payment:
                                    </p>
                                    <ScrollArea className="flex pr-2 h-[50vh]">
                                        {reminders.map((reminder) => (
                                            <div
                                                key={reminder.id}
                                                className="flex justify-between items-center py-2 border-b border-gray-200 mt-2"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <p>
                                                        {reminder.daysBefore}{" "}
                                                        days before
                                                    </p>
                                                </div>
                                                <DeleteReminderClient
                                                    reminderID={reminder.id}
                                                    handleDelete={
                                                        handleDeleteReminder
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </ScrollArea>
                                </>
                            )}
                        </div>
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}
