// 1. غلاف الاستجابة الموحد (ApiResponse)
export interface ApiResponse<T> {
  isSuccess: boolean;
  data: T;
  message: string;
  error?: {
    statusCode: number;
    message: string;
    errors?: Record<string, string[]>;
  } | null;
}

// 2. كائن الصفحة (PagedResponse)
export interface PagedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

// 3. GetCategoriesDto المتوافق مع C# Backend
export interface GetCategoriesDto {
  id: number;
  name: string;
  imageUrl: string;
  nameAr: string;
  products?: GetProductDto[];
}

// 4. الفلاتر إرسالاً للسيرفر
export interface PageFilter {
  pageNumber: number;
  pageSize: number;
}

export interface Filter {
  pagination?: PageFilter;
  searchTerm?: string;
  sortByPrice?: boolean;
  sortBySelling?: boolean;
  minPrice?: number;
  maxPrice?: number;
  ascending?: boolean;
}
export interface OrderFilter {
  pagination?: PageFilter;
  searchTerm?: string;
  sortByPrice?: boolean;
  sortByDate?: boolean;
  ascending?: boolean;
  status?: number; // جديد
  paymentStatus?: number; // جديد
}




//=============POS DTOs====================

export type OrderSource = 0 | 1;
export const OrderSource = {
  online: 0 as const,
  pos: 1 as const,
} as const;

export interface PosOrderItemDto {
  productId: number;
  quantity: number;
}

export interface AddPosOrderDto {
  customerId?: string;
  guestName?: string;
  guestPhone?: string;
  items: PosOrderItemDto[];
  couponCode?: string;
  amountPaid: number;
}

// ============ Cart DTOs ============













export interface AddToCartDto {
  appUserId: string;
  productId: number;
  quantity: number; // Range: 1+
}

export interface EditCartItemDto {
  quantity: number; // Range: 1+
}

export interface GetCartDto {
  id: number;
  appUserId: string;
  productId: number;
  quantity: number;
}

// ============ Categories DTOs ============
export interface AddCategoriesDto {
  name: string; // Required, MinLength: 3
  nameAr: string; // Required, MinLength: 3
  imageUrl?: File; // Required, Regex: .+\.(jpg|jpeg|png|gif|webp)$
}

export interface EditCategoriesDto {
  name: string;
  nameAr: string;
  imageUrl?: File | null;
}

// ============ Coupon DTOs ============
export interface AddCouponDto {
  code: string;
  discount: number; // Range: 0-99
  minimumAmount: number; // Range: 1+
}

export interface EditCouponDto {
  code: string;
  discount: number; // Range: 0-99
  minimumAmount: number; // Range: 1+
}

export interface GetCouponDto {
  id: number;
  code: string;
  discount: number;
  minimumAmount: number;
  createdAt: Date;
  expiryDate: Date;
  orders: GetOrderDto[];
}

// ============ Order DTOs ============
export interface AddOrderDto {
  userAddress?: string;
  coupon?: string;
}

export interface GetOrderDto {
  id: number;
  appUserId: string;
  userAddress: string;
  totalPrice: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  couponId?: number;
  discount?: number;
  orderDetails: GetDetailsDto[];
  lastModifiedBy?: string; 

   guestName?: string;
  guestPhone?: string;
  amountPaid?: number;
  change?: number;
  source?: OrderSource;
}

export interface ResponseAddDto {
  id: number;
  appUserId: string;
  userAddress: string;
  totalPrice: number;
  priceAfterDiscount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  coupon: string;
  discount?: number;
}

export interface StatusResponseDto {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
}

// ============ OrderDetails DTOs ============
export interface GetDetailsDto {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
}

// ============ Products DTOs ============
export interface AddProductDto {
  name: string; // Required
  description: string; // Required
  price: number; // Required
  imageUrl?: File; // Required, Regex: .+\.(jpg|jpeg|png|gif|webp)$
  isAvailable: boolean; // Required
  preparingTime: number; // Required
  categoryId: number; // Required
  nameAr: string;
  descriptionAr: string;
}

export interface EditProductDto {
  name: string; // Required
  description: string; // Required
  price: number; // Required
  imageUrl?: File | null; // Required, Regex: .+\.(jpg|jpeg|png|gif|webp)$
  preparingTime: number; // Required
  isAvailable: boolean; // Required
  categoryId: number; // Required
  nameAr: string;
  descriptionAr: string;
}

