# Arrow Ventures E-Commerce - Frontend Development Master Prompt & API Integration Guide

> **Purpose:** This document is a complete, turnkey instruction prompt and API specification guide for frontend developers or AI coding agents (v0, Cursor, Claude, ChatGPT) building the modern web and mobile frontend for **Arrow Ventures**.
> **Production API Base URL:** `https://api.arrowventures.lk`  

---

## 1. System Prompt for the Frontend AI Agent / Developer

```markdown
You are an expert Senior Full-Stack / Frontend Engineer tasked with building the official e-commerce web application for "Arrow Ventures" (Arrow E-Commerce), Sri Lanka's premier destination for high-performance electric bicycles (e-bikes), conversion kits, replacement battery packs, hub motors, spare parts, and accessories.

### Core Goals & Priorities
1. Build a high-converting, modern, clean, responsive, and blazing-fast e-commerce application.
2. Deliver immersive 3D product visualization using Google's `<model-viewer>` for supported e-bikes and mechanical components.
3. Provide seamless, multi-channel checkout with support for Guest Checkout and Registered Customers.
4. Implement reliable payment options:
   - Direct Bank Transfer with deposit slip upload (JPG, PNG, PDF) and real-time verification tracking.
   - Koko (Buy Now Pay Later).
   - Mintpay (3 Interest-Free Installments).
5. Build an intuitive Customer Account Portal (Order History, Saved Addresses, Profile, Wishlist, PDF Invoices, Reviews, Notifications).
6. Build a powerful Admin Operations Dashboard (Order Fulfillment, Bank Transfer Slip Verification Queue, Inventory Stock Ledger, and 8 Analytical Reports with CSV exports).

### Recommended Frontend Tech Stack
- **Framework:** Next.js 15+ (App Router) or React 19 + Vite with TypeScript.
- **Styling:** Tailwind CSS + shadcn/ui + Radix UI + Lucide React icons.
- **State Management & Data Fetching:** TanStack Query v5 (React Query) for server state + Zustand for client state (Cart, Auth, UI Modals).
- **3D Viewer:** `@google/model-viewer` web component.
- **Form Handling:** React Hook Form + Zod for runtime schema validation.
- **Notifications & Feedback:** Sonner / React Hot Toast for modern toast alerts.
- **Date Formatting:** date-fns.
- **Currency Helper:** Format all monetary amounts as `LKR {amount:,.2f}`.
```

---

## 2. Global Architecture, Storage & Network Invariants

### 2.1 API Base URL & HTTP Client Configuration
Configure an Axios or Fetch client with interceptors:
- Default `Content-Type: application/json` (automatically use `multipart/form-data` when `FormData` is passed).
- **JWT Authorization:** On authenticated requests, include header:
  ```http
  Authorization: Bearer <accessToken>
  ```
- **Automatic Token Refresh:** When receiving a `401 Unauthorized` response with an expired access token, call `POST /api/auth/refresh/` using the stored refresh token, update storage, and retry the failed request.
- **Guest Token Header (`X-Guest-Token`):** For anonymous shoppers, generate and persist a UUID in `localStorage` under `arrow_guest_token`. Send this token on every cart and guest request:
  ```http
  X-Guest-Token: <guestToken>
  ```
  *(Also read the `X-Guest-Token` response header on initial cart requests if none was stored yet).*

### 2.2 Google Cloud Storage (GCP) Direct Public URL Policy
All media assets (product images, variant photos, category banners, 3D `.glb` files, uploaded bank receipts, profile photos) are hosted on Google Cloud Storage (`arrowcs` bucket).
- **No Expiring Signatures:** The backend enforces permanent, non-expiring public URLs:
  `https://storage.googleapis.com/arrowcs/media/...`
- **Frontend Benefit:** Direct URLs can be safely embedded in standard `<img src="...">`, `<video src="...">`, or `<model-viewer src="...">` without token renewal or signature expiration issues.

### 2.3 Financial & Calculation Rules
1. **Never Calculate Order Totals on the Client for Checkout Submission:** The backend recomputes prices, coupon discounts, shipping fees, and taxes from the database. The frontend calculates previews for UI responsiveness only.
2. **Delivery Fee Invariant:**
   - Free delivery for orders with Subtotal $\ge$ **LKR 100,000.00**.
   - Standard flat delivery fee of **LKR 2,500.00** for orders below LKR 100,000.00.
3. **Estimated Delivery Date (Slowest Product Rule):**
   - The order delivery ETA equals the maximum `estimated_arrival_days` among all line items in the cart (e.g. 3-day accessory + 14-day pre-order e-bike = 14-day ETA).

---

## 3. Detailed Functional Requirements & API Guide by Module

---

### Module 1: Customer Authentication & Profile Management

