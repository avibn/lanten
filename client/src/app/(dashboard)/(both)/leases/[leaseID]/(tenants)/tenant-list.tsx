"use client";

import { Mail, MessageCircle } from "lucide-react";

import { DeleteIconButton } from "@/components/buttons/delete-icon-button";
import { IconButton } from "@/components/buttons/icon-button";
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
        <div>
            {leaseTenants?.map((leaseTenant, index) => (
                <div
                    key={leaseTenant.id}
                    className="flex flex-row items-center gap-2"
                >
                    <p className="text-sm font-light select-none">
                        {index + 1}.
                    </p>
                    <span>
                        {leaseTenant.tenant?.name}
                        <span className="text-gray-500 ml-2">
                            ({leaseTenant.tenant?.email})
                        </span>
                    </span>
                    <div className="flex items-center">
                        <IconButton
                            icon={<MessageCircle size={18} />}
                            href={`/messages/${leaseTenant.tenant?.id}`}
                        />
                        <IconButton
                            icon={<Mail size={18} />}
                            href={`mailto:${leaseTenant.tenant?.email}`}
                            hrefNewTab
                        />
                        <DeleteIconButton
                            alertTitle="Remove Tenant"
                            alertDescription={`Are you sure you want to remove ${leaseTenant.tenant?.name} from this lease?`}
                            onConfirm={() => removeTenant(leaseTenant.id || "")}
                            isLoading={isPending}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
