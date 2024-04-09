import {
    AlertCircle,
    CheckCircle2,
    CircleEllipsis,
    Hammer,
    LucideIcon,
    XCircle,
} from "lucide-react";

import { Lease } from "./lease";
import { User } from "./user";

export interface MaintenanceRequest {
    id: string;
    description: string;
    status: MaintenanceRequestStatus;
    requestType: MaintenanceRequestType;
    requestTypeId: string;
    createdAt: string;
    updatedAt: string;
    images: MaintenanceImage[];
    author?: Partial<User>;
    lease?: Partial<Lease>;
    sharedRequest?: SharedMaintenanceRequest[];
}

export interface MaintenanceImage {
    id: string;
    url: string;
    fileName?: string;
    fileType?: string;
    createdAt: string;
    updatedAt: string;
}

export type MaintenanceRequestStatus =
    | "PENDING"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CANCELLED"
    | "REJECTED";

export interface MaintenanceRequestType {
    id: string;
    name: string;
}

export interface SharedMaintenanceRequest {
    id: string;
    isDeleted: boolean;
}

export const STATUS_BACKGROUND_COLORS: { [key: string]: string } = {
    PENDING: "bg-yellow-50 hover:bg-yellow-100",
    IN_PROGRESS: "bg-blue-50 hover:bg-blue-100",
    RESOLVED: "bg-green-50 hover:bg-green-100",
    CANCELLED: "bg-red-50 hover:bg-red-100",
    REJECTED: "bg-red-50 hover:bg-red-100",
};

export const STATUS_TEXT: { [key: string]: string } = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
    CANCELLED: "Cancelled",
    REJECTED: "Rejected",
};

export const STATUS_ICONS: { [key: string]: LucideIcon } = {
    PENDING: CircleEllipsis,
    IN_PROGRESS: Hammer,
    RESOLVED: CheckCircle2,
    CANCELLED: AlertCircle,
    REJECTED: XCircle,
};