#### Functional Requirements
1. **Registration:** Email-first registration with password confirmation and optional phone number. Immediately logs in the user and stores JWT tokens.
2. **Login:** Email and password authentication returning JWT `access` and `refresh` tokens and user role (`CUSTOMER`, `STAFF`, `ADMIN`).
3. **Token Refresh:** Silent background renewal of access tokens before expiration.
4. **Profile View & Edit:** View and edit personal details (First Name, Last Name, Phone Number, Profile Picture).
5. **Change Password:** In-app secure password update requiring existing password verification.

#### API Endpoints
| Action | Method | Endpoint | Access | Request Body |
|---|---|---|---|---|
| Register Customer | `POST` | `/api/auth/register/` | Public | `{ email, password, password_confirm, first_name, last_name, phone_number? }` |
| Login | `POST` | `/api/auth/login/` | Public | `{ email, password }` |
| Refresh Token | `POST` | `/api/auth/refresh/` | Public | `{ refresh }` |
| Get Profile | `GET` | `/api/auth/profile/` | Customer | None |
| Update Profile | `PATCH`| `/api/auth/profile/` | Customer | `{ first_name?, last_name?, phone_number?, profile_photo? }` |
| Change Password | `POST` | `/api/auth/change-password/` | Customer | `{ old_password, new_password, new_password_confirm }` |

```typescript
// Response: POST /api/auth/login/
interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
    access: string;
    refresh: string;
    user: {
      id: number;
      email: string;
      first_name: string;
      last_name: string;
      phone_number: string | null;
      role: "CUSTOMER" | "STAFF" | "ADMIN";
      is_staff: boolean;
      is_superuser: boolean;
    };
  };
}
```

---

### Module 2: Saved Delivery Addresses

#### Functional Requirements
1. Customer can save multiple delivery addresses with Recipient Name, Phone, Address Lines, City, Province, Postal Code, and Delivery Notes.
2. One address can be marked as Default Delivery Address.
3. Full CRUD capability with inline address selection in the checkout modal.

#### API Endpoints
| Action | Method | Endpoint | Access | Request Body |
|---|---|---|---|---|
| List Addresses | `GET` | `/api/addresses/` | Customer | None |
| Create Address | `POST` | `/api/addresses/` | Customer | `{ recipient_name, phone_number, address_line1, address_line2?, city, state_or_province?, postal_code, country, is_default?, delivery_notes? }` |
| Update Address | `PATCH`| `/api/addresses/{id}/` | Customer | Partial address payload |
| Delete Address | `DELETE`| `/api/addresses/{id}/` | Customer | None |
| Set as Default | `POST` | `/api/addresses/{id}/set-default/` | Customer | None |

---

### Module 3: Product Catalog, Search & Filtering

#### Functional Requirements
1. **Category Navigation:** Tree hierarchy displaying categories (e.g. Electric Bicycles, Spare Parts, Conversion Kits, Accessories) with product counts and images.
2. **Brand Showcase:** Filter by manufacturer/brand with brand logos.
3. **Advanced Product Filtering & Sorting:**
   - Multi-criteria filtering: `category` (slug), `brand` (slug), `min_price`, `max_price`, `in_stock=true`, `has_3d_model=true`, `is_featured=true`.
   - Full-text search matching product name, description, SKU, and brand (`?search=...`).
   - Sorting options: Price Low $\to$ High (`ordering=price`), Price High $\to$ Low (`ordering=-price`), Newest First (`ordering=-created_at`), Top Rated (`ordering=-average_rating`).
4. **Product Detail Page (PDP):**
   - High-res image gallery with primary thumbnail selector.
   - Dynamic variant picker (e.g. Color, Frame Size, Battery Capacity like 48V 17.5Ah vs 52V 20Ah) updating SKU, price override, and stock status.
   - Categorized technical specifications (Performance, Electrical, Mechanical).
   - Warranty badge and estimated delivery days.
   - Customer review rating stars and count.

#### API Endpoints
| Action | Method | Endpoint | Access | Query Parameters |
|---|---|---|---|---|
| List Categories | `GET` | `/api/catalog/categories/` | Public | None |
| List Brands | `GET` | `/api/catalog/brands/` | Public | None |
| List Products | `GET` | `/api/catalog/products/` | Public | `category`, `brand`, `min_price`, `max_price`, `in_stock`, `has_3d_model`, `is_featured`, `search`, `ordering`, `page` |
| Product Detail | `GET` | `/api/catalog/products/{slug}/` | Public | None |
| 3D Viewer Asset | `GET` | `/api/catalog/products/{slug}/3d-model/` | Public | None |

---

### Module 4: Interactive 3D Product Viewer (`<model-viewer>`)

