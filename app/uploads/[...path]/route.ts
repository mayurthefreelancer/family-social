import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await context.params;

  if (!segments || segments.length === 0) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Prevent directory traversal attacks
  const safeSegments = segments.filter(
    (segment) =>
      segment !== ".." &&
      segment !== "." &&
      !segment.includes("/") &&
      !segment.includes("\\")
  );

  if (safeSegments.length !== segments.length) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const filePath = path.join(
    process.cwd(),
    "public",
    "uploads",
    ...safeSegments
  );

  try {
    const fileBuffer = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();

    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Image not found", { status: 404 });
  }
}
