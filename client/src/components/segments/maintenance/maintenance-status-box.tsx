"use client";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    MaintenanceRequestStatus,
    STATUS_BACKGROUND_COLORS,
    STATUS_ICONS,
} from "@/models/maintenance";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/utils/tw-merge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUpdateMaintenanceRequestStatusMutation } from "@/network/client/maintenance";

type RequestStatus = {
    value: MaintenanceRequestStatus;
    label: string;
    icon: LucideIcon;
};

const statuses: RequestStatus[] = [
    {
        value: "PENDING",
        label: "Pending",
        icon: STATUS_ICONS.PENDING,
    },
    {
        value: "IN_PROGRESS",
        label: "In Progress",
        icon: STATUS_ICONS.IN_PROGRESS,
    },
    {
        value: "RESOLVED",
        label: "Resolved",
        icon: STATUS_ICONS.RESOLVED,
    },
    {
        value: "CANCELLED",
        label: "Canceled",
        icon: STATUS_ICONS.CANCELLED,
    },
    {
        value: "REJECTED",
        label: "Rejected",
        icon: STATUS_ICONS.REJECTED,
    },
];

interface MaintenanceStatusBoxProps {
    requestID: string;
    initialStatus: MaintenanceRequestStatus;
}

export function MaintenanceStatusBox({
    requestID,
    initialStatus,
}: MaintenanceStatusBoxProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<RequestStatus | null>(
        null
    );
    const updateStatusMutation =
        useUpdateMaintenanceRequestStatusMutation(requestID);

    // Set the initial status
    useEffect(() => {
        setSelectedStatus(
            statuses.find((status) => status.value === initialStatus) || null
        );
    }, [initialStatus]);

    const handleStatusUpdate = (status: MaintenanceRequestStatus) => {
        updateStatusMutation.mutate({ status });
    };

    if (updateStatusMutation.isSuccess) {
        toast.success("Status updated successfully");
        updateStatusMutation.reset();
        router.refresh();
    }

    if (updateStatusMutation.isError) {
        toast.error("Failed to update status");
        updateStatusMutation.reset();
    }

    return (
        <div className="flex items-center space-x-4">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                            "w-[150px] justify-start rounded-lg",
                            STATUS_BACKGROUND_COLORS[
                                selectedStatus?.value || "PENDING"
                            ]
                        )}
                        disabled={updateStatusMutation.isPending}
                    >
                        {selectedStatus ? (
                            <>
                                <selectedStatus.icon className="mr-2 h-4 w-4 shrink-0" />
                                {selectedStatus.label}
                            </>
                        ) : (
                            <>Select status...</>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="right" align="start">
                    <Command>
                        <CommandInput placeholder="Update request status..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {statuses.map((status) => (
                                    <CommandItem
                                        key={status.value}
                                        value={status.value}
                                        onSelect={(value) => {
                                            setSelectedStatus(
                                                statuses.find(
                                                    (priority) =>
                                                        priority.value === value
                                                ) || null
                                            );
                                            setOpen(false);
                                            handleStatusUpdate(
                                                value as MaintenanceRequestStatus
                                            );
                                        }}
                                    >
                                        <status.icon
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                status.value ===
                                                    selectedStatus?.value
                                                    ? "opacity-100"
                                                    : "opacity-40"
                                            )}
                                        />
                                        <span>{status.label}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
