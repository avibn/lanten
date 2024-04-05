import {
    MaintenanceRequestStatus,
    STATUS_BACKGROUND_COLORS,
    STATUS_ICONS,
    STATUS_TEXT,
} from "@/models/maintenance";

import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface RequestBadgeProps {
    status: MaintenanceRequestStatus;
}

export function RequestBadge({ status }: RequestBadgeProps) {
    const MainIcon: LucideIcon = STATUS_ICONS[status];
    return (
        <Badge
            className={`text-sm ${STATUS_BACKGROUND_COLORS[status]} text-black font-medium border border-slate-100 px-3 py-1`}
        >
            <MainIcon className="h-4 w-4 mr-2" />
            {STATUS_TEXT[status]}
        </Badge>
    );
}
