export interface MaintenanceRequest {
    id: string;
    description: string;
    status: MaintenanceRequestStatus;
    requestType: MaintenanceRequestType;
    requestTypeId: string;
    createdAt: string;
    updatedAt: string;
    images: MaintenanceImage[];
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

export const STATUS_BACKGROUND_COLORS: { [key: string]: string } = {
    PENDING: "bg-yellow-100",
    IN_PROGRESS: "bg-blue-100",
    RESOLVED: "bg-green-100",
    CANCELLED: "bg-red-100",
    REJECTED: "bg-red-100",
};

export const STATUS_TEXT: { [key: string]: string } = {
    PENDING: "In-Progress",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
    CANCELLED: "Cancelled",
    REJECTED: "Rejected",
};
