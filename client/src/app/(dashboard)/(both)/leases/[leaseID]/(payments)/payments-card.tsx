import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    addPayment,
    editPayment,
    getPayments,
} from "@/network/server/payments";

import CardError from "@/components/card-error";
import { DeleteAnnouncementClient } from "../(announcements)/delete-announcement-client";
import { Error } from "@/models/error";
import { Lease } from "@/models/lease";
import { Payment } from "@/models/payment";
import { PaymentFormDialog } from "./payment-form-dialog";
import { PaymentFormValues } from "@/schemas/payment";
import { RemindersDialog } from "./reminders-dialog";
import { TextIconButton } from "@/components/buttons/text-icon-button";
import { WithAuthorized } from "@/providers/with-authorized";
import { formatTimeToDateString } from "@/utils/format-time";
import { revalidateTag } from "next/cache";

interface PaymentsCardProps {
    lease: Lease;
}

export default async function PaymentsCard({ lease }: PaymentsCardProps) {
    let payments: Payment[] = [];
    try {
        payments = await getPayments(lease.id);
    } catch (error) {
        return <CardError message="Payments could not be loaded." />;
    }

    const handleAddPayment = async (data: PaymentFormValues) => {
        "use server";

        try {
            const response = await addPayment(lease.id, data);
            revalidateTag("LeasePayments");
            return response;
        } catch (error) {
            return { error: "Something went wrong!" };
        }
    };

    const handleEditPayment = async (
        paymentId: string,
        data: PaymentFormValues
    ): Promise<Payment | Error> => {
        "use server";

        try {
            const response = await editPayment(paymentId, data);
            revalidateTag("LeasePayments");
            return response;
        } catch (error) {
            return { error: "Something went wrong!" };
        }
    };

    return (
        <Card className="flex-1">
            <CardHeader>
                <div className="flex items-center justify-between w-full">
                    <CardTitle className="text-lg font-medium">
                        Payments ({payments.length})
                    </CardTitle>
                    <WithAuthorized role="LANDLORD">
                        <PaymentFormDialog
                            handleFormSubmit={handleAddPayment}
                        />
                    </WithAuthorized>
                </div>

                {/* Payments list */}
                <div className="mt-4">
                    {payments.map((payment) => (
                        <div
                            key={payment.id}
                            className="flex justify-between items-center py-2 border-b border-gray-200"
                        >
                            <div className="flex items-center gap-2">
                                <p>{payment.name}</p>
                                {/* Description */}
                                {payment.description && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <TextIconButton className="cursor-help" />
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-xs">
                                                <p>{payment.description}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="text-gray-600 text-sm font-semibold">
                                    £{payment.amount.toFixed(2)}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    {formatTimeToDateString(
                                        payment.paymentDate
                                    )}
                                </p>
                                <WithAuthorized role="LANDLORD">
                                    <div className="flex items-center">
                                        <RemindersDialog
                                            payment={payment}
                                            reminders={payment.reminders || []}
                                        />
                                        <PaymentFormDialog
                                            paymentToEdit={payment}
                                            handleFormSubmit={async (data) => {
                                                "use server";
                                                return handleEditPayment(
                                                    payment.id,
                                                    data
                                                );
                                            }}
                                        />
                                        <DeleteAnnouncementClient
                                            announcementID={payment.id}
                                        />
                                    </div>
                                </WithAuthorized>
                            </div>
                        </div>
                    ))}
                </div>
            </CardHeader>
        </Card>
    );
}
