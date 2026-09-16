import { HttpResponse } from '@angular/common/http';

const CONTENT_DISPOSITION_HEADER = 'content-disposition';
const FILE_NAME_PATTERN = /filename\*?=(?:UTF-8''|")?([^";]+)/i;

export function downloadBlobResponse(response: HttpResponse<Blob>, fallbackFileName: string): boolean {
  const fileContent = response.body;
  if (!fileContent || fileContent.size === 0) {
    return false;
  }

  downloadBlob(fileContent, resolveFileNameFromResponse(response, fallbackFileName));
  return true;
}

export function resolveFileNameFromResponse(response: HttpResponse<Blob>, fallbackFileName: string): string {
  const contentDisposition = response.headers.get(CONTENT_DISPOSITION_HEADER) ?? '';
  const matchedFileName = contentDisposition.match(FILE_NAME_PATTERN);

  if (matchedFileName?.[1]) {
    return decodeURIComponent(matchedFileName[1].replace(/"/g, '').trim());
  }

  return fallbackFileName;
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const downloadAnchor = globalThis.document.createElement('a');

  downloadAnchor.href = objectUrl;
  downloadAnchor.download = fileName;
  downloadAnchor.click();

  URL.revokeObjectURL(objectUrl);
}