#### Functional Requirements
1. Render an interactive 3D view for products where `has_3d_model === true`.
2. Support full 360-degree rotation, pinch/scroll zoom, auto-rotation, and field-of-view configuration.
3. Display a loading poster image while the `.glb` binary streams from Google Cloud Storage.
4. Provide a toggle between "3D Interactive Model" and "Photo Gallery".
5. Provide AR (Augmented Reality) quick-look button on supported mobile devices (iOS Quick Look / Android Scene Viewer).

#### Frontend Implementation Pattern
```tsx
import "@google/model-viewer";

interface ModelViewerProps {
  src: string; // Direct GCS URL (e.g. https://storage.googleapis.com/arrowcs/media/models_3d/bike.glb)
  poster?: string;
  cameraOrbit?: string;
  fieldOfView?: string;
  autoRotate?: boolean;
  allowZoom?: boolean;
}

export function Product3DViewer({
  src,
  poster,
  cameraOrbit = "0deg 75deg 105%",
  fieldOfView = "30deg",
  autoRotate = true,
  allowZoom = true,
}: ModelViewerProps) {
  return (
    <div className="relative w-full h-[450px] md:h-[550px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
      <model-viewer
        src={src}
        poster={poster}
        camera-orbit={cameraOrbit}
        field-of-view={fieldOfView}
        camera-controls
        auto-rotate={autoRotate ? "" : undefined}
        interaction-prompt="auto"
        shadow-intensity="1.5"
        shadow-softness="0.8"
        exposure="1.0"
        ar
        ar-modes="webxr scene-viewer quick-look"
        style={{ width: "100%", height: "100%" }}
      >
        <div slot="poster" className="w-full h-full flex items-center justify-center bg-slate-950">
          <img src={poster} alt="3D Loading Poster" className="max-h-full object-contain animate-pulse" />
        </div>
      </model-viewer>
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white">
        Drag to rotate • Pinch to zoom
      </div>
    </div>
  );
}
```

---

### Module 5: Shopping Cart & Wishlist

#### Functional Requirements
1. **Guest & User Cart Unified:** Unauthenticated users use `X-Guest-Token`. When the user registers or logs in, call `POST /api/cart/merge/` to transfer all guest cart items to their user account.
2. **Variant-Aware Cart:** Cart stores specific `variant_id` (e.g. Stealth Black / 48V 17.5Ah).
3. **Live Quantity Controls:** Increment, decrement, delete, and clear cart with instant total updates.
4. **Stock Validation:** Backend rejects quantities exceeding available stock.
5. **Customer Wishlist:** One-click toggle (heart icon) to save and remove products from customer wishlist.

#### API Endpoints
| Action | Method | Endpoint | Access | Headers / Body |
|---|---|---|---|---|
| View Cart | `GET` | `/api/cart/` | Public / Customer | `X-Guest-Token` or `Bearer <token>` |
| Add to Cart | `POST` | `/api/cart/` | Public / Customer | `{ product_id, variant_id?, quantity }` |
| Update Item Qty | `PATCH`| `/api/cart/items/{id}/` | Public / Customer | `{ quantity }` |
| Remove Cart Item | `DELETE`| `/api/cart/items/{id}/` | Public / Customer | None |
| Clear Cart | `DELETE`| `/api/cart/` | Public / Customer | None |
| Merge Guest Cart | `POST` | `/api/cart/merge/` | Customer | `{ guest_token }` |
| Get Wishlist | `GET` | `/api/wishlist/` | Customer | None |
| Toggle Wishlist | `POST` | `/api/wishlist/` | Customer | `{ product_id }` |

---

### Module 6: Promotional Campaigns & Coupon Validation

#### Functional Requirements
1. **Promotional Banners:** Display live homepage banners and seasonal sales cards fetched from `/api/promotions/campaigns/`.
2. **Interactive Coupon Application:** User enters promo code (e.g. `ARROW10`) in cart/checkout; call `/api/promotions/coupons/validate/` to preview discount value and verified subtotal before order placement.

#### API Endpoints
| Action | Method | Endpoint | Access | Request Body |
|---|---|---|---|---|
| List Campaigns | `GET` | `/api/promotions/campaigns/` | Public | None |
| Validate Coupon | `POST` | `/api/promotions/coupons/validate/` | Public / Customer | `{ code: "ARROW10", subtotal: 360000.00 }` |

---

### Module 7: Checkout & Order Placement

#### Functional Requirements
1. **Guest Checkout:** Supported without forced registration (requires `guest_name`, `guest_email`, `guest_phone`, `guest_token`).
2. **Customer Checkout:** Auto-fills saved address, links order to customer ID, and updates customer dashboard.
3. **Atomic Stock Deduction:** Stock is atomically checked and reserved upon order creation.
4. **Payment Method Selection:** `BANK_TRANSFER`, `KOKO`, `MINTPAY`, or `CARD_ONLINE`.
5. **Order Response:** Returns unique Order Number (e.g. `ARW-20261028-9F3A1B`), item snapshots, payment status `PENDING`, order status `PENDING`, and embedded `bank_transfer_details` if Bank Transfer was selected.

