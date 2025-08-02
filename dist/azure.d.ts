/**
 * Upload a file to Azure Blob Storage using a pre-generated container SAS URL.
 *
 * Required environment variable:
 *   AZURE_BLOB_SAS_URL - container URL including SAS token
 *
 * The returned value is the signed URL of the uploaded blob.
 */
export declare function uploadToAzure(filePath: string): Promise<string>;
/**
 * Upload content to Azure Blob Storage using an account access key and return a
 * time limited SAS URL (24 hours) for the uploaded blob.
 */
export declare function uploadWithAccessKey(accountName: string, accountKey: string, containerName: string, blobName: string, content: string | Buffer): Promise<string>;
