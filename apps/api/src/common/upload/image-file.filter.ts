import { BadRequestException } from '@nestjs/common';
import { ALLOWED_IMAGE_TYPES } from './file.constants';

export function imageFileFilter(
  req: any,
  file: Express.Multer.File,
  cb: (error: any, acceptFile: boolean) => void,
) {
  if (!ALLOWED_IMAGE_TYPES.test(file.mimetype)) {
    return cb(
      new BadRequestException('Only JPG/JPEG/PNG/WEBP images are allowed'),
      false,
    );
  }
  cb(null, true);
}
