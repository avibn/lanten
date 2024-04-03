"use client";

import { DeleteIconButton } from "@/components/buttons/delete-icon-button";
import { LeaseTenant } from "@/models/lease-tenant";
import { toast } from "sonner";
import { useRemoveTenantFromLeaseMutation } from "@/network/client/tenants";
import { useRouter } from "next/navigation";

interface LeaseTenantProps {
    leaseId: string;
    leaseTenants: Partial<LeaseTenant>[] | undefined;
}

export default function TenantList({
    leaseId,
    leaseTenants,
}: LeaseTenantProps) {
    const router = useRouter();
    const { mutate, isPending, isSuccess, isError, error, reset } =
        useRemoveTenantFromLeaseMutation(leaseId);

    const removeTenant = async (leaseTenantId: string) => {
        mutate(leaseTenantId);
    };

    if (isError) {
        toast.error("Tenant could not be removed. Please try again.");
        reset();
    }

    if (isSuccess) {
        toast.success("Tenant removed successfully!");
        reset();
        router.refresh();
    }

    return (
        <ol className="list-decimal list-inside !mt-4">
            {leaseTenants?.map((LeaseTenant) => (
                <li key={LeaseTenant.id}>
                    <span>
                        {LeaseTenant.tenant?.name}
                        <span className="text-gray-500 ml-2">
                            ({LeaseTenant.tenant?.email})
                        </span>
                    </span>
                    <DeleteIconButton
                        alertTitle="Remove Tenant"
                        alertDescription={`Are you sure you want to remove ${LeaseTenant.tenant?.name} from this lease?`}
                        onConfirm={() => removeTenant(LeaseTenant.id || "")}
                        isLoading={isPending}
                        className="ml-2"
                    />
                </li>
            ))}
        </ol>
    );
}
