// apps/api/src/common/upload/image-parse.pipe.ts
import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from './file.constants';

// Tạo factory để bạn có thể truyền override nếu cần
export function makeImageParsePipe(options?: {
  maxSizeBytes?: number;
  allowedTypes?: RegExp;
}) {
  const maxSize = options?.maxSizeBytes ?? MAX_IMAGE_SIZE_BYTES;
  const types = options?.allowedTypes ?? ALLOWED_IMAGE_TYPES;

  return new ParseFilePipeBuilder()
    .addFileTypeValidator({ fileType: types })
    .addMaxSizeValidator({ maxSize })
    .build({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      fileIsRequired: true,
    });
}