#### API Endpoints
| Action | Method | Endpoint | Access | Request Body |
|---|---|---|---|---|
| Checkout Order | `POST` | `/api/orders/checkout/` | Public / Customer | See below |

```typescript
// Request Body: POST /api/orders/checkout/
interface CheckoutRequestPayload {
  // Guest fields (only required if unauthenticated)
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  guest_token?: string;

  // Shipping Address
  shipping_recipient_name: string;
  shipping_phone: string;
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_state?: string;
  shipping_postal_code: string;
  shipping_country?: string; // defaults to "Sri Lanka"

  // Payment & Options
  payment_method: "BANK_TRANSFER" | "KOKO" | "MINTPAY" | "CARD_ONLINE";
  coupon_code?: string;
  delivery_notes?: string;
}
```

---

### Module 8: Payment Methods & Direct Bank Transfer Verification Flow

#### Core Payment Invariants
1. **State Independence:** Orders placed via `BANK_TRANSFER` enter `PENDING` status.
2. **No Premature Confirmation:** Orders are **NEVER marked `CONFIRMED`** upon checkout. They remain in `PENDING` state until an authorized Admin verifies the bank deposit slip.
3. **Payment Record Linked:** The backend automatically creates a `Payment` record in `PENDING` status linked to the order.

#### 1. Direct Bank Transfer Flow (Step-by-Step)
1. **Checkout:** Customer selects `BANK_TRANSFER` and completes checkout.
2. **Instruction Display:** The frontend immediately presents the official bank account numbers, branch, account name, SWIFT codes, and transfer instructions fetched via `GET /api/payments/bank-details/` or embedded in `order.bank_transfer_details`.
3. **Transfer & Slip Upload:** After transferring funds via their mobile banking app or branch deposit counter, the customer submits the deposit receipt:
   - Endpoint: `POST /api/payments/bank-transfer/submit-slip/` (`multipart/form-data`)
   - Form Fields: `order_number`, `customer_bank_reference`, `deposit_date` (`YYYY-MM-DD`), `bank_name` (optional), `contact` (optional for guests), and `bank_slip_image` (JPG, PNG, or PDF file up to 5 MB).
4. **Pending Verification State:** Upon receipt upload:
   - Payment status remains `PENDING`.
   - Order status remains `PENDING`.
   - Field `bank_transfer_submitted_at` is set.
   - System triggers a `BANK_PAYMENT_PENDING` alert to store administrators.
   - The UI displays: *"Deposit slip submitted. Awaiting verification by Arrow Ventures finance team."*
5. **Admin Review & Confirmation:**
   - Staff/Admin views the pending list via `GET /api/admin/payments/pending-verifications/`.
   - Admin inspects the receipt image or PDF via the direct public URL `bank_slip_image`.
   - Admin executes verification via `POST /api/admin/payments/{id}/verify/`:
     - **Action `APPROVE`:** Sets `Payment.status = SUCCESSFUL`, `Order.payment_status = SUCCESSFUL`, transitions `Order.status = CONFIRMED`, and notifies customer.
     - **Action `REJECT`:** Sets `Payment.status = FAILED`, keeps `Order.status = PENDING`, and notifies customer of the rejection reason so they can re-upload a clear receipt.

#### 2. Koko (BNPL) & Mintpay (3 Installments) Flow
1. Customer selects `KOKO` or `MINTPAY` during checkout or switches via `POST /api/payments/initiate/`.
2. Response returns `checkout_url` and session/token ID.
3. Frontend redirects the customer to the provider's secure checkout page.
4. Provider notifies Arrow Ventures via server-to-server webhook callbacks (`/api/payments/koko/callback/`, `/api/payments/mintpay/callback/`), which mark the order `CONFIRMED` upon payment success.

#### API Endpoints
| Action | Method | Endpoint | Access | Content-Type & Payload |
|---|---|---|---|---|
| Get Bank Details | `GET` | `/api/payments/bank-details/` | Public | None |
| Initiate / Switch Payment | `POST` | `/api/payments/initiate/` | Public / Customer | `{ order_number, payment_method }` |
| Submit Bank Deposit Slip | `POST` | `/api/payments/bank-transfer/submit-slip/` | Public / Customer | `multipart/form-data`: `order_number`, `customer_bank_reference`, `deposit_date`, `bank_slip_image` (file: jpg/png/pdf), `bank_name?`, `contact?` |
| List Pending Verifications | `GET` | `/api/admin/payments/pending-verifications/` | Staff / Admin | Query: `page` |
| Verify Bank Payment | `POST` | `/api/admin/payments/{id}/verify/` | Staff / Admin | `{ action: "APPROVE" \| "REJECT", admin_notes?: string, transaction_id?: string, confirm_without_slip?: boolean }` |
| List All Payments (Admin) | `GET` | `/api/admin/payments/` | Staff / Admin | Query: `payment_method`, `status`, `submitted=true\|false`, `search`, `ordering`, `page` |
| Get Single Payment (Admin) | `GET` | `/api/admin/payments/{id}/` | Staff / Admin | None |
| Get / Update Bank Settings | `GET` / `PUT` | `/api/admin/payments/bank-details/` | Staff / Admin (`PUT` Admin only) | `{ bank_accounts: [...], instructions?: string }` |

