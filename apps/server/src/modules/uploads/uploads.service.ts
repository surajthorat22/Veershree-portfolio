import { Injectable } from "@nestjs/common";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

const UPLOAD_DIR = join(process.cwd(), "uploads");

@Injectable()
export class UploadsService {
  async saveImage(file: Express.Multer.File): Promise<string> {
    await mkdir(UPLOAD_DIR, { recursive: true });

    const ext = file.originalname.split(".").pop()?.toLowerCase() || "jpg";
    const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
    const filename = `${randomUUID()}.${safeExt}`;
    await writeFile(join(UPLOAD_DIR, filename), file.buffer);

    return `/rest/uploads/${filename}`;
  }
}
