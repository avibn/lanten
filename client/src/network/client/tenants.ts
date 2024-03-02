import { fetchData } from "../helpers/fetch-data";
import { useMutation } from "@tanstack/react-query";

async function inviteTenant(leaseId: string, email: string): Promise<void> {
    await fetchData(`/leases/${leaseId}/tenants/invites`, {
        method: "POST",
        body: JSON.stringify({ tenantEmail: email }),
        credentials: "include",
    });
}

export const useInviteTenantMutation = (leaseId: string) => {
    return useMutation({
        mutationFn: (email: string) => inviteTenant(leaseId, email),
    });
};

export async function removeInvite(
    leaseId: string,
    inviteId: string
): Promise<void> {
    await fetchData(`/leases/${leaseId}/tenants/invites/${inviteId}`, {
        method: "DELETE",
        credentials: "include",
    });
}

export const useRemoveInviteMutation = (leaseId: string) => {
    return useMutation({
        mutationFn: (inviteId: string) => removeInvite(leaseId, inviteId),
    });
};

export async function leaveLease(leaseId: string): Promise<void> {
    await fetchData(`/leases/${leaseId}/tenants/leave`, {
        method: "POST",
        credentials: "include",
    });
}

export const useLeaveLeaseMutation = () => {
    return useMutation({
        mutationFn: (leaseId: string) => leaveLease(leaseId),
    });
};

export async function removeTenantFromLease(
    leaseId: string,
    leaseTenantId: string
): Promise<void> {
    await fetchData(`/leases/${leaseId}/tenants/remove`, {
        method: "POST",
        body: JSON.stringify({ leaseTenantId }),
        credentials: "include",
    });
}

export const useRemoveTenantFromLeaseMutation = (leaseId: string) => {
    return useMutation({
        mutationFn: (leaseTenantId: string) =>
            removeTenantFromLease(leaseId, leaseTenantId),
    });
};

interface UpdateLeaseTenantBody {
    leaseTenantId: string;
    individualRent: number;
}

async function updateLeaseTenant(
    leaseId: string,
    leaseTenant: UpdateLeaseTenantBody
): Promise<void> {
    await fetchData(`/leases/${leaseId}/tenants/update`, {
        method: "POST",
        body: JSON.stringify(leaseTenant),
        credentials: "include",
    });
}

export const useUpdateLeaseTenantMutation = (leaseId: string) => {
    return useMutation({
        mutationFn: (leaseTenant: UpdateLeaseTenantBody) =>
            updateLeaseTenant(leaseId, leaseTenant),
    });
};
