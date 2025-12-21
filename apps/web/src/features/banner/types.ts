export enum BannerLinkType {
  URL = 'URL',
  HOTEL = 'HOTEL',
  NEWS = 'NEWS',
}

export interface BannerImage {
  id: string;
  bannerId: string;
  url: string;
}

export interface Banner {
  id: string;
  title?: string;
  subtitle?: string;
  link?: string;
  linkType: BannerLinkType;
  position: number;
  isActive: boolean;
  startAt?: string;
  endAt?: string;
  images: BannerImage[];
  createdById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBannerInput {
  title?: string;
  subtitle?: string;
  images: string[];
  link?: string;
  linkType?: BannerLinkType;
  position?: number;
  isActive?: boolean;
  startAt?: string;
  endAt?: string;
}

export interface UpdateBannerInput {
  title?: string;
  subtitle?: string;
  images?: string[];
  link?: string;
  linkType?: BannerLinkType;
  position?: number;
  isActive?: boolean;
  startAt?: string;
  endAt?: string;
}
