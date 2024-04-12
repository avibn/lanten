import { Payment, PaymentType, RecurringInterval } from "@/models/payment";

import { fetchDataServer } from "../helpers/fetch-data-server";

export async function getPayments(leaseId: string): Promise<Payment[]> {
    const response = await fetchDataServer(`/leases/${leaseId}/payments`, {
        next: {
            revalidate: 0,
            tags: ["LeasePayments"],
        },
    });
    return await response.json();
}

interface PaymentCreateBody {
    amount: number;
    name: string;
    description?: string;
    type: PaymentType;
    paymentDate: string;
    recurringInterval: RecurringInterval;
}

export async function addPayment(
    leaseId: string,
    data: PaymentCreateBody
): Promise<Payment> {
    const response = await fetchDataServer(`/leases/${leaseId}/payments`, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return await response.json();
}

export async function editPayment(
    paymentId: string,
    data: PaymentCreateBody
): Promise<Payment> {
    const response = await fetchDataServer(`/payments/${paymentId}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    return await response.json();
}

export async function deletePayment(paymentId: string): Promise<void> {
    await fetchDataServer(`/payments/${paymentId}`, {
        method: "DELETE",
    });
}
