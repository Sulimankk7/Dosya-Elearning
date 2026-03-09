import {
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions
} from "@azure/storage-blob";

/**
 * Extracts just the filename from a value that may be either:
 *   - A full Azure Blob URL: "https://account.blob.core.windows.net/container/file.mp4"
 *   - A plain filename: "file.mp4"
 */
function extractFilename(input: string): string {
  if (input.startsWith("http")) {
    const url = new URL(input);
    // pathname is e.g. "/videos/file.mp4" → last segment is the filename
    const segments = url.pathname.split("/").filter(Boolean);
    return segments[segments.length - 1];
  }
  return input;
}

/**
 * Generates a read-only SAS-signed URL for a video stored in Azure Blob Storage.
 *
 * All env-var reads and credential creation happen inside the function body
 * so they always pick up values populated by dotenv at startup.
 *
 * @param videoUrl  Either a full Azure Blob URL or a plain filename
 * @returns         A fully-qualified SAS URL ready for the browser/player
 */
export function generateVideoSas(videoUrl: string): string {
  const ACCOUNT = process.env.AZURE_STORAGE_ACCOUNT;
  const KEY = process.env.AZURE_STORAGE_KEY;
  const CONTAINER = process.env.AZURE_STORAGE_CONTAINER;

  // Startup guard — fail loudly if any required var is missing
  if (!ACCOUNT) throw new Error("Missing env var: AZURE_STORAGE_ACCOUNT");
  if (!KEY) throw new Error("Missing env var: AZURE_STORAGE_KEY");
  if (!CONTAINER) throw new Error("Missing env var: AZURE_STORAGE_CONTAINER");

  const filename = extractFilename(videoUrl);
  const credential = new StorageSharedKeyCredential(ACCOUNT, KEY);

  const startsOn = new Date(Date.now() - 5 * 60 * 1000);
  const expiresOn = new Date(Date.now() + 60 * 60 * 1000);

  const sas = generateBlobSASQueryParameters(
    {
      containerName: CONTAINER,
      blobName: filename,
      permissions: BlobSASPermissions.parse("r"),
      startsOn,
      expiresOn
    },
    credential
  ).toString();

  return `https://${ACCOUNT}.blob.core.windows.net/${CONTAINER}/${filename}?${sas}`;
}