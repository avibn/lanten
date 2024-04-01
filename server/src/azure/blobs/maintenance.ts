import { UploadFileResponse, deleteBlob, uploadFile } from "./blobHelper";

import env from "../../utils/validateEnv";

const documentContainerName = env.MAINTENANCE_BLOB_CONTAINER;

// Images are supported
const supportedMimeTypes = ["image/jpeg", "image/png"];

export async function uploadMaintenanceDocToBlob(
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

export async function deleteMaintenanceDocFromBlob(
    blobName: string
): Promise<void> {
    return deleteBlob(documentContainerName, blobName);
}
