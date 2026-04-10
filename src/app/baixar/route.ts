import { promises as fs } from "fs";
import path from "path";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function GET() {
  const safeName = "checkupcme.zip";
  const possiblePaths = [
    path.join(process.cwd(), "public", safeName),
    path.join(process.cwd(), "download", safeName),
    path.join(process.cwd(), "standalone", "public", safeName),
  ];

  for (const filePath of possiblePaths) {
    try {
      const fileBuffer = await fs.readFile(filePath);
      return new Response(fileBuffer, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${safeName}"`,
          "Content-Length": fileBuffer.length.toString(),
        },
      });
    } catch {
      // try next
    }
  }

  redirect("/");
}