export interface GetProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  preparingTime: number;
  sellCount: number;
  nameAr: string;
  descriptionAr: string;
  isAvailable: boolean;
  categoryId: number;
  details?: GetDetailsDto[];
  reviews?: GetReviewDto[];
}
export interface GetAllProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  preparingTime: number;
  sellCount: number;
  nameAr: string;
  descriptionAr: string;
  isAvailable: boolean;
  categoryId: number;
}

// ============ Review DTOs ============
export interface AddReviewDto {
  productId: number;
  rating: number; // Range: 1-5
  comment?: string;
}

export interface EditReviewDto {
  productId: number;
  rating: number; // Range: 1-5
  comment?: string;
}

export interface GetReviewDto {
  id: number;
  appUserId: string;
  userName: string;
  userImage: string;
  productId: number;
  rating: number;
  comment?: string;
  createdAt: Date;
}

// ============ User DTOs ============
export interface AddRoleDto {
  userId: string;
  roleName: string;
}

export interface ConfirmEmailDto {
  userId: string;
  token: string;
}

export interface ForgetPasswordDto {
  email: string;
}

export interface RegisterModel {
  fullName?: string;
  address?: string;
  userName: string;
  email: string;
  password: string; // MinLength: 6
}

export interface ResetPasswordDto {
  email: string;
  token: string;
  newPassword: string; // MinLength: 6
}

export interface ResponseLogin {
  isAuth: boolean;
  token: string;
  email: string;
  userName: string;
  roles: string[];
  expiredOn: Date;
}

export interface ResponseRegister {
  message: string;
  email: string;
  userName: string;
}

export interface RevokeToken {
  token?: string;
}

export interface TokenRequestModel {
  email: string;
  password: string;
}

export interface UpdateProfileDto {
  fullName?: string;
  address?: string;
  phoneNumber?: string;
  imageUrl?: File | string; // Optional, Regex: .+\.(jpg|jpeg|png|gif|webp)$
}

export interface FiltersUsers {
  pagination?: PageFilter;
  sortByUsername?: boolean;
  searchTerm?: string;
  ascending?: boolean;
}

export interface UserInfo {
  id: string;
  fullName?: string;
  address?: string;
  userName: string;
  email: string;
  phoneNumber?: string;
  imageUrl?: string;
  roles: string[];
}

export interface UserCreatedModel {
  message?: string;
  isAuth: boolean;
  userName?: string;
  email?: string;
  roles?: string[];
  token?: string;
  expiredOn?: Date;
  refreshToken?: string;
  refreshTokenExpiration: Date;
}

// ============ Enums ============
export type OrderStatus = 0 | 1 | 2 | 3 | 4;
export const OrderStatus = {
  pending: 0 as const,
  processing: 1 as const,
  shipped: 2 as const,
  delivered: 3 as const,
  cancelled: 4 as const,
} as const;

export type PaymentStatus = 0 | 1 | 2 | 3;
export const PaymentStatus = {
  pending: 0 as const,
  completed: 1 as const,
  failed: 2 as const,
  refunded: 3 as const,
} as const;
// ============ Dashboard DTOs ============
// ⬇️ الصق القسم ده في نهاية types.tsx الأصلي (مش ملف منفصل، عشان نفضل مصدر واحد للتايبات)

export interface RevenueSummaryDto {
  totalRevenue: number;
  netRevenue: number;
  averageOrderValue: number;
}

export interface OrdersSummaryDto {
  totalOrders: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export interface UsersSummaryDto {
  totalUsers: number;
  admins: number;
  managers: number;
  regularUsers: number;
}

export interface TopProductDto {
  id: number;
  name: string;
  nameAr: string;
  imageUrl?: string;
  sellCount: number;
  price: number;
}

export interface RevenuePointDto {
  date: string; // ISO date string
  revenue: number;
  ordersCount: number;
}

export interface DashboardOverviewDto {
  revenue: RevenueSummaryDto;
  orders: OrdersSummaryDto;
  users: UsersSummaryDto;
  topProducts: TopProductDto[];
  revenueTrend: RevenuePointDto[];
}