---

### Module 9: Order Tracking, Status Progression & PDF Invoices

#### Order Status Lifecycle
```
PENDING (Awaiting Payment / Bank Slip Verification)
   │
   ▼ [Admin verifies bank transfer / Gateway callback]
CONFIRMED (Payment Verified)
   │
   ▼ [Fulfillment Team]
PROCESSING (Assembling & Quality Check)
   │
   ▼
PACKED (Packed & Ready for Dispatch)
   │
   ▼
HANDED_OVER (Handed to Courier Partner)
   │
   ▼
IN_TRANSIT (Out for Delivery with Tracking Number)
   │
   ▼
DELIVERED (Customer Received)
```

#### Functional Requirements
1. **Authenticated Customer Orders:** View paginated history of all placed orders with status badges and line items.
2. **Public Guest Order Tracking:** Unauthenticated customers track order progress by supplying `order_number` + guest email/phone at `GET /api/orders/track/?order_number=...&contact=...`.
3. **Branded PDF Invoice Download:** One-click download button for official PDF tax invoice / receipt generated server-side with ReportLab:
   - URL: `/api/orders/{id}/invoice/` (for guests: `/api/orders/{id}/invoice/?contact=email_or_phone`).
   - Browser triggers download with `Content-Type: application/pdf` and `Content-Disposition: attachment; filename="Invoice_ARW-...pdf"`.
4. **Order Status Timeline:** Display visual stepped timeline (`status_history`) showing timestamps, status notes, and actor.

#### API Endpoints
| Action | Method | Endpoint | Access | Query Parameters |
|---|---|---|---|---|
| Customer Order List | `GET` | `/api/orders/` | Customer | `status`, `payment_status`, `page` |
| Customer Order Detail | `GET` | `/api/orders/{id}/` | Customer / Admin | None |
| Public Guest Tracking | `GET` | `/api/orders/track/` | Public | `order_number`, `contact` (email or phone) |
| Download PDF Invoice | `GET` | `/api/orders/{id}/invoice/` | Public / Customer | `contact?` (required for guest access) |
| Admin Order List | `GET` | `/api/admin/orders/` | Staff / Admin | `status`, `payment_status`, `payment_method`, `search`, `ordering`, `page` |
| Admin Update Order Status | `POST` | `/api/admin/orders/{id}/update-status/` | Staff / Admin | `{ status, courier_name?, tracking_number?, note? }` |

---

### Module 10: Order Cancellations, Returns & Refunds

#### Functional Requirements
1. **Pre-Dispatch Cancellation:** Customers can submit a cancellation request before the order is marked `PACKED` or `HANDED_OVER`.
2. **Post-Delivery Return & Refund:** Customers can submit a return/refund request specifying `RETURN_AND_REFUND` or `REFUND_ONLY`, requested refund amount, reason, and customer bank account details to receive refund.
3. **Admin Review Queue:** Admin reviews requests and marks them `APPROVED`, `REJECTED`, or `COMPLETED`.

#### API Endpoints
| Action | Method | Endpoint | Access | Request Body |
|---|---|---|---|---|
| Request Cancellation | `POST` | `/api/orders/{id}/cancel/` | Customer | `{ reason }` |
| Request Return / Refund | `POST` | `/api/orders/{id}/return-refund/` | Customer | `{ type: "RETURN_AND_REFUND" \| "REFUND_ONLY", refund_amount, reason, bank_details_for_refund? }` |
| Admin Approve Cancellation | `POST` | `/api/admin/cancellations/{id}/approve/` | Staff / Admin | None |
| Admin Reject Cancellation | `POST` | `/api/admin/cancellations/{id}/reject/` | Staff / Admin | `{ admin_note?: string }` |
| Admin Resolve Refund | `POST` | `/api/admin/returns-refunds/{id}/resolve/` | Staff / Admin | `{ status: "APPROVED" \| "REJECTED" \| "COMPLETED", admin_note?: string }` |

---

### Module 11: Product Reviews & Verified Ratings

