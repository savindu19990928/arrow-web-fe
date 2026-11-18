export type Role = 'CUSTOMER' | 'ADMIN' | 'STAFF';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: Role;
  profile_photo?: string | null;
  is_verified?: boolean;
  is_staff?: boolean;
  created_at?: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string | null;
  parent?: number | null;
  parent_name?: string | null;
  display_order?: number;
  is_active?: boolean;
  product_count?: number;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string;
  website?: string;
  is_active?: boolean;
  product_count?: number;
}

export interface ProductSummary {
  id: number;
  name: string;
  slug: string;
  sku: string;
  short_description: string;
  price: string;
  compare_at_price: string | null;
  discount_percentage: number;
  stock_quantity: number;
  in_stock: boolean;
  category: Category;
  brand: Brand;
  primary_image: string | null;
  has_3d_model: boolean;
  is_featured: boolean;
  average_rating: string;
  review_count: number;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
}

export interface Specification {
  id: number;
  group: string;
  key: string;
  value: string;
  display_order: number;
}

export interface Variant {
  id: number;
  sku: string;
  name: string;
  color?: string | null;
  size?: string | null;
  model_variant?: string | null;
  battery_capacity?: string | null;
  wheel_size?: string | null;
  configuration?: string | null;
  price_override?: string | null;
  final_price: string;
  stock_quantity: number;
  in_stock: boolean;
  image?: string | null;
  is_active: boolean;
}

export interface Viewer3D {
  id: number;
  name: string;
  has_3d_model: boolean;
  model_3d_file: string | null;
  model_3d_format?: string | null;
  model_3d_poster?: string | null;
  camera_orbit?: string | null;
  field_of_view?: string | null;
  auto_rotate?: boolean;
  allow_zoom?: boolean;
  environment_preset?: string | null;
}

export interface ProductDetail extends ProductSummary {
  description: string;
  warranty_information: string;
  estimated_arrival_days: number;
  images: ProductImage[];
  specifications: Specification[];
  variants: Variant[];
  viewer_3d: Viewer3D | null;
}

export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_slug: string;
  product_sku: string;
  product_image: string | null;
  variant_id: number | null;
  variant_name: string | null;
  variant_sku: string | null;
  quantity: number;
  unit_price: string;
  line_total: string;
}

export interface Cart {
  id: number;
  guest_token: string | null;
  items: CartItem[];
  total_items_count: number;
  subtotal: string;
  estimated_delivery_fee?: string;
  grand_total: string;
  max_lead_time_days?: number;
  updated_at?: string;
}

export interface WishlistItem {
  id: number;
  product: {
    id: number;
    name: string;
    slug: string;
    sku: string;
    price: string;
    in_stock: boolean;
    primary_image: string | null;
  };
  created_at: string;
}

export interface CouponResult {
  valid: boolean;
  code: string;
  discount_type: 'PERCENTAGE' | 'FIXED';
  discount_value: number;
  discount_amount: number;
  discounted_subtotal: number;
  message: string;
}

export interface Campaign {
  id: number;
  title: string;
  slug: string;
  description: string;
  banner: string | null;
  discount_percentage: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_live: boolean;
}

export type OrderStatus =
'PENDING' |
'CONFIRMED' |
'PROCESSING' |
'PACKED' |
'HANDED_OVER' |
'IN_TRANSIT' |
'DELIVERED' |
'CANCELLED' |
'RETURNED' |
'REFUNDED';

export type PaymentStatus = 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

export type PaymentMethod = 'KOKO' | 'MINTPAY' | 'BANK_TRANSFER' | 'CARD_ONLINE';

export interface AdminPayment {
  id: number;
  order: number;
  order_number: string;
  order_status: OrderStatus;
  payment_method: PaymentMethod;
  amount: string;
  currency: string;
  status: PaymentStatus;
  transaction_id: string | null;
  reference_number: string | null;
  bank_slip_image: string | null;
  bank_name: string | null;
  deposit_date: string | null;
  customer_bank_reference: string | null;
  bank_transfer_submitted_at: string | null;
  is_bank_transfer_submitted: boolean;
  is_verified: boolean;
  verified_by_email: string | null;
  verified_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminNotification {
  id: number;
  notification_type: string;
  title: string;
  message: string;
  data?: Record<string, string | number | null>;
  is_read: boolean;
  created_at: string;
}

export interface OrderItem {
  id: number;
  product?: number;
  product_name: string;
  variant_name: string | null;
  sku?: string;
  unit_price: string;
  quantity: number;
  total_price: string;
  warranty_snapshot?: string;
}

export interface StatusHistory {
  id: number;
  status: OrderStatus;
  note: string;
  changed_by_name?: string;
  created_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  customer_name: string;
  customer_contact: string;
  shipping_recipient_name?: string;
  shipping_phone?: string;
  shipping_address_line1?: string;
  shipping_address_line2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  subtotal: string;
  discount_amount: string;
  delivery_charge: string;
  total_amount: string;
  coupon_code?: string | null;
  estimated_arrival_date: string | null;
  courier_name?: string | null;
  tracking_number?: string | null;
  delivery_notes?: string;
  placed_at?: string;
  confirmed_at?: string | null;
  delivered_at?: string | null;
  items: OrderItem[];
  status_history?: StatusHistory[];
}

export interface OrderSummary {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  total_amount: string;
  placed_at: string;
  estimated_arrival_date: string | null;
  items_count: number;
  customer_name: string;
}

export interface TrackResult {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  courier_name: string | null;
  tracking_number: string | null;
  estimated_arrival_date: string | null;
  total_amount: string;
}

export interface Address {
  id: number;
  recipient_name: string;
  phone_number: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state_or_province?: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  delivery_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BankAccount {
  bank_name: string;
  account_name: string;
  account_number: string;
  branch: string;
  swift_code: string;
}

export interface BankDetails {
  bank_accounts: BankAccount[];
  instructions: string;
}

export interface PaymentInit {
  provider: string;
  payment_id: number;
  order_number: string;
  amount: number;
  currency?: string;
  installments?: number;
  installment_amount?: number;
  checkout_url?: string;
  message: string;
}

export interface Review {
  id: number;
  product: number;
  user_name: string;
  rating: number;
  title: string;
  review_text: string;
  verified_purchase: boolean;
  created_at: string;
}

export interface AppNotification {
  id: number;
  notification_type: string;
  title: string;
  message: string;
  data?: {order_number?: string;};
  is_read: boolean;
  created_at: string;
}

export interface NotificationList {
  unread_count: number;
  notifications: AppNotification[];
}

export interface StockLevel {
  id: number;
  sku: string;
  name: string;
  category_name: string;
  stock_quantity: number;
  low_stock_threshold: number;
  is_low_stock: boolean;
  is_out_of_stock: boolean;
}

export interface DashboardSummary {
  today_revenue: number;
  month_to_date_revenue: number;
  active_orders_count: number;
  pending_bank_verifications_count: number;
  low_stock_alerts_count: number;
}

export type ReportValue = string | number | boolean | null;

export interface ReportPayload {
  report?: string;
  start_date?: string;
  end_date?: string;
  summary?: Record<string, ReportValue>;
  [key: string]: unknown;
}