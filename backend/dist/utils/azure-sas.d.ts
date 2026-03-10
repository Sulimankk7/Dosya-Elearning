/**
 * Generates a read-only SAS-signed URL for a video stored in Azure Blob Storage.
 *
 * All env-var reads and credential creation happen inside the function body
 * so they always pick up values populated by dotenv at startup.
 *
 * @param videoUrl  Either a full Azure Blob URL or a plain filename
 * @returns         A fully-qualified SAS URL ready for the browser/player
 */
export declare function generateVideoSas(videoUrl: string): string;
//# sourceMappingURL=azure-sas.d.ts.map