'use server';

import { promises as fs } from 'fs';
import path from 'path';

export async function getZipFile() {
  const possiblePaths = [
    path.join(process.cwd(), 'public', 'checkupcme.zip'),
    path.join(process.cwd(), 'download', 'checkupcme.zip'),
  ];

  for (const filePath of possiblePaths) {
    try {
      const fileBuffer = await fs.readFile(filePath);
      // Return as base64 to avoid JSON serialization issues with binary
      const base64 = fileBuffer.toString('base64');
      return { success: true as const, data: base64 };
    } catch {
      // try next
    }
  }

  return { success: false as const, error: 'Arquivo nao encontrado' };
}
