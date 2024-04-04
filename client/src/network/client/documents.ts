import { fetchData } from "../helpers/fetch-data";
import { useMutation } from "@tanstack/react-query";

interface UpdateDocumentData {
    file: File;
    name: string;
}

async function uploadDocument(
    leaseId: string,
    { file, name }: UpdateDocumentData
): Promise<Document> {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("files[]", file);

    const response = await fetchData(
        `/leases/${leaseId}/documents`,
        {
            method: "POST",
            body: formData,
            credentials: "include",
        },
        false
    );
    return await response.json();
}

export const useUploadDocumentMutation = (leaseId: string) => {
    return useMutation({
        mutationFn: (data: UpdateDocumentData) => uploadDocument(leaseId, data),
    });
};

async function deleteDocument(documentId: string): Promise<void> {
    await fetchData(`/documents/${documentId}`, {
        method: "DELETE",
        credentials: "include",
    });
}

export const useDeleteDocumentMutation = () => {
    return useMutation({
        mutationFn: (documentId: string) => deleteDocument(documentId),
    });
};
