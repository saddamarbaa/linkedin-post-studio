// SPEC §8.1 image upload validation.

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export type FileUploadResult =
  | { ok: true; dataUrl: string }
  | { ok: false; error: string };

/**
 * Validates `file` against SPEC §8.1 (mime allowlist + 5 MB cap) and reads it
 * into a base64 data URL. Always resolves — never rejects — so callers can
 * render the error in the UI without try/catch.
 */
export async function validateAndConvertToBase64(
  file: File,
): Promise<FileUploadResult> {
  if (!ALLOWED_MIME_TYPES.includes(file.type as AllowedMimeType)) {
    return {
      ok: false,
      error: `Unsupported file type "${file.type || 'unknown'}". Use PNG, JPEG, or WebP.`,
    };
  }

  if (file.size > MAX_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      ok: false,
      error: `File is ${mb} MB. Maximum is 5 MB.`,
    };
  }

  return new Promise<FileUploadResult>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        resolve({ ok: false, error: 'Failed to read file as data URL.' });
        return;
      }
      resolve({ ok: true, dataUrl: result });
    };
    reader.onerror = () => {
      resolve({
        ok: false,
        error: reader.error?.message ?? 'Failed to read file.',
      });
    };
    reader.readAsDataURL(file);
  });
}
