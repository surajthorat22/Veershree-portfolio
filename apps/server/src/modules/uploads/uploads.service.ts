import { Injectable } from "@nestjs/common";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { getUploadDir } from "@Veershree-portfolio/env/server";

@Injectable()
export class UploadsService {
  async saveImage(file: Express.Multer.File): Promise<string> {
    const uploadDir = getUploadDir();
    await mkdir(uploadDir, { recursive: true });

    const ext = file.originalname.split(".").pop()?.toLowerCase() || "jpg";
    const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
    const filename = `${randomUUID()}.${safeExt}`;
    await writeFile(join(uploadDir, filename), file.buffer);

    return `/rest/uploads/${filename}`;
  }
}
