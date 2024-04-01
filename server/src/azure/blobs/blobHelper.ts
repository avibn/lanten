import { BlobSASPermissions, BlobServiceClient } from "@azure/storage-blob";

import env from "../../utils/validateEnv";
import streamifier from "streamifier";
import { v4 as uuidv4 } from "uuid";

// Connection to Azure Blob Storage account
const blobServiceClient = BlobServiceClient.fromConnectionString(
    env.AZURE_STORAGE_CONNECTION_STRING
);

export interface UploadFileResponse {
    url: string;
    fileName: string;
}

export async function uploadFile(
    containerName: string,
    fileBuffer: Buffer,
    originalFileName: string | undefined,
    mimeType: string
): Promise<UploadFileResponse> {
    const uniqueFileName = originalFileName
        ? `${uuidv4()}/${originalFileName}`
        : uuidv4();
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(uniqueFileName);

    // Create a stream from the file buffer
    const stream = streamifier.createReadStream(fileBuffer);

    // Upload the file
    await blockBlobClient.uploadStream(stream, undefined, undefined, {
        blobHTTPHeaders: {
            blobContentType: mimeType,
        },
    });

    // Return the details of the uploaded file
    return {
        url: blockBlobClient.url,
        fileName: uniqueFileName,
    };
}

export async function deleteBlob(
    containerName: string,
    blobName: string
): Promise<void> {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Delete the blob
    await blockBlobClient.delete();
}

export async function getTemporaryBlobUrl(
    containerName: string,
    blobName: string,
    expiresInMinutes: number
): Promise<string> {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Generate a SAS token with expiry time
    const sasURL = blockBlobClient.generateSasUrl({
        permissions: BlobSASPermissions.parse("r"),
        expiresOn: new Date(
            new Date().getTime() + expiresInMinutes * 60 * 1000
        ),
    });

    return sasURL;
}
