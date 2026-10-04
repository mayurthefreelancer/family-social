/**
 * Strips EXIF metadata (GPS coordinates, camera serials) from image files
 * by redrawing onto an HTML5 Canvas and exporting as modern WebP/JPEG blob.
 */
export async function sanitizeImage(
  file: File,
  maxDimension = 2000,
  quality = 0.9
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas 2D context unavailable"));
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) =>
          blob ? resolve(blob) : reject(new Error("Image sanitization failed")),
        "image/webp",
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for sanitization"));
    };
    img.src = url;
  });
}

/**
 * Convenience wrapper converting sanitized Blob back into a File object
 * with webp extension for straightforward FormData packaging.
 */
export async function sanitizeImageToFile(
  file: File,
  maxDimension = 2000,
  quality = 0.9
): Promise<File> {
  const blob = await sanitizeImage(file, maxDimension, quality);
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  return new File([blob], `${baseName}.webp`, { type: "image/webp" });
}
