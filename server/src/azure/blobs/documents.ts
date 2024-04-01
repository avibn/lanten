import {
    UploadFileResponse,
    deleteBlob,
    getTemporaryBlobUrl,
    uploadFile,
} from "./blobHelper";

import env from "../../utils/validateEnv";

const documentContainerName = env.DOCUMENT_BLOB_CONTAINER;

const supportedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function uploadDocument(
    fileBuffer: Buffer,
    originalFileName: string,
    mimeType: string
): Promise<UploadFileResponse> {
    // Check if the MIME type is supported
    if (!supportedMimeTypes.includes(mimeType)) {
        throw new Error("Unsupported MIME type");
    }

    return uploadFile(
        documentContainerName,
        fileBuffer,
        originalFileName,
        mimeType
    );
}

export async function deleteDocument(blobName: string): Promise<void> {
    return deleteBlob(documentContainerName, blobName);
}

export async function getTemporaryDocumentUrl(
    blobName: string
): Promise<string> {
    return getTemporaryBlobUrl(documentContainerName, blobName, 10);
}
