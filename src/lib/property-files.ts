export const propertyFilesBucket = "property-files";
export const maxPropertyFileBytes = 768_000;
export const propertyFileTypes = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export function propertyFileTitle(name: string) {
  return name.replace(/^[a-f0-9-]{36}--/, "");
}

function hasSignature(bytes: Uint8Array, signature: number[], offset = 0) {
  return signature.every((byte, index) => bytes[index + offset] === byte);
}

export function matchesPropertyFileType(bytes: Uint8Array, type: string) {
  switch (type) {
    case "application/pdf": return hasSignature(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d]);
    case "image/jpeg": return hasSignature(bytes, [0xff, 0xd8, 0xff]);
    case "image/png": return hasSignature(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case "image/webp": return hasSignature(bytes, [0x52, 0x49, 0x46, 0x46]) && hasSignature(bytes, [0x57, 0x45, 0x42, 0x50], 8);
    default: return false;
  }
}
