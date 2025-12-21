import { z } from 'zod';
import { BannerLinkType } from './types';

export const createBannerSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
  link: z.string().optional(),
  linkType: z.nativeEnum(BannerLinkType).optional(),
  position: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  startAt: z.string().datetime().optional().or(z.literal('')),
  endAt: z.string().datetime().optional().or(z.literal('')),
}).refine(
  (data) => {
    if (data.startAt && data.endAt) {
      return new Date(data.startAt) <= new Date(data.endAt);
    }
    return true;
  },
  {
    message: 'Start date must be before or equal to end date',
    path: ['endAt'],
  }
);

export const updateBannerSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required').optional(),
  link: z.string().optional(),
  linkType: z.nativeEnum(BannerLinkType).optional(),
  position: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  startAt: z.string().datetime().optional().or(z.literal('')),
  endAt: z.string().datetime().optional().or(z.literal('')),
}).refine(
  (data) => {
    if (data.startAt && data.endAt) {
      return new Date(data.startAt) <= new Date(data.endAt);
    }
    return true;
  },
  {
    message: 'Start date must be before or equal to end date',
    path: ['endAt'],
  }
);

export type CreateBannerFormData = z.infer<typeof createBannerSchema>;
export type UpdateBannerFormData = z.infer<typeof updateBannerSchema>;