#### Functional Requirements
1. Public customer reviews list with star rating breakdown (1 to 5), reviewer name, review title, review body, and date.
2. Verified Purchase badge: The backend checks order history for the product and automatically tags `verified_purchase: true`.
3. Submit review modal for logged-in customers.

#### API Endpoints
| Action | Method | Endpoint | Access | Query / Request Body |
|---|---|---|---|---|
| List Reviews | `GET` | `/api/reviews/` | Public | `?product_slug=...` or `?product_id=...` |
| Submit Review | `POST` | `/api/reviews/submit/` | Customer | `{ product: number, rating: 1-5, title: string, review_text: string }` |
| Admin Moderate Review | `DELETE`| `/api/admin/reviews/{id}/` | Staff / Admin | None |

---

### Module 12: Notifications & Alerts

#### Functional Requirements
1. **Customer Notification Center:** Bell icon in navigation bar with unread count badge. Dropdown/page listing order status changes, bank transfer verification approvals/rejections, and payment receipts.
2. **Mark as Read:** Individual click to mark read or "Mark All as Read" button.
3. **Admin Alert Feed:** Real-time store alerts for staff: pending bank transfer receipts (`BANK_PAYMENT_PENDING`), low stock warnings (`LOW_STOCK`), and cancellation requests.

#### API Endpoints
| Action | Method | Endpoint | Access | Request Body |
|---|---|---|---|---|
| Customer Notifications | `GET` | `/api/notifications/` | Customer | None |
| Mark Single Read | `POST` | `/api/notifications/{id}/mark-read/` | Customer | None |
| Mark All Read | `POST` | `/api/notifications/mark-all-read/` | Customer | None |
| Admin Alert Feed | `GET` | `/api/admin/notifications/` | Staff / Admin | None |

---

### Module 13: Admin Operations & Business Analytics Suite

#### Functional Requirements
1. **Executive Dashboard Summary:** KPI metric cards:
   - Today's Sales Revenue (LKR)
   - Month-to-Date Revenue (LKR)
   - Active Orders in Pipeline
   - Pending Bank Payment Verifications Count
   - Low Stock Alert Items Count
2. **8 Comprehensive Analytical Reports:**
   - Date range selector (`start_date=YYYY-MM-DD`, `end_date=YYYY-MM-DD`).
   - One-click CSV export download (`?export=csv`).
   - Interactive charts (Revenue trends, Orders by status, Top-selling products, Payment method distribution).

#### API Endpoints
| Report | Method | Endpoint | Query Parameters |
|---|---|---|---|
| Dashboard Summary KPIs | `GET` | `/api/admin/reports/dashboard-summary/` | None |
| 1. Product Sales Report | `GET` | `/api/admin/reports/product-sales/` | `start_date`, `end_date`, `export=csv` |
| 2. Orders Report | `GET` | `/api/admin/reports/orders/` | `start_date`, `end_date`, `export=csv` |
| 3. Payments Report | `GET` | `/api/admin/reports/payments/` | `start_date`, `end_date`, `export=csv` |
| 4. Income / Revenue Report | `GET` | `/api/admin/reports/income/` | `start_date`, `end_date`, `export=csv` |
| 5. Inventory / Stock Report | `GET` | `/api/admin/reports/inventory/` | `export=csv` |
| 6. Customer Purchase Report | `GET` | `/api/admin/reports/customer-purchases/` | `start_date`, `end_date`, `export=csv` |
| 7. Discounts & Promo Report | `GET` | `/api/admin/reports/discounts-promotions/` | `start_date`, `end_date`, `export=csv` |
| 8. Cancellations & Refunds | `GET` | `/api/admin/reports/cancellations-refunds/` | `start_date`, `end_date`, `export=csv` |

#### Inventory Adjustment & Stock Ledger
| Action | Method | Endpoint | Request Body |
|---|---|---|---|
| Stock Levels List | `GET` | `/api/admin/inventory/stock-levels/` | `?low_stock=true` or `?out_of_stock=true` |
| Adjust Stock | `POST` | `/api/admin/inventory/adjust/` | `{ product_id, variant_id?, quantity, movement_type: "RESTOCK" \| "DAMAGE" \| "CORRECTION" \| "SALE", reason: string }` |
| Movement Audit Trail | `GET` | `/api/admin/inventory/movements/` | `?product_id=...` |

---

## 4. Complete TypeScript Interfaces for the Frontend

Create a dedicated types file `src/types/api.ts`:

