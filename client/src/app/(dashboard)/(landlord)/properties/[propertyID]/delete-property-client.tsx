"use client";

import { formatTime, formatTimeToDateString } from "@/utils/format-time";

import { DeleteButton } from "@/components/buttons/delete-button";
import { Lease } from "@/models/lease";
import Link from "next/link";
import { toast } from "sonner";
import { useDeletePropertyMutation } from "@/network/client/properties";
import { useRouter } from "next/navigation";

interface DeletePropertyCLientProps {
    propertyID: string;
    leases: Lease[];
}

export function DeletePropertyClient({
    propertyID,
    leases = [],
}: DeletePropertyCLientProps) {
    const router = useRouter();
    const { mutate, isPending, isSuccess, isError, error } =
        useDeletePropertyMutation();

    const onConfirm = () => {
        mutate(propertyID);
    };

    if (isError) {
        toast.error("Property could not be deleted. Please try again.");
    }

    if (isSuccess) {
        toast.success("Property deleted successfully!");
        router.push("/properties");
        router.refresh();
    }

    return (
        <DeleteButton
            text="Delete Property"
            alertTitle="Delete Property"
            alertDescription={
                <>
                    {leases.length > 0 && (
                        <>
                            <b className="text-red-500">
                                This will also delete all leases associated with
                                this property.
                            </b>
                            <br />
                            Including:
                            <ol className="list-decimal list-inside">
                                {leases.map((lease) => (
                                    <li key={lease.id}>
                                        <Link href={`/leases/${lease.id}`} prefetch={false}>
                                            {" "}
                                            {formatTimeToDateString(
                                                lease.startDate
                                            )}{" "}
                                            -{" "}
                                            {formatTimeToDateString(
                                                lease.endDate
                                            )}{" "}
                                            (£{lease.totalRent}/month)
                                        </Link>
                                    </li>
                                ))}
                            </ol>
                            <br />
                        </>
                    )}
                    Are you sure you want to delete this property?
                </>
            }
            onConfirm={onConfirm}
            isLoading={isPending}
        />
    );
}
