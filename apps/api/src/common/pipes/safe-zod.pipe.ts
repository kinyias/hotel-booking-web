// src/common/pipes/safe-zod.pipe.ts
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodError, ZodTypeAny } from 'zod';

type ZodMetatype =
  | (new (...args: any[]) => any & {
      createZodSchema?: () => ZodTypeAny;
      schema?: ZodTypeAny;
      zodSchema?: ZodTypeAny;
    })
  | undefined;

function extractZodSchema(metatype: ZodMetatype): ZodTypeAny | undefined {
  if (!metatype) return undefined;

  // Ưu tiên method do @anatine/zod-nestjs tạo ra
  const viaMethod = (metatype as any)?.createZodSchema?.();
  if (viaMethod && typeof viaMethod?.parse === 'function') return viaMethod;

  // Rơi vào case class có static property
  const viaProp = (metatype as any)?.schema ?? (metatype as any)?.zodSchema;
  if (viaProp && typeof viaProp?.parse === 'function') return viaProp;

  return undefined;
}

@Injectable()
export class SafeZodValidationPipe implements PipeTransform {
  transform(value: any, { metatype }: ArgumentMetadata) {
    const schema = extractZodSchema(metatype as any);

    // Route không dùng Zod DTO -> bỏ qua
    if (!schema) return value;

    try {
      return schema.parse(value);
    } catch (e: any) {
      // Hỗ trợ cả e.issues (Zod v3) và e.errors (một số wrapper cũ)
      const items = (e?.issues ?? e?.errors) as
        | { message: string; path?: (string | number)[] }[]
        | undefined;

      if (items?.length) {
        throw new BadRequestException(
          items.map((i) => ({
            field: i.path?.join('.') ?? '',
            message: i.message,
          })),
        );
      }

      if (e instanceof ZodError) {
        throw new BadRequestException(
          e.issues?.map((i) => i.message) ?? ['Validation failed'],
        );
      }
      throw e;
    }
  }
}
