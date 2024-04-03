import { fetchData } from "../helpers/fetch-data";
import { useMutation } from "@tanstack/react-query";

async function deletePayment(paymentId: string) {
    await fetchData(`/payments/${paymentId}`, {
        method: "DELETE",
        credentials: "include",
    });
}

export const useDeletePaymentMutation = () => {
    return useMutation({
        mutationFn: (paymentId: string) => deletePayment(paymentId),
    });
};
