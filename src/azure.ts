import { createReadStream, statSync } from 'fs';
import { basename } from 'path';
import { request } from 'https';

/**
 * Upload a file to Azure Blob Storage using a pre-generated container SAS URL.
 *
 * Required environment variable:
 *   AZURE_BLOB_SAS_URL - container URL including SAS token
 *
 * The returned value is the signed URL of the uploaded blob.
 */
export async function uploadToAzure(filePath: string): Promise<string> {
  const containerUrl = process.env.AZURE_BLOB_SAS_URL;
  if (!containerUrl) {
    throw new Error('AZURE_BLOB_SAS_URL is not defined');
  }

  const blobName = basename(filePath);
  const url = new URL(containerUrl);
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
