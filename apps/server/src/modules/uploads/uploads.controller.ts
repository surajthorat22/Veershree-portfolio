import {
  BadRequestException,
  Controller,
  HttpCode,
  Inject,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";

import { AdminAuthGuard } from "../../guards/admin-auth.guard";
import { UploadsService } from "./uploads.service";

const MAX_SIZE = 5 * 1024 * 1024;

@Controller("uploads")
@UseGuards(AdminAuthGuard)
export class UploadsController {
  constructor(@Inject(UploadsService) private readonly uploads: UploadsService) {}

  @Post("image") @HttpCode(200)
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: MAX_SIZE },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
          cb(new BadRequestException("Only image files are allowed"), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException("Image file is required");
    const url = await this.uploads.saveImage(file);
    return { url };
  }
}
