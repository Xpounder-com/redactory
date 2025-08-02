import { createReadStream, readFileSync, statSync } from 'fs';
import { basename } from 'path';
import { request } from 'https';

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
export async function uploadToAzure(filePath: string): Promise<string> {
  const containerUrl = process.env.AZURE_BLOB_SAS_URL;
  const connectionString = process.env.STORAGE_PRIMARY_CONNECTION_STRING;

  if (!containerUrl && !connectionString) {
    throw new Error(
      'AZURE_BLOB_SAS_URL or STORAGE_PRIMARY_CONNECTION_STRING must be defined'
    );
  }

  const blobName = basename(filePath);

  if (containerUrl) {
    let url: URL;
    try {
      url = new URL(containerUrl);
    } catch {
      throw new Error(
        'AZURE_BLOB_SAS_URL must be a valid container SAS URL'
      );
    }
    url.pathname = `${url.pathname.replace(/\/$/, '')}/${blobName}`;
    const blobUrl = url.toString();

    const stats = statSync(filePath);
    const stream = createReadStream(filePath);

    await new Promise<void>((resolve, reject) => {
      const req = request(blobUrl, {
        method: 'PUT',
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Length': stats.size
        }
      }, res => {
        res.resume();
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${res.statusCode}`));
        }
      });
      req.on('error', reject);
      stream.pipe(req);
    });

    return blobUrl;
  }

  const containerName = process.env.AZURE_BLOB_CONTAINER_NAME || 'redactory';
  const nameMatch = /AccountName=([^;]+)/i.exec(connectionString!);
  const keyMatch = /AccountKey=([^;]+)/i.exec(connectionString!);
  if (!nameMatch || !keyMatch) {
    throw new Error(
      'STORAGE_PRIMARY_CONNECTION_STRING must include AccountName and AccountKey'
    );
  }
  const data = readFileSync(filePath);
  return uploadWithAccessKey(
    nameMatch[1],
    keyMatch[1],
    containerName,
    blobName,
    data
  );
}

/**
 * Upload content to Azure Blob Storage using an account access key and return a
 * time limited SAS URL (24 hours) for the uploaded blob.
 */
export async function uploadWithAccessKey(
  accountName: string,
  accountKey: string,
  containerName: string,
  blobName: string,
  content: string | Buffer
): Promise<string> {
  const {
    BlobServiceClient,
    StorageSharedKeyCredential,
    generateBlobSASQueryParameters,
    BlobSASPermissions
  } = await import('@azure/storage-blob');

  const credential = new StorageSharedKeyCredential(accountName, accountKey);
  const service = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    credential
  );

  const container = service.getContainerClient(containerName);
  if (!(await container.exists())) {
    await container.create();
  }

  const block = container.getBlockBlobClient(blobName);
  const data = typeof content === 'string' ? Buffer.from(content) : content;
  await block.uploadData(data);

  const expiresOn = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const sas = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse('r'),
      startsOn: new Date(),
      expiresOn
    },
    credential
  ).toString();

  return `${block.url}?${sas}`;
}
