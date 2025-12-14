export type PromotionType = {
  id: string;
  name: string;
};

export type PromotionStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'EXPIRED';

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export type Promotion = {
  id: string;
  type: PromotionType;
  title: string;
  description: string;
  discount_type: DiscountType;
  discount_value: number;
  start_date: string;
  end_date: string;
  status: PromotionStatus;
};