```typescript
// ==================== User & Address ====================
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  role: "CUSTOMER" | "STAFF" | "ADMIN";
  profile_photo: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface Address {
  id: number;
  recipient_name: string;
  phone_number: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state_or_province?: string | null;
  postal_code: string;
  country: string;
  is_default: boolean;
  delivery_notes?: string | null;
  created_at: string;
  updated_at: string;
}

// ==================== Catalog & 3D Viewer ====================
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parent: number | null;
  parent_name?: string | null;
  display_order: number;
  is_active: boolean;
  product_count: number;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  website: string | null;
  is_active: boolean;
  product_count: number;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number;
}

export interface ProductSpecification {
  id: number;
  group: string;
  key: string;
  value: string;
  display_order: number;
}

export interface ProductVariant {
  id: number;
  sku: string;
  name: string;
  color: string | null;
  size: string | null;
  model_variant: string | null;
  battery_capacity: string | null;
  wheel_size: string | null;
  configuration: string | null;
  price_override: string | null;
  final_price: string;
  stock_quantity: number;
  in_stock: boolean;
  image: string | null;
  is_active: boolean;
}

export interface Product3DViewerConfig {
  id: number;
  name: string;
  has_3d_model: boolean;
  model_3d_file: string | null; // Direct .glb GCS URL
  model_3d_format: "GLB" | "GLTF" | "OBJ" | "USDZ";
  model_3d_poster: string | null;
  camera_orbit: string;
  field_of_view: string;
  auto_rotate: boolean;
  allow_zoom: boolean;
  environment_preset: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  short_description: string | null;
  description: string | null;
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
  warranty_information: string;
  estimated_arrival_days: number;
  average_rating: string;
  review_count: number;
  images?: ProductImage[];
  specifications?: ProductSpecification[];
  variants?: ProductVariant[];
  viewer_3d?: Product3DViewerConfig;
}

// ==================== Cart ====================
export interface CartItem {
  id: number;
  product: Product;
  variant: ProductVariant | null;
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
  estimated_delivery_fee: string;
  grand_total: string;
  max_lead_time_days: number;
}

// ==================== Orders & Payments ====================
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "PACKED"
  | "HANDED_OVER"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export type PaymentStatus =
  | "PENDING"
  | "SUCCESSFUL"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentMethod =
  | "BANK_TRANSFER"
  | "KOKO"
  | "MINTPAY"
  | "CARD_ONLINE";

export interface OrderItemSnapshot {
  id: number;
  product: number;
  product_name: string;
  variant_name: string | null;
  sku: string;
  product_image: string | null;
  unit_price: string;
  quantity: number;
  total_price: string;
  warranty_snapshot: string;
}

export interface OrderStatusHistoryItem {
  id: number;
  status: OrderStatus;
  note: string;
  changed_by_name: string | null;
  created_at: string;
}

export interface PaymentRecord {
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
  bank_slip_image: string | null; // Direct GCS image or PDF link
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

export interface BankAccountInfo {
  bank_name: string;
  account_name: string;
  account_number: string;
  branch: string;
  swift_code: string;
}

export interface BankTransferConfig {
  bank_accounts: BankAccountInfo[];
  instructions: string;
}

export interface OrderDetail {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  customer_name: string;
  customer_contact: string;
  shipping_recipient_name: string;
  shipping_phone: string;
  shipping_address_line1: string;
  shipping_address_line2?: string | null;
  shipping_city: string;
  shipping_state?: string | null;
  shipping_postal_code: string;
  shipping_country: string;
  subtotal: string;
  discount_amount: string;
  delivery_charge: string;
  total_amount: string;
  coupon_code?: string | null;
  estimated_arrival_date: string | null;
  courier_name: string | null;
  tracking_number: string | null;
  delivery_notes?: string | null;
  placed_at: string;
  confirmed_at: string | null;
  delivered_at: string | null;
  items: OrderItemSnapshot[];
  status_history: OrderStatusHistoryItem[];
  payments: PaymentRecord[];
  bank_transfer_details?: BankTransferConfig | null;
}

// ==================== Notifications ====================
export interface NotificationItem {
  id: number;
  notification_type:
    | "ORDER_UPDATE"
    | "PAYMENT_RECEIVED"
    | "BANK_PAYMENT_PENDING"
    | "LOW_STOCK"
    | "PROMOTION"
    | "SYSTEM";
  title: string;
  message: string;
  data: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

// ==================== Reports Dashboard ====================
export interface DashboardSummaryKPIs {
  today_revenue: number;
  month_to_date_revenue: number;
  active_orders_count: number;
  pending_bank_verifications_count: number;
  low_stock_alerts_count: number;
}
```

---

## 5. UI/UX Page Flow & Component Blueprint

