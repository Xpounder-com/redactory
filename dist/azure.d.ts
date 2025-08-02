/**
 * Upload a file to Azure Blob Storage.
 *
 * Required environment variables (one of):
 *   AZURE_BLOB_SAS_URL - container URL including SAS token
 *   STORAGE_PRIMARY_CONNECTION_STRING - account connection string
 *
 * Optional when using connection string:
 *   AZURE_BLOB_CONTAINER_NAME - container to upload to (defaults to "redactory")
 *
 * The returned value is the signed URL of the uploaded blob.
 */
export declare function uploadToAzure(filePath: string): Promise<string>;
/**
 * Upload content to Azure Blob Storage using an account access key and return a
 * time limited SAS URL (24 hours) for the uploaded blob.
 */
export declare function uploadWithAccessKey(accountName: string, accountKey: string, containerName: string, blobName: string, content: string | Buffer): Promise<string>;
