import { Document, DocumentsList } from "@/models/document";

import { fetchDataServer } from "../helpers/fetch-data-server";

export async function getDocuments(leaseId: string): Promise<DocumentsList> {
    const response = await fetchDataServer(`/leases/${leaseId}/documents`, {
        next: {
            revalidate: 0,
            tags: ["LeaseDocuments"],
        },
    });
    return await response.json();
}

export async function getDocument(documentId: string): Promise<Document> {
    const response = await fetchDataServer(`/documents/${documentId}`, {
        next: {
            revalidate: 0,
        },
    });
    return await response.json();
}

export async function updateDocument(
    documentId: string,
    name: string
): Promise<void> {
    await fetchDataServer(`/documents/${documentId}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
        next: {
            tags: ["LeaseDocuments"],
        },
    });
}

export async function deleteDocument(documentId: string): Promise<void> {
    await fetchDataServer(`/documents/${documentId}`, {
        method: "DELETE",
        next: {
            tags: ["LeaseDocuments"],
        },
    });
}
