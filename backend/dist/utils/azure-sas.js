"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVideoSas = generateVideoSas;
const storage_blob_1 = require("@azure/storage-blob");
/**
 * Extracts just the filename from a value that may be either:
 *   - A full Azure Blob URL: "https://account.blob.core.windows.net/container/file.mp4"
 *   - A plain filename: "file.mp4"
 */
function extractFilename(input) {
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
 * @param durationMinutes Length of the video in minutes (used for calculating SAS expiration)
 * @returns         A fully-qualified SAS URL ready for the browser/player
 */
function generateVideoSas(videoUrl, durationMinutes = 60) {
    const ACCOUNT = process.env.AZURE_STORAGE_ACCOUNT;
    const KEY = process.env.AZURE_STORAGE_KEY;
    const CONTAINER = process.env.AZURE_STORAGE_CONTAINER;
    // Startup guard — fail loudly if any required var is missing
    if (!ACCOUNT)
        throw new Error("Missing env var: AZURE_STORAGE_ACCOUNT");
    if (!KEY)
        throw new Error("Missing env var: AZURE_STORAGE_KEY");
    if (!CONTAINER)
        throw new Error("Missing env var: AZURE_STORAGE_CONTAINER");
    const filename = extractFilename(videoUrl);
    const credential = new storage_blob_1.StorageSharedKeyCredential(ACCOUNT, KEY);
    const startsOn = new Date(Date.now() - 5 * 60 * 1000); // 5 min buffer
    // Dynamic expiration: Duration * 1.5, converted from minutes to milliseconds
    // We use max(5, duration * 1.5) to ensure at least 5 minutes of valid SAS for short clips
    const expiryMinutes = Math.max(5, durationMinutes * 1.5);
    const expiresOn = new Date(Date.now() + expiryMinutes * 60 * 1000);
    const sas = (0, storage_blob_1.generateBlobSASQueryParameters)({
        containerName: CONTAINER,
        blobName: filename,
        permissions: storage_blob_1.BlobSASPermissions.parse("r"),
        startsOn,
        expiresOn
    }, credential).toString();
    return `https://${ACCOUNT}.blob.core.windows.net/${CONTAINER}/${filename}?${sas}`;
}
//# sourceMappingURL=azure-sas.js.map