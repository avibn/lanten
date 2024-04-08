import { UploadFileResponse, deleteBlob, uploadFile } from "./blobHelper";

import env from "../../utils/validateEnv";

const documentContainerName = env.PROPERTY_BLOB_CONTAINER;

// Images are supported
const supportedMimeTypes = ["image/jpeg", "image/png"];

export async function uploadPropertyImageToBlob(
    fileBuffer: Buffer,
    mimeType: string
): Promise<UploadFileResponse> {
    // Check if the MIME type is supported
    if (!supportedMimeTypes.includes(mimeType)) {
        throw new Error("Unsupported MIME type");
    }

    return uploadFile(documentContainerName, fileBuffer, undefined, mimeType);
}

export async function deletePropertyImageFromBlob(
    blobName: string
): Promise<void> {
    return deleteBlob(documentContainerName, blobName);
}
