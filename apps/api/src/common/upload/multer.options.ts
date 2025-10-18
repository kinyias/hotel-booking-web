import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { imageFileFilter } from './image-file.filter';
import { MAX_IMAGE_SIZE_BYTES } from './file.constants';

export const imageMulterOptions: MulterOptions = {
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
  fileFilter: imageFileFilter,
};
