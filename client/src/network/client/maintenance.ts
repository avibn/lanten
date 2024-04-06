import {
    MaintenanceRequest,
    MaintenanceRequestStatus,
} from "@/models/maintenance";

import { fetchData } from "../helpers/fetch-data";
import { useMutation } from "@tanstack/react-query";

interface UploadMaintenanceRequestData {
    leaseId: string;
    files: File[];
    description: string;
    requestTypeId: string;
}

async function uploadMaintenanceRequest({
    leaseId,
    files: file,
    description,
    requestTypeId,
}: UploadMaintenanceRequestData): Promise<MaintenanceRequest> {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("requestTypeId", requestTypeId);
    file.forEach((f) => formData.append("files[]", f));

    const response = await fetchData(
        `/leases/${leaseId}/maintenance/requests`,
        {
            method: "POST",
            body: formData,
            credentials: "include",
        },
        false
    );
    return await response.json();
}

export const useUploadMaintenanceRequestMutation = () => {
    return useMutation({
        mutationFn: (data: UploadMaintenanceRequestData) =>
            uploadMaintenanceRequest(data),
    });
};

async function deleteMaintenanceRequest(requestId: string): Promise<void> {
    await fetchData(`/maintenance/requests/${requestId}`, {
        method: "DELETE",
        credentials: "include",
    });
}

export const useDeleteMaintenanceRequestMutation = () => {
    return useMutation({
        mutationFn: (requestId: string) => deleteMaintenanceRequest(requestId),
    });
};

interface UpdateMaintenanceRequestData {
    description: string;
}

async function updateMaintenanceRequest(
    requestId: string,
    { description }: UpdateMaintenanceRequestData
): Promise<MaintenanceRequest> {
    const response = await fetchData(`/maintenance/requests/${requestId}`, {
        method: "PUT",
        body: JSON.stringify({ description }),
        credentials: "include",
    });
    return await response.json();
}

export const useUpdateMaintenanceRequestMutation = (requestId: string) => {
    return useMutation({
        mutationFn: (data: UpdateMaintenanceRequestData) =>
            updateMaintenanceRequest(requestId, data),
    });
};

interface UpdateMaintenanceRequestStatusData {
    status: MaintenanceRequestStatus;
}

async function updateMaintenanceRequestStatus(
    requestId: string,
    { status }: UpdateMaintenanceRequestStatusData
): Promise<MaintenanceRequest> {
    const response = await fetchData(
        `/maintenance/requests/${requestId}/status`,
        {
            method: "PUT",
            body: JSON.stringify({ status }),
            credentials: "include",
        }
    );
    return await response.json();
}

export const useUpdateMaintenanceRequestStatusMutation = (
    requestId: string
) => {
    return useMutation({
        mutationFn: (data: UpdateMaintenanceRequestStatusData) =>
            updateMaintenanceRequestStatus(requestId, data),
    });
};
