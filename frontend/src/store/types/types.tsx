// ============ Cart DTOs ============
export interface AddToCartDto {
  AppuserId: string;
  ProductId: number;
  Quantity: number; // Range: 1+
}

export interface EditCartItemDto {
  Quantity: number; // Range: 1+
}

export interface GetCartDto {
  Id: number;
  AppuserId: string;
  ProductId: number;
  Quantity: number;
}

// ============ Categories DTOs ============
export interface AddCategoriesDto {
  Name: string; // Required, MinLength: 3
  ImageUrl: string; // Required, Regex: .+\.(jpg|jpeg|png|gif|webp)$
}

export interface EditCategoriesDto {
  Name?: string;
  ImageUrl?: string;
}

export interface GetCategoriesDto {
  Id: number;
  Name: string;
  ImageUrl: string;
  Products: GetProductDto[];
}

// ============ Coupon DTOs ============
export interface AddCouponDto {
  Code: string;
  Discount: number; // Range: 0-99
  MinimumAmount: number; // Range: 1+
  IsActive: boolean;
}

export interface EditCouponDto {
  Code: string;
  Discount: number; // Range: 0-99
  MinimumAmount: number; // Range: 1+
  IsActive: boolean;
}

export interface GetCouponDto {
  Code: string;
  Discount: number;
  MinimumAmount: number;
  CreatedAt: Date;
  ExpiryDate: Date;
  IsActive: boolean;
  Orders: GetOrderDto[];
}

// ============ Order DTOs ============
export interface AddOrderDto {
  UserAddress?: string;
  Coupon?: string;
}

export interface GetOrderDto {
  Id: number;
  AppuserId: string;
  UserAddress: string;
  TotalPrice: number;
  Status: OrderStatus;
  PaymentStatus: PaymentStatus;
  CreatedAt: Date;
  CouponId?: number;
  Discount?: number;
  OrderDetails: GetDetailsDto[];
}

export interface ResponseAddDto {
  Id: number;
  AppuserId: string;
  UserAddress: string;
  TotalPrice: number;
  PriceAfterDiscount: number;
  Status: OrderStatus;
  PaymentStatus: PaymentStatus;
  CreatedAt: Date;
  Coupon: string;
  Discount?: number;
}

export interface StatusResponseDto {
  Status?: OrderStatus;
  PaymentStatus?: PaymentStatus;
}

// ============ OrderDetails DTOs ============
export interface GetDetailsDto {
  Id: number;
  OrderId: number;
  ProductId: number;
  Quantity: number;
  Price: number;
}

// ============ Products DTOs ============
export interface AddProductDto {
  Name: string; // Required
  Description: string; // Required
  Price: number; // Required
  ImageUrl: string; // Required, Regex: .+\.(jpg|jpeg|png|gif|webp)$
  IsAvailable: boolean; // Required
  CategoryId: number; // Required
}

export interface EditProductDto {
  Name: string; // Required
  Description: string; // Required
  Price: number; // Required
  ImageUrl: string; // Required, Regex: .+\.(jpg|jpeg|png|gif|webp)$
  IsAvailable: boolean; // Required
  CategoryId: number; // Required
}

export interface GetProductDto {
  Id: number;
  Name: string;
  Description: string;
  Price: number;
  ImageUrl: string;
  SellCount: number;
  IsAvailable: boolean;
  CategoryId: number;
  Details: GetDetailsDto[];
  Reviews: GetReviewDto[];
}

// ============ Review DTOs ============
export interface AddReviewDto {
  ProductId: number;
  Rating: number; // Range: 1-5
  Comment?: string;
}

export interface EditReviewDto {
  ProductId: number;
  Rating: number; // Range: 1-5
  Comment?: string;
}

export interface GetReviewDto {
  Id: number;
  AppuserId: string;
  ProductId: number;
  Rating: number;
  Comment?: string;
  CreatedAt: Date;
}

// ============ User DTOs ============
export interface AddRoleDto {
  UserId: string;
  RoleName: string;
}

export interface ConfirmEmailDto {
  UserId: string;
  Token: string;
}

export interface ForgetPasswordDto {
  Email: string;
}

export interface RegisterModel {
  FullName?: string;
  Address?: string;
  UserName: string;
  Email: string;
  Password: string; // MinLength: 6
}

export interface ResetPasswordDto {
  Email: string;
  Token: string;
  NewPassword: string; // MinLength: 6
}

export interface ResponseLogin {
  IsAuth: boolean;
  Token: string;
  Email: string;
  UserName: string;
  Roles: string[];
  ExpiredOn: Date;
}

export interface ResponseRegister {
  Message: string;
  Email: string;
  UserName: string;
}

export interface RevokeToken {
  Token?: string;
}

export interface TokenRequestModel {
  Email: string;
  Password: string;
}

export interface UpdateProfileDto {
  FullName?: string;
  Address?: string;
}

export interface UserCreatedModel {
  Message?: string;
  IsAuth: boolean;
  UserName?: string;
  Email?: string;
  Roles?: string[];
  Token?: string;
  ExpiredOn?: Date;
  RefreshToken?: string;
  RefreshTokenExpiration: Date;
}

// ============ Enums ============
export type OrderStatus = 0 | 1 | 2 | 3 | 4;
export const OrderStatus = {
  Pending: 0 as const,
  Processing: 1 as const,
  Shipped: 2 as const,
  Delivered: 3 as const,
  Cancelled: 4 as const
} as const;

export type PaymentStatus = 0 | 1 | 2 | 3;
export const PaymentStatus = {
  Pending: 0 as const,
  Completed: 1 as const,
  Failed: 2 as const,
  Refunded: 3 as const
} as const;