```
App Navigation Hierarchy
├── (Shop) Public
│   ├── / (Home: Hero Carousel, Featured 3D E-Bikes, Categories, Campaigns)
│   ├── /products (Search, Multi-Filter, Sorting, Product Grid)
│   ├── /products/[slug] (Image Gallery, 3D Model-Viewer, Variant Selector, Specs Table, Reviews)
│   ├── /cart (Drawer or Page: Items, Quantities, Promo Code Validator, Delivery Fee Progress Bar)
│   ├── /checkout (Addresses, Guest/Customer Flow, Payment Selection, Order Summary)
│   └── /orders/track (Public Guest Tracking & PDF Invoice Download)
│
├── (Customer Portal) Authenticated
│   ├── /account/profile (Personal Details & Avatar Upload)
│   ├── /account/addresses (Address Book CRUD with Default Toggle)
│   ├── /account/orders (Paginated Order History, Filter by Status)
│   ├── /account/orders/[id] (Detailed View, Status Timeline, Bank Slip Upload Form, PDF Invoice)
│   ├── /account/wishlist (Saved Products)
│   └── /account/notifications (Unread Badge, Notification List, Mark Read)
│
└── (Admin Control Center) Staff / Admin
    ├── /admin/dashboard (Real-time Metric Cards & Quick Links)
    ├── /admin/orders (Full Order Queue, Status Updates, Courier Tracking Number Input)
    ├── /admin/bank-verifications (Dedicated Priority Queue for Bank Slips: View Slip, Approve, Reject)
    ├── /admin/payments (All Transactions Ledger with Filters)
    ├── /admin/inventory (Stock Levels, Low-Stock Warnings, Manual Stock Adjustments)
    ├── /admin/cancellations (Cancellation & Return/Refund Request Review)
    └── /admin/reports (8 Tabbed Analytical Reports with Date Range Filters & CSV Export)
```

---

## 6. Ready-to-Copy Prompt for AI Frontend Builders

Copy and paste the prompt below into your AI coding tool (Cursor, Claude 3.5 Sonnet, v0, ChatGPT):

```text
Build a complete, responsive, modern e-commerce web application in Next.js 15 (App Router) + TypeScript + Tailwind CSS for "Arrow Ventures", Sri Lanka's leading electric bicycle and parts store.

Backend API Base URL: https://arrowapi-813344430767.asia-southeast1.run.app
The API documentation is fully detailed in FRONTEND_PROMPT_GUIDE.md and API_DOCUMENTATION.md.

Key Requirements:
1. Setup an Axios client with Bearer token authentication, automatic 401 JWT refresh (/api/auth/refresh/), and X-Guest-Token persistence for guest carts.
2. Home Page: Hero banner, promotional sales carousel (/api/promotions/campaigns/), featured e-bikes with 3D badges, and category cards.
3. Catalog Page: Full-text search, category slug filter, brand filter, price range slider, in_stock filter, has_3d_model filter, and sort by price/newest/rating.
4. Product Detail Page (PDP): High-res gallery + interactive 3D model viewer using Google's <model-viewer> for products with has_3d_model=true (rotate, zoom, FOV, poster fallback). Include variant options (color, battery capacity, frame size), specifications table, warranty badge, and customer reviews.
5. Cart & Wishlist: Support guest cart (X-Guest-Token) and customer cart with auto-merge upon login (/api/cart/merge/). Live subtotal, coupon validator (/api/promotions/coupons/validate/), and free shipping indicator (free over LKR 100,000, else LKR 2,500).
6. Checkout & Payment:
   - Support both Guest Checkout and Authenticated Checkout.
   - Payment options: Bank Transfer (BANK_TRANSFER), Koko (KOKO), and Mintpay (MINTPAY).
   - If Bank Transfer is selected, display Arrow Ventures bank details (/api/payments/bank-details/) and provide a deposit slip upload form (/api/payments/bank-transfer/submit-slip/) supporting JPG, PNG, and PDF receipts.
   - State invariant: The order remains in PENDING status until an Admin verifies the slip.
7. Customer Portal:
   - Order history and visual status timeline (PENDING -> CONFIRMED -> PROCESSING -> PACKED -> HANDED_OVER -> IN_TRANSIT -> DELIVERED).
   - Bank transfer slip re-submission if rejected.
   - One-click PDF Invoice download button (/api/orders/{id}/invoice/).
   - Saved delivery addresses CRUD.
   - Customer notifications center with unread count.
8. Admin Control Center (for role STAFF or ADMIN):
   - Executive Dashboard with KPI cards (/api/admin/reports/dashboard-summary/).
   - Bank Verification Queue (/api/admin/payments/pending-verifications/): Preview uploaded receipt image or PDF, approve (which transitions order to CONFIRMED) or reject with admin notes.
   - Order Management: Update status, assign courier name & tracking number (/api/admin/orders/{id}/update-status/).
   - Inventory Management: Stock levels, low stock warnings, stock adjustment ledger.
   - 8 Analytical Reports with custom date range filters and CSV export buttons.

Ensure all monetary values are formatted in Sri Lankan Rupees (e.g. LKR 350,000.00). Use shadcn/ui components, Lucide icons, and Tailwind CSS.
```