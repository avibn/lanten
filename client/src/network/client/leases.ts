import { Lease } from "@/models/lease";
import { fetchData } from "../helpers/fetch-data";
import { useMutation } from "@tanstack/react-query";

interface LeaseCreateBody {
    startDate: string;
    endDate: string;
    totalRent: number;
}

async function createLease(
    propertyId: string,
    lease: LeaseCreateBody
): Promise<Lease> {
    const response = await fetchData(`/leases`, {
        method: "POST",
        body: JSON.stringify({ ...lease, propertyId }),
        credentials: "include",
    });
    return await response.json();
}

export const useCreateLeaseMutation = (propertyId: string) => {
    return useMutation({
        mutationFn: (lease: LeaseCreateBody) => createLease(propertyId, lease),
    });
};

async function updateLease(id: string, lease: LeaseCreateBody): Promise<Lease> {
    const response = await fetchData(`/leases/${id}`, {
        method: "PUT",
        body: JSON.stringify(lease),
        credentials: "include",
    });
    return await response.json();
}

export const useUpdateLeaseMutation = (id: string) => {
    return useMutation({
        mutationFn: (lease: LeaseCreateBody) => updateLease(id, lease),
    });
};
