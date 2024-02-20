import { Lease } from "@/models/lease";
import { fetchData } from "../helpers/fetch-data";
import { useMutation } from "@tanstack/react-query";

interface LeaseCreateBody {
    propertyId: string;
    startDate: string;
    endDate: string;
    totalRent: number;
}

async function createLease(lease: LeaseCreateBody): Promise<Lease> {
    const response = await fetchData(`/leases`, {
        method: "POST",
        body: JSON.stringify(lease),
        credentials: "include",
    });
    return await response.json();
}

export const useCreateLeaseMutation = () => {
    return useMutation({
        mutationFn: (lease: LeaseCreateBody) => createLease(lease),
    });
};

interface LeaseUpdateBody {
    startDate: string;
    endDate: string;
    totalRent: number;
}

async function updateLease(id: string, lease: LeaseUpdateBody): Promise<Lease> {
    const response = await fetchData(`/leases/${id}`, {
        method: "PUT",
        body: JSON.stringify(lease),
        credentials: "include",
    });
    return await response.json();
}

export const useUpdateLeaseMutation = (id: string) => {
    return useMutation({
        mutationFn: (lease: LeaseUpdateBody) => updateLease(id, lease),
    });
};
