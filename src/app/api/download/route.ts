import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");

  if (!file) {
    return NextResponse.json({ error: "Arquivo nao especificado" }, { status: 400 });
  }

  const safeName = path.basename(file);

  // Try multiple possible paths
  const possiblePaths = [
    path.join(process.cwd(), "public", safeName),
    path.join(process.cwd(), "download", safeName),
    path.join(process.cwd(), "standalone", "public", safeName),
  ];

  for (const filePath of possiblePaths) {
    try {
      const fileBuffer = await fs.readFile(filePath);
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${safeName}"`,
          "Content-Length": fileBuffer.length.toString(),
        },
      });
    } catch {
      // try next path
    }
  }

  return NextResponse.json({ error: "Arquivo nao encontrado", tried: possiblePaths }, { status: 404 });
}
