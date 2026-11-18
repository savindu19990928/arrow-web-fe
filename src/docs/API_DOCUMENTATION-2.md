# Arrow Ventures E-Commerce API - Comprehensive Documentation

Welcome to the official developer and integration documentation for the **Arrow Ventures E-Commerce Platform API**. This API powers the complete online sales channel for electric bicycles, e-bike components, spare parts, and accessories with interactive 3D product viewing, flexible payment options (Koko BNPL, Mintpay BNPL, and direct bank transfer with slip verification), automated inventory management, PDF invoice generation, and full analytical reporting.

---

## Table of Contents

1. [Architecture & Base Configuration](#1-architecture--base-configuration)
2. [Interactive Documentation & OpenAPI Schema](#2-interactive-documentation--openapi-schema)
3. [User Roles & Authentication](#3-user-roles--authentication)
4. [Endpoint Reference](#4-endpoint-reference)
   - [4.1 Authentication & Accounts](#41-authentication--accounts)
   - [4.2 Customer Saved Addresses](#42-customer-saved-addresses)
   - [4.3 Product Catalog & 3D Interactive Viewing](#43-product-catalog--3d-interactive-viewing)
   - [4.4 Shopping Cart & Wishlist](#44-shopping-cart--wishlist)
   - [4.5 Promotions & Coupon Codes](#45-promotions--coupon-codes)
   - [4.6 Orders, Checkout & PDF Invoices](#46-orders-checkout--pdf-invoices)
   - [4.7 Payments (Koko, Mintpay & Bank Verification)](#47-payments-koko-mintpay--bank-verification)
   - [4.8 Inventory & Stock Ledger](#48-inventory--stock-ledger)
   - [4.9 Product Reviews & Ratings](#49-product-reviews--ratings)
   - [4.10 Notifications & Alerts](#410-notifications--alerts)
   - [4.11 Reports & Business Analytics](#411-reports--business-analytics)
5. [Error Handling & Status Codes](#5-error-handling--status-codes)
6. [Deployment & Environment Setup](#6-deployment--environment-setup)

---

## 1. Architecture & Base Configuration

- **Base URL (Production):** `https://api.arrowventures.lk`
- **Content Type:** `application/json` (unless uploading files, which requires `multipart/form-data`)
- **Pagination:** Standard pagination with `count`, `next`, `previous`, and `results` keys. Default page size is `20` items (customizable via `?page=X&page_size=Y`).
- **Currency:** Sri Lankan Rupees (`LKR`) with 2 decimal places.

### Google Cloud Storage (GCP) Public URL Enforcement Policy
All media assets and user-uploaded files are hosted on Google Cloud Storage in the `arrowcs` bucket and **always served via direct, permanent, non-expiring public URLs**:
- **Bucket Root:** `https://storage.googleapis.com/arrowcs/`
- **Media Base URL:** `https://storage.googleapis.com/arrowcs/media/`
- **Static Base URL:** `https://storage.googleapis.com/arrowcs/static/`
- **Public URL Guarantees:**
  1. **No Expiring Signatures:** Query-string authentication (`querystring_auth = False`) is disabled project-wide. No temporary `?X-Goog-Algorithm=...` or `?Expires=...` tokens are generated.
  2. **Direct Browser & 3D Viewer Compatibility:** Direct URLs can be embedded inside standard `<img src="...">`, `<video src="...">`, or `<model-viewer src="...">` elements without requiring authentication headers or token renewal.
  3. **Permanent CDN-Cacheable URLs:** Images and 3D `.glb`/`.gltf` models are directly cacheable by intermediate CDNs and client browsers.
  4. **Public ACL on Uploads:** New file uploads (product images, variant photos, bank payment slips, user profiles) automatically receive `publicRead` access control (`default_acl = "publicRead"`).

---

## 3. User Roles & Authentication

| Role | Access Level | Description |
|---|---|---|
| **Guest** | Public | Browse products, search & filter, view 3D models, manage guest cart using `X-Guest-Token`, place guest orders, and track orders via order number + phone/email. |
| **Customer** | Authenticated (`Bearer <token>`) | Account profile, multiple saved addresses, order history, wishlist, review submissions, and cancellation/refund requests. |
| **Staff / Admin** | Role `ADMIN` or `STAFF` | Catalog and variant management, 3D model asset uploads, inventory adjustments, order status transitions, bank payment verification, review moderation, and business analytics reports. |

### Sending Authentication
Include the Bearer token in the `Authorization` header for protected routes:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 4. Endpoint Reference

---

### 4.1 Authentication & Accounts

#### `POST /api/auth/register/`
- **Summary:** Register a new customer account.
- **Access:** Public
- **Description:** Creates a new customer account with `CUSTOMER` role and immediately returns JWT access and refresh tokens.

**Example Request:**
```http
POST /api/auth/register/
Content-Type: application/json

{
  "email": "nimal.perera@example.com",
  "password": "StrongPassword123!",
  "password_confirm": "StrongPassword123!",
  "first_name": "Nimal",
  "last_name": "Perera",
  "phone_number": "+94771234567"
}
```

**Example Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful.",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 14,
    "email": "nimal.perera@example.com",
    "first_name": "Nimal",
    "last_name": "Perera",
    "phone_number": "+94771234567",
    "role": "CUSTOMER"
  }
}
```

---

#### `POST /api/auth/login/`
- **Summary:** Authenticate user and obtain JWT tokens.
- **Access:** Public
- **Description:** Validates credentials (email + password) and issues short-lived access token and refresh token.

**Example Request:**
```http
POST /api/auth/login/
Content-Type: application/json

{
  "email": "nimal.perera@example.com",
  "password": "StrongPassword123!"
}
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "email": "nimal.perera@example.com",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 14,
      "email": "nimal.perera@example.com",
      "first_name": "Nimal",
      "last_name": "Perera",
      "phone_number": "+94771234567",
      "role": "CUSTOMER",
      "is_staff": false,
      "is_superuser": false
    }
  }
}
```

---

#### `POST /api/auth/refresh/`
- **Summary:** Refresh expired access token.
- **Access:** Public
- **Description:** Pass a valid refresh token to receive a fresh access token without re-authenticating.

**Example Request:**
```http
POST /api/auth/refresh/
Content-Type: application/json

{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Example Response (200 OK):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### `GET /api/auth/profile/`
- **Summary:** Retrieve profile details of authenticated user.
- **Access:** Customer / Staff / Admin

**Example Request:**
```http
GET /api/auth/profile/
Authorization: Bearer <access_token>
```

**Example Response (200 OK):**
```json
{
  "id": 14,
  "email": "nimal.perera@example.com",
  "first_name": "Nimal",
  "last_name": "Perera",
  "phone_number": "+94771234567",
  "profile_photo": "https://storage.googleapis.com/arrowcs/media/profiles/avatar.jpg",
  "role": "CUSTOMER",
  "is_verified": true,
  "created_at": "2026-10-28T00:15:00+05:30"
}
```

---

#### `PATCH /api/auth/profile/`
- **Summary:** Update profile details.
- **Access:** Customer / Staff / Admin

**Example Request:**
```http
PATCH /api/auth/profile/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "first_name": "Nimal",
  "last_name": "Gunawardena",
  "phone_number": "+94779998888"
}
```

**Example Response (200 OK):**
```json
{
  "id": 14,
  "email": "nimal.perera@example.com",
  "first_name": "Nimal",
  "last_name": "Gunawardena",
  "phone_number": "+94779998888",
  "profile_photo": null,
  "role": "CUSTOMER",
  "is_verified": true,
  "created_at": "2026-10-28T00:15:00+05:30"
}
```

---

#### `POST /api/auth/change-password/`
- **Summary:** Change authenticated user's password.
- **Access:** Customer / Staff / Admin

**Example Request:**
```http
POST /api/auth/change-password/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "old_password": "StrongPassword123!",
  "new_password": "NewSecretPassword2026!",
  "new_password_confirm": "NewSecretPassword2026!"
}
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully."
}
```

---

### 4.2 Customer Saved Addresses

#### `GET /api/addresses/`
- **Summary:** List saved delivery addresses for authenticated customer.
- **Access:** Customer

**Example Request:**
```http
GET /api/addresses/
Authorization: Bearer <access_token>
```

**Example Response (200 OK):**
```json
[
  {
    "id": 3,
    "recipient_name": "Nimal Perera",
    "phone_number": "+94771234567",
    "address_line1": "No. 45, Flower Road",
    "address_line2": "Apt 3B",
    "city": "Colombo 07",
    "state_or_province": "Western Province",
    "postal_code": "00700",
    "country": "Sri Lanka",
    "is_default": true,
    "delivery_notes": "Ring doorbell on gate",
    "created_at": "2026-10-28T00:20:00+05:30",
    "updated_at": "2026-10-28T00:20:00+05:30"
  }
]
```

---

#### `POST /api/addresses/`
- **Summary:** Save a new delivery address.
- **Access:** Customer

**Example Request:**
```http
POST /api/addresses/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "recipient_name": "Nimal Perera",
  "phone_number": "+94771234567",
  "address_line1": "No. 12, Kandy Road",
  "address_line2": "",
  "city": "Kadawatha",
  "state_or_province": "Western Province",
  "postal_code": "11850",
  "country": "Sri Lanka",
  "is_default": true,
  "delivery_notes": "Deliver during office hours"
}
```

**Example Response (201 Created):**
```json
{
  "id": 4,
  "recipient_name": "Nimal Perera",
  "phone_number": "+94771234567",
  "address_line1": "No. 12, Kandy Road",
  "address_line2": "",
  "city": "Kadawatha",
  "state_or_province": "Western Province",
  "postal_code": "11850",
  "country": "Sri Lanka",
  "is_default": true,
  "delivery_notes": "Deliver during office hours",
  "created_at": "2026-10-28T00:25:00+05:30",
  "updated_at": "2026-10-28T00:25:00+05:30"
}
```

---

#### `POST /api/addresses/{id}/set-default/`
- **Summary:** Mark a saved address as the default delivery address.
- **Access:** Customer

**Example Request:**
```http
POST /api/addresses/4/set-default/
Authorization: Bearer <access_token>
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Address set as default delivery address."
}
```

---

#### `PUT /api/addresses/{id}/` & `PATCH /api/addresses/{id}/`
- **Summary:** Update an existing saved delivery address.
- **Access:** Customer (own address) / Admin

**Example Request:**
```http
PATCH /api/addresses/4/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "address_line2": "Suite 204",
  "phone_number": "+94779876543"
}
```

**Example Response (200 OK):**
```json
{
  "id": 4,
  "recipient_name": "Nimal Perera",
  "phone_number": "+94779876543",
  "address_line1": "No. 12, Kandy Road",
  "address_line2": "Suite 204",
  "city": "Kadawatha",
  "state_or_province": "Western Province",
  "postal_code": "11850",
  "country": "Sri Lanka",
  "is_default": true,
  "delivery_notes": "Deliver during office hours",
  "created_at": "2026-10-28T00:25:00+05:30",
  "updated_at": "2026-10-28T01:30:00+05:30"
}
```

---

#### `DELETE /api/addresses/{id}/`
- **Summary:** Remove a saved delivery address.
- **Access:** Customer (own address) / Admin

**Example Request:**
```http
DELETE /api/addresses/4/
Authorization: Bearer <access_token>
```

**Example Response (204 No Content)**

---

### 4.3 Product Catalog & 3D Interactive Viewing

#### `GET /api/catalog/categories/`
- **Summary:** List active product categories (hierarchical tree).
- **Access:** Public

**Example Request:**
```http
GET /api/catalog/categories/
```

**Example Response (200 OK):**
```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Electric Bicycles",
      "slug": "electric-bicycles",
      "description": "Premium commuter, mountain, and fat-tire electric bikes.",
      "image": "https://storage.googleapis.com/arrowcs/media/categories/ebikes.jpg",
      "parent": null,
      "parent_name": null,
      "display_order": 1,
      "is_active": true,
      "product_count": 8
    },
    {
      "id": 2,
      "name": "Spare Parts & Batteries",
      "slug": "spare-parts-batteries",
      "description": "Motors, lithium battery packs, controllers, and displays.",
      "image": "https://storage.googleapis.com/arrowcs/media/categories/parts.jpg",
      "parent": null,
      "parent_name": null,
      "display_order": 2,
      "is_active": true,
      "product_count": 15
    }
  ]
}
```

---

#### `GET /api/catalog/brands/`
- **Summary:** List active brands/manufacturers.
- **Access:** Public

**Example Request:**
```http
GET /api/catalog/brands/
```

**Example Response (200 OK):**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Arrow Pro",
      "slug": "arrow-pro",
      "logo": "https://storage.googleapis.com/arrowcs/media/brands/arrow_logo.png",
      "description": "High-performance electric bicycles and components",
      "website": "https://arrowventures.lk",
      "is_active": true,
      "product_count": 8
    }
  ]
}
```

---

#### `GET /api/catalog/products/`
- **Summary:** Filter, search, and browse active products.
- **Access:** Public
- **Query Parameters:**
  - `category`: Filter by category slug (e.g. `electric-bicycles`)
  - `brand`: Filter by brand slug (e.g. `arrow-pro`)
  - `min_price`: Minimum price (e.g. `200000`)
  - `max_price`: Maximum price (e.g. `400000`)
  - `in_stock`: Boolean `true` / `false`
  - `has_3d_model`: Boolean `true` / `false`
  - `is_featured`: Boolean `true` / `false`
  - `search`: Search query across product name, description, SKU, and brand
  - `ordering`: Sort by `price`, `-price`, `created_at`, `-created_at`, `average_rating`, `-average_rating`

**Example Request:**
```http
GET /api/catalog/products/?category=electric-bicycles&has_3d_model=true&min_price=300000
```

**Example Response (200 OK):**
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Arrow E-Trail 750W",
      "slug": "arrow-e-trail-750w",
      "sku": "ARW-ET-750W",
      "short_description": "750W Bafang hub motor, 48V 17.5Ah battery with 80km range.",
      "price": "350000.00",
      "compare_at_price": "380000.00",
      "discount_percentage": 7.9,
      "stock_quantity": 10,
      "in_stock": true,
      "category": {
        "id": 1,
        "name": "Electric Bicycles",
        "slug": "electric-bicycles",
        "description": "Premium e-bikes",
        "image": null,
        "parent": null,
        "parent_name": null,
        "display_order": 1,
        "is_active": true,
        "product_count": 8
      },
      "brand": {
        "id": 1,
        "name": "Arrow Pro",
        "slug": "arrow-pro",
        "logo": null,
        "description": "High-performance electric bicycles",
        "website": "https://arrowventures.lk",
        "is_active": true,
        "product_count": 8
      },
      "primary_image": "https://storage.googleapis.com/arrowcs/media/products/etrail_front.webp",
      "has_3d_model": true,
      "is_featured": true,
      "average_rating": "4.85",
      "review_count": 12
    }
  ]
}
```

---

#### `GET /api/catalog/products/{slug}/`
- **Summary:** Retrieve full product details including variants, specifications, images, and 3D configuration.
- **Access:** Public

**Example Request:**
```http
GET /api/catalog/products/arrow-e-trail-750w/
```

**Example Response (200 OK):**
```json
{
  "id": 1,
  "name": "Arrow E-Trail 750W",
  "slug": "arrow-e-trail-750w",
  "sku": "ARW-ET-750W",
  "short_description": "750W Bafang hub motor, 48V 17.5Ah battery with 80km range.",
  "price": "350000.00",
  "compare_at_price": "380000.00",
  "discount_percentage": 7.9,
  "stock_quantity": 10,
  "in_stock": true,
  "category": { "id": 1, "name": "Electric Bicycles", "slug": "electric-bicycles" },
  "brand": { "id": 1, "name": "Arrow Pro", "slug": "arrow-pro" },
  "primary_image": "https://storage.googleapis.com/arrowcs/media/products/etrail_front.webp",
  "has_3d_model": true,
  "is_featured": true,
  "average_rating": "4.85",
  "review_count": 12,
  "description": "The Arrow E-Trail 750W is designed for Sri Lankan terrains...",
  "warranty_information": "2 Years Motor & Battery, 1 Year Frame",
  "estimated_arrival_days": 3,
  "images": [
    {
      "id": 101,
      "image": "https://storage.googleapis.com/arrowcs/media/products/etrail_front.webp",
      "alt_text": "Arrow E-Trail 750W Front Angle",
      "is_primary": true,
      "display_order": 0
    },
    {
      "id": 102,
      "image": "https://storage.googleapis.com/arrowcs/media/products/etrail_side.webp",
      "alt_text": "Arrow E-Trail 750W Side View",
      "is_primary": false,
      "display_order": 1
    }
  ],
  "specifications": [
    { "id": 1, "group": "Performance", "key": "Top Speed", "value": "45 km/h", "display_order": 0 },
    { "id": 2, "group": "Electrical", "key": "Motor Power", "value": "750W Bafang Hub Motor", "display_order": 1 },
    { "id": 3, "group": "Electrical", "key": "Battery", "value": "48V 17.5Ah Samsung Li-ion", "display_order": 2 },
    { "id": 4, "group": "Performance", "key": "Range per Charge", "value": "60 - 80 km (Pedal Assist)", "display_order": 3 },
    { "id": 5, "group": "Mechanical", "key": "Brakes", "value": "Tektro Hydraulic Disc Brakes", "display_order": 4 },
    { "id": 6, "group": "Mechanical", "key": "Wheel Size", "value": "27.5 x 2.4 inch Kenda Tires", "display_order": 5 }
  ],
  "variants": [
    {
      "id": 1,
      "sku": "ARW-ET-750W-BLK",
      "name": "Stealth Black / 48V 17.5Ah",
      "color": "Stealth Black",
      "size": "Medium / 18 inch",
      "model_variant": "Standard",
      "battery_capacity": "17.5Ah",
      "wheel_size": "27.5 inch",
      "configuration": "Front Suspension Fork",
      "price_override": "360000.00",
      "final_price": "360000.00",
      "stock_quantity": 5,
      "in_stock": true,
      "image": null,
      "is_active": true
    }
  ],
  "viewer_3d": {
    "id": 1,
    "name": "Arrow E-Trail 750W",
    "has_3d_model": true,
    "model_3d_file": "https://storage.googleapis.com/arrowcs/media/models_3d/arrow_etrail_750w.glb",
    "model_3d_format": "GLB",
    "model_3d_poster": "https://storage.googleapis.com/arrowcs/media/models_3d/posters/poster.webp",
    "camera_orbit": "0deg 75deg 105%",
    "field_of_view": "30deg",
    "auto_rotate": true,
    "allow_zoom": true,
    "environment_preset": "neutral"
  }
}
```

---

#### `GET /api/catalog/products/{slug}/3d-model/`
- **Summary:** Get dedicated 3D viewer configuration and assets for supported products.
- **Access:** Public
- **Description:** Returns direct binary model URLs (`.glb`, `.gltf`, `.obj`) and camera orbit, FOV, and interaction flags designed for immediate use with Google `<model-viewer>` or Three.js.

**Example Request:**
```http
GET /api/catalog/products/arrow-e-trail-750w/3d-model/
```

**Example Response (200 OK):**
```json
{
  "id": 1,
  "name": "Arrow E-Trail 750W",
  "has_3d_model": true,
  "model_3d_file": "https://storage.googleapis.com/arrowcs/media/models_3d/arrow_etrail_750w.glb",
  "model_3d_format": "GLB",
  "model_3d_poster": "https://storage.googleapis.com/arrowcs/media/models_3d/posters/poster.webp",
  "camera_orbit": "0deg 75deg 105%",
  "field_of_view": "30deg",
  "auto_rotate": true,
  "allow_zoom": true,
  "environment_preset": "neutral"
}
```

---

### 4.4 Shopping Cart & Wishlist

#### `GET /api/cart/`
- **Summary:** Retrieve active shopping cart with computed subtotals, delivery fee, and lead times.
- **Access:** Public / Customer
- **Headers:** `X-Guest-Token: <token>` (Required for unauthenticated guest shoppers)

**Example Request:**
```http
GET /api/cart/
X-Guest-Token: 9e32f4c9c1b34ad2a849f78310023a10
```

**Example Response (200 OK):**
```json
{
  "id": 2,
  "guest_token": "9e32f4c9c1b34ad2a849f78310023a10",
  "items": [
    {
      "id": 5,
      "product_id": 1,
      "product_name": "Arrow E-Trail 750W",
      "product_slug": "arrow-e-trail-750w",
      "product_sku": "ARW-ET-750W",
      "product_image": "https://storage.googleapis.com/arrowcs/media/products/etrail_front.webp",
      "variant_id": 1,
      "variant_name": "Stealth Black / 48V 17.5Ah",
      "variant_sku": "ARW-ET-750W-BLK",
      "quantity": 1,
      "unit_price": "360000.00",
      "line_total": "360000.00"
    }
  ],
  "total_items_count": 1,
  "subtotal": "360000.00",
  "estimated_delivery_fee": "0.00",
  "grand_total": "360000.00",
  "max_lead_time_days": 3,
  "updated_at": "2026-10-28T00:30:00+05:30"
}
```

---

#### `POST /api/cart/`
- **Summary:** Add product or variant to cart.
- **Access:** Public / Customer
- **Description:** Verifies real-time stock availability. If product is already in cart, increments quantity.

**Example Request:**
```http
POST /api/cart/
X-Guest-Token: 9e32f4c9c1b34ad2a849f78310023a10
Content-Type: application/json

{
  "product_id": 1,
  "variant_id": 1,
  "quantity": 1
}
```

**Example Response (200 OK):**
```json
{
  "id": 2,
  "guest_token": "9e32f4c9c1b34ad2a849f78310023a10",
  "items": [
    {
      "id": 5,
      "product_id": 1,
      "product_name": "Arrow E-Trail 750W",
      "product_slug": "arrow-e-trail-750w",
      "product_sku": "ARW-ET-750W",
      "product_image": "https://storage.googleapis.com/arrowcs/media/products/etrail_front.webp",
      "variant_id": 1,
      "variant_name": "Stealth Black / 48V 17.5Ah",
      "variant_sku": "ARW-ET-750W-BLK",
      "quantity": 2,
      "unit_price": "360000.00",
      "line_total": "720000.00"
    }
  ],
  "total_items_count": 2,
  "subtotal": "720000.00",
  "estimated_delivery_fee": "0.00",
  "grand_total": "720000.00",
  "max_lead_time_days": 3,
  "updated_at": "2026-10-28T00:35:00+05:30"
}
```

---

#### `PATCH /api/cart/items/{id}/`
- **Summary:** Update quantity of a specific cart item.
- **Access:** Public / Customer

**Example Request:**
```http
PATCH /api/cart/items/5/
X-Guest-Token: 9e32f4c9c1b34ad2a849f78310023a10
Content-Type: application/json

{
  "quantity": 1
}
```

**Example Response (200 OK):**
```json
{
  "id": 2,
  "items": [
    {
      "id": 5,
      "product_id": 1,
      "quantity": 1,
      "unit_price": "360000.00",
      "line_total": "360000.00"
    }
  ],
  "total_items_count": 1,
  "subtotal": "360000.00",
  "grand_total": "360000.00"
}
```

---

#### `DELETE /api/cart/items/{id}/`
- **Summary:** Remove a single item from the active cart.
- **Access:** Public / Customer

**Example Request:**
```http
DELETE /api/cart/items/5/
X-Guest-Token: 9e32f4c9c1b34ad2a849f78310023a10
```

**Example Response (200 OK):**
```json
{
  "id": 2,
  "items": [],
  "total_items_count": 0,
  "subtotal": "0.00",
  "grand_total": "0.00"
}
```

---

#### `DELETE /api/cart/`
- **Summary:** Clear all items from the active cart.
- **Access:** Public (Guest) / Customer

**Example Request:**
```http
DELETE /api/cart/
X-Guest-Token: 9e32f4c9c1b34ad2a849f78310023a10
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Cart cleared."
}
```

---

#### `POST /api/cart/merge/`
- **Summary:** Merge anonymous guest cart into user account upon customer login.
- **Access:** Customer

**Example Request:**
```http
POST /api/cart/merge/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "guest_token": "9e32f4c9c1b34ad2a849f78310023a10"
}
```

**Example Response (200 OK):**
```json
{
  "id": 3,
  "guest_token": null,
  "items": [
    {
      "id": 12,
      "product_name": "Arrow E-Trail 750W",
      "quantity": 1,
      "unit_price": "360000.00",
      "line_total": "360000.00"
    }
  ],
  "total_items_count": 1,
  "subtotal": "360000.00",
  "grand_total": "360000.00"
}
```

---

#### `GET /api/wishlist/`
- **Summary:** Retrieve saved products in customer wishlist.
- **Access:** Customer

**Example Request:**
```http
GET /api/wishlist/
Authorization: Bearer <access_token>
```

**Example Response (200 OK):**
```json
[
  {
    "id": 1,
    "product": {
      "id": 1,
      "name": "Arrow E-Trail 750W",
      "slug": "arrow-e-trail-750w",
      "sku": "ARW-ET-750W",
      "price": "350000.00",
      "in_stock": true,
      "primary_image": "https://storage.googleapis.com/arrowcs/media/products/etrail_front.webp"
    },
    "created_at": "2026-10-28T00:40:00+05:30"
  }
]
```

---

#### `POST /api/wishlist/`
- **Summary:** Toggle product in wishlist (adds if absent, removes if present).
- **Access:** Customer

**Example Request:**
```http
POST /api/wishlist/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "product_id": 1
}
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "added": true,
  "message": "Product added to wishlist."
}
```

---

### 4.5 Promotions & Coupon Codes

#### `POST /api/promotions/coupons/validate/`
- **Summary:** Validate promo code against current cart subtotal and calculate discount.
- **Access:** Public / Customer

**Example Request:**
```http
POST /api/promotions/coupons/validate/
Content-Type: application/json

{
  "code": "ARROW10",
  "subtotal": 360000.00
}
```

**Example Response (200 OK):**
```json
{
  "valid": true,
  "code": "ARROW10",
  "discount_type": "PERCENTAGE",
  "discount_value": 10.0,
  "discount_amount": 36000.0,
  "discounted_subtotal": 324000.0,
  "message": "Coupon code successfully applied."
}
```

---

#### `GET /api/promotions/campaigns/`
- **Summary:** List active marketing banners and promotional sales campaigns.
- **Access:** Public

**Example Request:**
```http
GET /api/promotions/campaigns/
```

**Example Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Avurudu Electric Ride Promo",
    "slug": "avurudu-promo-2026",
    "description": "Get up to 10% off on all Arrow E-Trail series with free helmet.",
    "banner": "https://storage.googleapis.com/arrowcs/media/promotions/avurudu_banner.jpg",
    "discount_percentage": "10.00",
    "start_date": "2026-04-01T00:00:00+05:30",
    "end_date": "2026-04-30T23:59:59+05:30",
    "is_active": true,
    "is_live": true
  }
]
```

---

### 4.6 Orders, Checkout & PDF Invoices

#### `POST /api/orders/checkout/`
- **Summary:** Place an order from active cart items.
- **Access:** Public (Guest) / Customer
- **Description:** Atomically verifies and reserves stock, snapshots product pricing and warranty details, applies discount code, creates initial `PENDING` payment transaction, and clears cart items.

**Example Request (Registered Customer):**
```http
POST /api/orders/checkout/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "shipping_recipient_name": "Nimal Perera",
  "shipping_phone": "+94771234567",
  "shipping_address_line1": "No. 45, Flower Road",
  "shipping_address_line2": "Apt 3B",
  "shipping_city": "Colombo 07",
  "shipping_state": "Western Province",
  "shipping_postal_code": "00700",
  "shipping_country": "Sri Lanka",
  "payment_method": "BANK_TRANSFER",
  "coupon_code": "ARROW10",
  "delivery_notes": "Handle with care, call before delivery"
}
```

**Example Request (Guest Checkout):**
```http
POST /api/orders/checkout/
X-Guest-Token: 9e32f4c9c1b34ad2a849f78310023a10
Content-Type: application/json

{
  "guest_name": "Kamal Silva",
  "guest_email": "kamal@example.com",
  "guest_phone": "+94719876543",
  "guest_token": "9e32f4c9c1b34ad2a849f78310023a10",
  "shipping_recipient_name": "Kamal Silva",
  "shipping_phone": "+94719876543",
  "shipping_address_line1": "No. 15, Station Road",
  "shipping_city": "Panadura",
  "shipping_postal_code": "12500",
  "shipping_country": "Sri Lanka",
  "payment_method": "KOKO"
}
```

**Example Response (201 Created):**
```json
{
  "id": 1,
  "order_number": "ARW-20261028-9F3A1B",
  "status": "PENDING",
  "payment_status": "PENDING",
  "payment_method": "BANK_TRANSFER",
  "customer_name": "Nimal Perera",
  "customer_contact": "nimal.perera@example.com",
  "shipping_recipient_name": "Nimal Perera",
  "shipping_phone": "+94771234567",
  "shipping_address_line1": "No. 45, Flower Road",
  "shipping_address_line2": "Apt 3B",
  "shipping_city": "Colombo 07",
  "shipping_state": "Western Province",
  "shipping_postal_code": "00700",
  "shipping_country": "Sri Lanka",
  "subtotal": "360000.00",
  "discount_amount": "36000.00",
  "delivery_charge": "0.00",
  "total_amount": "324000.00",
  "coupon_code": "ARROW10",
  "estimated_arrival_date": "2026-10-31",
  "courier_name": null,
  "tracking_number": null,
  "delivery_notes": "Handle with care, call before delivery",
  "placed_at": "2026-10-28T00:45:00+05:30",
  "confirmed_at": null,
  "delivered_at": null,
  "items": [
    {
      "id": 1,
      "product": 1,
      "product_name": "Arrow E-Trail 750W",
      "variant_name": "Stealth Black / 48V 17.5Ah",
      "sku": "ARW-ET-750W-BLK",
      "unit_price": "360000.00",
      "quantity": 1,
      "total_price": "360000.00",
      "warranty_snapshot": "2 Years Motor & Battery, 1 Year Frame"
    }
  ],
  "status_history": [
    {
      "id": 1,
      "status": "PENDING",
      "note": "Order placed via Bank Transfer. Awaiting bank transfer and receipt submission.",
      "changed_by_name": "nimal.perera@example.com",
      "created_at": "2026-10-28T00:45:00+05:30"
    }
  ],
  "payments": [
    {
      "id": 1,
      "payment_method": "BANK_TRANSFER",
      "amount": "324000.00",
      "currency": "LKR",
      "status": "PENDING",
      "transaction_id": null,
      "reference_number": "ARW-20261028-9F3A1B",
      "bank_slip_image": null,
      "bank_name": null,
      "deposit_date": null,
      "customer_bank_reference": null,
      "bank_transfer_submitted_at": null,
      "is_bank_transfer_submitted": false,
      "is_verified": false,
      "verified_by_email": null,
      "verified_at": null,
      "admin_notes": null,
      "created_at": "2026-10-28T00:45:00+05:30",
      "updated_at": "2026-10-28T00:45:00+05:30"
    }
  ],
  "bank_transfer_details": {
    "bank_accounts": [
      {
        "bank_name": "Commercial Bank of Ceylon",
        "account_name": "Arrow Ventures (Pvt) Ltd",
        "account_number": "100089234567",
        "branch": "Colombo Fort",
        "swift_code": "CCEYLKX"
      }
    ],
    "instructions": "1. Please transfer the exact order total to any of the bank accounts above..."
  }
}
```

---

#### `GET /api/orders/`
- **Summary:** List order history for authenticated customer.
- **Access:** Customer

**Example Request:**
```http
GET /api/orders/
Authorization: Bearer <access_token>
```

**Example Response (200 OK):**
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "order_number": "ARW-20261028-9F3A1B",
      "status": "CONFIRMED",
      "payment_status": "SUCCESSFUL",
      "payment_method": "BANK_TRANSFER",
      "total_amount": "324000.00",
      "placed_at": "2026-10-28T00:45:00+05:30",
      "estimated_arrival_date": "2026-10-31",
      "items_count": 1,
      "customer_name": "Nimal Perera"
    }
  ]
}
```

---

#### `GET /api/orders/{id}/`
- **Summary:** Retrieve complete order details, itemized lines, and full status timeline.
- **Access:** Customer (own order) / Staff / Admin

**Example Request:**
```http
GET /api/orders/1/
Authorization: Bearer <access_token>
```

**Example Response (200 OK):**
```json
{
  "id": 1,
  "order_number": "ARW-20261028-9F3A1B",
  "status": "CONFIRMED",
  "payment_status": "SUCCESSFUL",
  "payment_method": "BANK_TRANSFER",
  "customer_name": "Nimal Perera",
  "customer_contact": "nimal.perera@example.com",
  "subtotal": "360000.00",
  "discount_amount": "36000.00",
  "delivery_charge": "0.00",
  "total_amount": "324000.00",
  "estimated_arrival_date": "2026-10-31",
  "items": [
    {
      "id": 1,
      "product_name": "Arrow E-Trail 750W",
      "variant_name": "Stealth Black / 48V 17.5Ah",
      "unit_price": "360000.00",
      "quantity": 1,
      "total_price": "360000.00",
      "warranty_snapshot": "2 Years Motor & Battery, 1 Year Frame"
    }
  ]
}
```

---

#### `GET /api/orders/{id}/invoice/`
- **Summary:** Download branded official PDF invoice and receipt.
- **Access:** Public (with contact query param) or Authenticated
- **Query Parameters:**
  - `contact`: For guest access, pass email or phone number.
- **Response:** PDF binary stream (`Content-Type: application/pdf`).

**Example Request:**
```http
GET /api/orders/1/invoice/
Authorization: Bearer <access_token>
```

**Response Headers (200 OK):**
```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="Invoice_ARW-20261028-9F3A1B.pdf"
```

---

#### `GET /api/orders/track/`
- **Summary:** Public guest order tracking.
- **Access:** Public
- **Query Parameters:**
  - `order_number`: Order number (e.g. `ARW-20261028-9F3A1B`)
  - `contact`: Email address or phone number submitted during checkout

**Example Request:**
```http
GET /api/orders/track/?order_number=ARW-20261028-9F3A1B&contact=nimal.perera@example.com
```

**Example Response (200 OK):**
```json
{
  "id": 1,
  "order_number": "ARW-20261028-9F3A1B",
  "status": "PROCESSING",
  "payment_status": "SUCCESSFUL",
  "payment_method": "BANK_TRANSFER",
  "courier_name": "Certis Lanka Courier",
  "tracking_number": "CL-987214",
  "estimated_arrival_date": "2026-10-31",
  "total_amount": "324000.00"
}
```

---

#### `POST /api/orders/{id}/cancel/`
- **Summary:** Customer cancellation request before order is packed.
- **Access:** Customer

**Example Request:**
```http
POST /api/orders/1/cancel/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "reason": "Accidentally selected the wrong variant. Need to re-order in Blue."
}
```

**Example Response (201 Created):**
```json
{
  "id": 1,
  "reason": "Accidentally selected the wrong variant. Need to re-order in Blue.",
  "status": "REQUESTED",
  "admin_note": null,
  "created_at": "2026-10-28T01:00:00+05:30",
  "reviewed_at": null
}
```

---

#### `POST /api/orders/{id}/return-refund/`
- **Summary:** Customer return and refund request.
- **Access:** Customer

**Example Request:**
```http
POST /api/orders/1/return-refund/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "type": "RETURN_AND_REFUND",
  "refund_amount": 324000.00,
  "reason": "Battery connector pins damaged on arrival.",
  "bank_details_for_refund": "Commercial Bank, A/C: 8001234567, Name: Nimal Perera"
}
```

**Example Response (201 Created):**
```json
{
  "id": 1,
  "order": 1,
  "type": "RETURN_AND_REFUND",
  "refund_amount": "324000.00",
  "reason": "Battery connector pins damaged on arrival.",
  "bank_details_for_refund": "Commercial Bank, A/C: 8001234567, Name: Nimal Perera",
  "status": "REQUESTED",
  "admin_note": null,
  "created_at": "2026-10-28T01:10:00+05:30",
  "resolved_at": null
}
```

---

#### `POST /api/admin/orders/{id}/update-status/`
- **Summary:** Admin transitions order status and assigns courier tracking.
- **Access:** Staff / Admin

**Example Request:**
```http
POST /api/admin/orders/1/update-status/
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "IN_TRANSIT",
  "courier_name": "Domex Courier Services",
  "tracking_number": "DX-7721908",
  "note": "Package dispatched from Colombo central depot."
}
```

**Example Response (200 OK):**
```json
{
  "id": 1,
  "order_number": "ARW-20261028-9F3A1B",
  "status": "IN_TRANSIT",
  "courier_name": "Domex Courier Services",
  "tracking_number": "DX-7721908",
  "total_amount": "324000.00"
}
```

---

### 4.7 Payments (Koko, Mintpay & Bank Verification)

#### `GET /api/payments/bank-details/`
- **Summary:** Get official Arrow Ventures bank account details for direct transfer.
- **Access:** Public

**Example Request:**
```http
GET /api/payments/bank-details/
```

**Example Response (200 OK):**
```json
{
  "bank_accounts": [
    {
      "bank_name": "Commercial Bank of Ceylon",
      "account_name": "Arrow Ventures (Pvt) Ltd",
      "account_number": "100089234567",
      "branch": "Colombo Fort",
      "swift_code": "CCEYLKX"
    },
    {
      "bank_name": "Hatton National Bank (HNB)",
      "account_name": "Arrow Ventures (Pvt) Ltd",
      "account_number": "003010456789",
      "branch": "Kollupitiya",
      "swift_code": "HBLILKLX"
    }
  ],
  "instructions": "1. Transfer the exact order total to any of the bank accounts above.\n2. Mention your Order Number as transaction reference.\n3. Submit slip via '/api/payments/bank-transfer/submit-slip/'."
}
```

---

#### `POST /api/payments/initiate/`
- **Summary:** Initialize payment checkout for an order with chosen payment provider.
- **Access:** Public / Customer
- **Methods Supported:** `KOKO`, `MINTPAY`, `BANK_TRANSFER`

**Example Request (Koko BNPL):**
```http
POST /api/payments/initiate/
Content-Type: application/json

{
  "order_number": "ARW-20261028-9F3A1B",
  "payment_method": "KOKO"
}
```

**Example Response (Koko):**
```json
{
  "provider": "Koko",
  "payment_id": 8,
  "order_number": "ARW-20261028-9F3A1B",
  "amount": 324000.0,
  "currency": "LKR",
  "session_id": "KOKO-SES-8F39A01B2E4D",
  "checkout_url": "https://gateway.kokopay.lk/checkout?session=KOKO-SES-8F39A01B2E4D&order=ARW-20261028-9F3A1B",
  "message": "Redirect customer to checkout_url to complete Koko BNPL payment."
}
```

**Example Request (Mintpay 3-Installments):**
```http
POST /api/payments/initiate/
Content-Type: application/json

{
  "order_number": "ARW-20261028-9F3A1B",
  "payment_method": "MINTPAY"
}
```

**Example Response (Mintpay):**
```json
{
  "provider": "Mintpay",
  "payment_id": 9,
  "order_number": "ARW-20261028-9F3A1B",
  "amount": 324000.0,
  "installments": 3,
  "installment_amount": 108000.0,
  "token": "MINTPAY-TOK-9921AA043F",
  "checkout_url": "https://checkout.mintpay.lk/pay?token=MINTPAY-TOK-9921AA043F&order_id=ARW-20261028-9F3A1B",
  "message": "Redirect customer to checkout_url for Mintpay 3-installment payment."
}
```

---

#### `POST /api/payments/bank-transfer/submit-slip/`
- **Summary:** Customer uploads bank transfer deposit receipt (`.jpg`, `.png`, or `.pdf`, max 5 MB) and transfer reference.
- **Access:** Public / Customer (authenticated users can only submit for their own orders; guests may optionally pass `contact` matching the order)
- **Content-Type:** `multipart/form-data`
- **Behavior:** Keeps `Payment` and `Order` in `PENDING`, sets `bank_transfer_submitted_at`, records an `OrderStatusHistory` entry, and triggers a `BANK_PAYMENT_PENDING` admin notification.

**Form Data Fields:**
- `order_number`: `ARW-20261028-9F3A1B`
- `customer_bank_reference`: `TXN-8871239`
- `deposit_date`: `2026-10-28`
- `bank_name`: `Commercial Bank` (optional)
- `contact`: Guest email or phone (optional)
- `bank_slip_image`: File binary (`.jpg`, `.jpeg`, `.png`, or `.pdf`)

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Bank deposit slip submitted successfully. It will be verified by our team shortly.",
  "payment_id": 1,
  "status": "PENDING",
  "order_number": "ARW-20261028-9F3A1B",
  "order_status": "PENDING",
  "payment_status": "PENDING",
  "customer_bank_reference": "TXN-8871239",
  "bank_transfer_submitted_at": "2026-10-28T01:05:00+05:30",
  "bank_slip_image": "https://storage.googleapis.com/arrowcs/media/bank_slips/a1b2c3d4.pdf"
}
```

---

#### `POST /api/payments/koko/callback/`
- **Summary:** Webhook callback from Koko BNPL gateway.
- **Access:** Public (Webhook)

**Example Request:**
```http
POST /api/payments/koko/callback/
Content-Type: application/json

{
  "order_number": "ARW-20261028-9F3A1B",
  "transaction_id": "KOKO-TXN-77889900",
  "status": "SUCCESS"
}
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "payment_status": "SUCCESSFUL"
}
```

---

#### `POST /api/payments/mintpay/callback/`
- **Summary:** Webhook callback from Mintpay BNPL (3-installments) gateway.
- **Access:** Public (Webhook)

**Example Request:**
```http
POST /api/payments/mintpay/callback/
Content-Type: application/json

{
  "order_number": "ARW-20261028-9F3A1B",
  "transaction_id": "MINTPAY-TXN-44556677",
  "status": "COMPLETED"
}
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "payment_status": "SUCCESSFUL"
}
```

---

#### `GET /api/admin/payments/`
- **Summary:** List all customer payment records with comprehensive filtering, search, and sorting.
- **Access:** Staff / Admin
- **Query Parameters:**
  - `payment_method`: Filter by provider (`BANK_TRANSFER`, `KOKO`, `MINTPAY`, `CARD_ONLINE`)
  - `status`: Filter by state (`PENDING`, `SUCCESSFUL`, `FAILED`, `CANCELLED`, `REFUNDED`)
  - `submitted`: Filter bank transfers by receipt submission state (`true` = receipt uploaded, `false` = awaiting receipt)
  - `search`: Search query matching order number (`ARW-...`), customer bank reference, or transaction ID
  - `ordering`: Sort by `created_at`, `-created_at`, `amount`, `-amount`, `bank_transfer_submitted_at`, `-bank_transfer_submitted_at`

**Example Request:**
```http
GET /api/admin/payments/?payment_method=BANK_TRANSFER&status=PENDING&submitted=true
Authorization: Bearer <admin_token>
```

**Example Response (200 OK):**
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "order": 1,
      "order_number": "ARW-20261028-9F3A1B",
      "order_status": "PENDING",
      "payment_method": "BANK_TRANSFER",
      "amount": "324000.00",
      "currency": "LKR",
      "status": "PENDING",
      "transaction_id": null,
      "reference_number": "ARW-20261028-9F3A1B",
      "bank_slip_image": "https://storage.googleapis.com/arrowcs/media/bank_slips/a1b2c3d4.pdf",
      "bank_name": "Commercial Bank",
      "deposit_date": "2026-10-28",
      "customer_bank_reference": "TXN-8871239",
      "bank_transfer_submitted_at": "2026-10-28T01:05:00+05:30",
      "is_bank_transfer_submitted": true,
      "is_verified": false,
      "verified_by_email": null,
      "verified_at": null,
      "admin_notes": null,
      "created_at": "2026-10-28T00:45:00+05:30",
      "updated_at": "2026-10-28T01:05:00+05:30"
    }
  ]
}
```

---

#### `GET /api/admin/payments/{id}/`
- **Summary:** Retrieve full detail of a specific payment transaction.
- **Access:** Staff / Admin

**Example Request:**
```http
GET /api/admin/payments/1/
Authorization: Bearer <admin_token>
```

**Example Response (200 OK):**
```json
{
  "id": 1,
  "order": 1,
  "order_number": "ARW-20261028-9F3A1B",
  "order_status": "PENDING",
  "payment_method": "BANK_TRANSFER",
  "amount": "324000.00",
  "currency": "LKR",
  "status": "PENDING",
  "transaction_id": null,
  "reference_number": "ARW-20261028-9F3A1B",
  "bank_slip_image": "https://storage.googleapis.com/arrowcs/media/bank_slips/a1b2c3d4.pdf",
  "bank_name": "Commercial Bank",
  "deposit_date": "2026-10-28",
  "customer_bank_reference": "TXN-8871239",
  "bank_transfer_submitted_at": "2026-10-28T01:05:00+05:30",
  "is_bank_transfer_submitted": true,
  "is_verified": false,
  "verified_by_email": null,
  "verified_at": null,
  "admin_notes": null,
  "created_at": "2026-10-28T00:45:00+05:30",
  "updated_at": "2026-10-28T01:05:00+05:30"
}
```

---

#### `GET /api/admin/payments/pending-verifications/`
- **Summary:** Dedicated priority queue of pending bank transfer payments where the customer has submitted a deposit receipt, ordered oldest first.
- **Access:** Staff / Admin

**Example Request:**
```http
GET /api/admin/payments/pending-verifications/
Authorization: Bearer <admin_token>
```

**Example Response (200 OK):**
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "order": 1,
      "order_number": "ARW-20261028-9F3A1B",
      "order_status": "PENDING",
      "payment_method": "BANK_TRANSFER",
      "amount": "324000.00",
      "currency": "LKR",
      "status": "PENDING",
      "transaction_id": null,
      "reference_number": "ARW-20261028-9F3A1B",
      "bank_slip_image": "https://storage.googleapis.com/arrowcs/media/bank_slips/a1b2c3d4.pdf",
      "bank_name": "Commercial Bank",
      "deposit_date": "2026-10-28",
      "customer_bank_reference": "TXN-8871239",
      "bank_transfer_submitted_at": "2026-10-28T01:05:00+05:30",
      "is_bank_transfer_submitted": true,
      "is_verified": false,
      "verified_by_email": null,
      "verified_at": null,
      "admin_notes": null,
      "created_at": "2026-10-28T00:45:00+05:30",
      "updated_at": "2026-10-28T01:05:00+05:30"
    }
  ]
}
```

---

#### `GET /api/admin/payments/bank-details/`
- **Summary:** Inspect current official company bank accounts and customer payment instructions stored in system settings.
- **Access:** Staff / Admin

**Example Request:**
```http
GET /api/admin/payments/bank-details/
Authorization: Bearer <admin_token>
```

**Example Response (200 OK):**
```json
{
  "bank_accounts": [
    {
      "bank_name": "Commercial Bank of Ceylon",
      "account_name": "Arrow Ventures (Pvt) Ltd",
      "account_number": "100089234567",
      "branch": "Colombo Fort",
      "swift_code": "CCEYLKX"
    },
    {
      "bank_name": "Hatton National Bank (HNB)",
      "account_name": "Arrow Ventures (Pvt) Ltd",
      "account_number": "003010456789",
      "branch": "Kollupitiya",
      "swift_code": "HBLILKLX"
    }
  ],
  "instructions": "1. Please transfer the exact order total to any of the bank accounts above.\n2. Mention your Order Number (e.g. ARW-YYYYMMDD-XXXX) as the transaction narration / reference.\n3. Take a screenshot, photo, or PDF receipt of the deposit slip / transaction confirmation.\n4. Submit the slip via '/api/payments/bank-transfer/submit-slip/' so an admin can verify and confirm your order."
}
```

---

#### `PUT /api/admin/payments/bank-details/`
- **Summary:** Update store bank accounts and transfer instructions.
- **Access:** Admin only (`IsAdminUserRole`)

**Example Request:**
```http
PUT /api/admin/payments/bank-details/
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "bank_accounts": [
    {
      "bank_name": "Commercial Bank of Ceylon",
      "account_name": "Arrow Ventures (Pvt) Ltd",
      "account_number": "100089234567",
      "branch": "Colombo Fort",
      "swift_code": "CCEYLKX"
    },
    {
      "bank_name": "Sampath Bank",
      "account_name": "Arrow Ventures (Pvt) Ltd",
      "account_number": "001234567890",
      "branch": "Colombo 03",
      "swift_code": "BSAMLKLX"
    }
  ],
  "instructions": "Transfer exact amount to the accounts above with your Order Number as reference."
}
```

**Example Response (200 OK):**
```json
{
  "bank_accounts": [
    {
      "bank_name": "Commercial Bank of Ceylon",
      "account_name": "Arrow Ventures (Pvt) Ltd",
      "account_number": "100089234567",
      "branch": "Colombo Fort",
      "swift_code": "CCEYLKX"
    },
    {
      "bank_name": "Sampath Bank",
      "account_name": "Arrow Ventures (Pvt) Ltd",
      "account_number": "001234567890",
      "branch": "Colombo 03",
      "swift_code": "BSAMLKLX"
    }
  ],
  "instructions": "Transfer exact amount to the accounts above with your Order Number as reference."
}
```

---

#### `POST /api/admin/payments/{id}/verify/`
- **Summary:** Administrator or staff approves (`APPROVE`) or rejects (`REJECT`) a direct bank transfer submission.
- **Access:** Staff / Admin (`IsStaffOrAdmin`)
- **Description:**
  - **`action: "APPROVE"`**: Validates that a receipt was submitted (or `confirm_without_slip: true`), sets `Payment.status = SUCCESSFUL`, records `verified_by` and `verified_at`, sets `Order.payment_status = SUCCESSFUL`, automatically transitions `Order.status` from `PENDING` to `CONFIRMED`, records `OrderStatusHistory` and `AuditLog`, and sends the customer `PAYMENT_RECEIVED` and `ORDER_UPDATE` notifications.
  - **`action: "REJECT"`**: Sets `Payment.status = FAILED` and `Order.payment_status = FAILED` while preserving `Order.status = PENDING` so the customer can upload a corrected receipt. Sends `PAYMENT_RECEIVED` notification with rejection note.

**Example Request (Approve):**
```http
POST /api/admin/payments/1/verify/
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "action": "APPROVE",
  "transaction_id": "BANK-STMT-9901",
  "admin_notes": "Matched with Commercial Bank electronic statement narration #TXN-8871239."
}
```

**Example Response (200 OK - Approved):**
```json
{
  "id": 1,
  "order": 1,
  "order_number": "ARW-20261028-9F3A1B",
  "order_status": "CONFIRMED",
  "payment_method": "BANK_TRANSFER",
  "amount": "324000.00",
  "currency": "LKR",
  "status": "SUCCESSFUL",
  "transaction_id": "BANK-STMT-9901",
  "reference_number": "ARW-20261028-9F3A1B",
  "bank_slip_image": "https://storage.googleapis.com/arrowcs/media/bank_slips/a1b2c3d4.pdf",
  "bank_name": "Commercial Bank",
  "deposit_date": "2026-10-28",
  "customer_bank_reference": "TXN-8871239",
  "bank_transfer_submitted_at": "2026-10-28T01:05:00+05:30",
  "is_bank_transfer_submitted": true,
  "is_verified": true,
  "verified_by_email": "admin@arrowventures.lk",
  "verified_at": "2026-10-28T01:15:00+05:30",
  "admin_notes": "Matched with Commercial Bank electronic statement narration #TXN-8871239.",
  "created_at": "2026-10-28T00:45:00+05:30",
  "updated_at": "2026-10-28T01:15:00+05:30"
}
```

**Example Request (Reject):**
```http
POST /api/admin/payments/1/verify/
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "action": "REJECT",
  "admin_notes": "Bank transfer slip image is blurry and reference narration does not match statement. Please re-upload a clear receipt."
}
```

**Example Response (200 OK - Rejected):**
```json
{
  "id": 1,
  "order": 1,
  "order_number": "ARW-20261028-9F3A1B",
  "order_status": "PENDING",
  "payment_method": "BANK_TRANSFER",
  "amount": "324000.00",
  "currency": "LKR",
  "status": "FAILED",
  "transaction_id": null,
  "reference_number": "ARW-20261028-9F3A1B",
  "bank_slip_image": "https://storage.googleapis.com/arrowcs/media/bank_slips/a1b2c3d4.pdf",
  "bank_name": "Commercial Bank",
  "deposit_date": "2026-10-28",
  "customer_bank_reference": "TXN-8871239",
  "bank_transfer_submitted_at": "2026-10-28T01:05:00+05:30",
  "is_bank_transfer_submitted": true,
  "is_verified": false,
  "verified_by_email": "admin@arrowventures.lk",
  "verified_at": "2026-10-28T01:15:00+05:30",
  "admin_notes": "Bank transfer slip image is blurry and reference narration does not match statement. Please re-upload a clear receipt.",
  "created_at": "2026-10-28T00:45:00+05:30",
  "updated_at": "2026-10-28T01:15:00+05:30"
}
```

---

### 4.8 Inventory & Stock Ledger

#### `GET /api/admin/inventory/stock-levels/`
- **Summary:** Current inventory levels across products and variants.
- **Access:** Staff / Admin
- **Query Parameters:** `?low_stock=true` (filters stock <= threshold) or `?out_of_stock=true`

**Example Request:**
```http
GET /api/admin/inventory/stock-levels/?low_stock=true
Authorization: Bearer <admin_token>
```

**Example Response (200 OK):**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "sku": "ARW-ET-750W",
      "name": "Arrow E-Trail 750W",
      "category_name": "Electric Bicycles",
      "stock_quantity": 4,
      "low_stock_threshold": 5,
      "is_low_stock": true,
      "is_out_of_stock": false
    }
  ]
}
```

---

#### `POST /api/admin/inventory/adjust/`
- **Summary:** Manually adjust stock for a product or variant with audit ledger tracking.
- **Access:** Staff / Admin

**Example Request:**
```http
POST /api/admin/inventory/adjust/
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "product_id": 1,
  "variant_id": 1,
  "quantity": 10,
  "movement_type": "RESTOCK",
  "reason": "Container shipment inward batch #ARW-2026-BATCH04"
}
```

**Example Response (200 OK):**
```json
{
  "id": 22,
  "product": 1,
  "product_name": "Arrow E-Trail 750W",
  "product_sku": "ARW-ET-750W",
  "variant_name": "Stealth Black / 48V 17.5Ah",
  "movement_type": "RESTOCK",
  "quantity": 10,
  "before_stock": 4,
  "after_stock": 14,
  "reason": "Container shipment inward batch #ARW-2026-BATCH04",
  "created_by_email": "admin@arrowventures.lk",
  "created_at": "2026-10-28T01:20:00+05:30"
}
```

---

### 4.9 Product Reviews & Ratings

#### `GET /api/reviews/`
- **Summary:** List approved customer reviews for a product.
- **Access:** Public
- **Query Parameters:** `?product_slug=arrow-e-trail-750w` or `?product_id=1`

**Example Request:**
```http
GET /api/reviews/?product_slug=arrow-e-trail-750w
```

**Example Response (200 OK):**
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "product": 1,
      "user_name": "Nimal Perera",
      "rating": 5,
      "title": "Exceptional hill climbing performance!",
      "review_text": "Rode this e-bike in Kandy hills. Motor handles steep climbs effortlessly with pedal assist level 3.",
      "verified_purchase": true,
      "created_at": "2026-10-28T01:22:00+05:30"
    }
  ]
}
```

---

#### `POST /api/reviews/submit/`
- **Summary:** Authenticated customer submits review & 1-5 rating.
- **Access:** Customer
- **Description:** Automatically checks order history to determine `verified_purchase` status.

**Example Request:**
```http
POST /api/reviews/submit/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "product": 1,
  "rating": 5,
  "title": "Incredible battery life",
  "review_text": "Easily achieved 75km on a single charge around Colombo."
}
```

**Example Response (201 Created):**
```json
{
  "id": 2,
  "product": 1,
  "user_name": "Nimal Perera",
  "rating": 5,
  "title": "Incredible battery life",
  "review_text": "Easily achieved 75km on a single charge around Colombo.",
  "verified_purchase": true,
  "created_at": "2026-10-28T01:25:00+05:30"
}
```

---

### 4.10 Notifications & Alerts

#### `GET /api/notifications/`
- **Summary:** List customer notifications and unread count.
- **Access:** Customer

**Example Request:**
```http
GET /api/notifications/
Authorization: Bearer <access_token>
```

**Example Response (200 OK):**
```json
{
  "unread_count": 1,
  "notifications": [
    {
      "id": 1,
      "notification_type": "PAYMENT_RECEIVED",
      "title": "Payment Verified",
      "message": "Your bank transfer of LKR 324,000.00 for order ARW-20261028-9F3A1B has been verified and approved.",
      "data": { "order_number": "ARW-20261028-9F3A1B" },
      "is_read": false,
      "created_at": "2026-10-28T01:15:00+05:30"
    }
  ]
}
```

---

#### `POST /api/notifications/{id}/mark-read/`
- **Summary:** Mark a specific notification as read.
- **Access:** Customer

**Example Request:**
```http
POST /api/notifications/1/mark-read/
Authorization: Bearer <access_token>
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Marked as read."
}
```

---

#### `POST /api/notifications/mark-all-read/`
- **Summary:** Mark all unread notifications for the authenticated customer as read.
- **Access:** Customer

**Example Request:**
```http
POST /api/notifications/mark-all-read/
Authorization: Bearer <access_token>
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "All notifications marked as read."
}
```

---

#### `GET /api/admin/notifications/`
- **Summary:** Administrative alerts and operational notification feed (pending bank transfer verification alerts, low stock warnings, cancellations).
- **Access:** Staff / Admin
- **Description:** Returns store-wide alerts (`recipient=null`) and alerts directed to the current staff user, ordered newest first.

**Example Request:**
```http
GET /api/admin/notifications/
Authorization: Bearer <admin_token>
```

**Example Response (200 OK):**
```json
[
  {
    "id": 18,
    "notification_type": "BANK_PAYMENT_PENDING",
    "title": "Bank Transfer Pending Verification: ARW-20261028-9F3A1B",
    "message": "Customer submitted bank transfer receipt for order ARW-20261028-9F3A1B (LKR 324,000.00, Ref: TXN-8871239).",
    "data": {
      "order_id": 1,
      "order_number": "ARW-20261028-9F3A1B",
      "payment_id": 1,
      "customer_bank_reference": "TXN-8871239",
      "bank_name": "Commercial Bank",
      "deposit_date": "2026-10-28",
      "amount": "324000.00"
    },
    "is_read": false,
    "created_at": "2026-10-28T01:05:00+05:30"
  },
  {
    "id": 17,
    "notification_type": "LOW_STOCK",
    "title": "Low Stock Warning: Arrow E-Trail 750W",
    "message": "Stock for 'Arrow E-Trail 750W' has reached 4 units (Threshold: 5).",
    "data": { "product_id": 1, "stock_quantity": 4, "threshold": 5 },
    "is_read": false,
    "created_at": "2026-10-28T00:50:00+05:30"
  }
]
```

---

### 4.11 Reports & Business Analytics

All reporting endpoints require `ADMIN` or `STAFF` credentials and accept `?start_date=YYYY-MM-DD`, `?end_date=YYYY-MM-DD`, and `?export=csv`.

---

#### `GET /api/admin/reports/dashboard-summary/`
- **Summary:** Executive store KPI overview for the administrator dashboard.
- **Access:** Staff / Admin

**Example Request:**
```http
GET /api/admin/reports/dashboard-summary/
Authorization: Bearer <admin_token>
```

**Example Response (200 OK):**
```json
{
  "today_revenue": 324000.0,
  "month_to_date_revenue": 2850000.0,
  "active_orders_count": 8,
  "pending_bank_verifications_count": 2,
  "low_stock_alerts_count": 3
}
```

---

#### `GET /api/admin/reports/product-sales/`
- **Summary:** Product Sales Report: units sold, gross revenue, category breakdown.
- **Access:** Staff / Admin

**Example Request:**
```http
GET /api/admin/reports/product-sales/?start_date=2026-10-01&end_date=2026-10-28
Authorization: Bearer <admin_token>
```

**Example Response (200 OK):**
```json
{
  "report": "Product Sales Report",
  "start_date": "2026-10-01",
  "end_date": "2026-10-28",
  "summary": {
    "total_units_sold": 18,
    "total_sales_revenue": 5840000.0,
    "top_selling_product": "Arrow E-Trail 750W"
  },
  "sales_by_product": [
    {
      "product_id": 1,
      "product_name": "Arrow E-Trail 750W",
      "sku": "ARW-ET-750W",
      "units_sold": 14,
      "revenue": "5040000.00"
    }
  ],
  "sales_by_category": [
    {
      "product__category__name": "Electric Bicycles",
      "units_sold": 14,
      "revenue": "5040000.00"
    }
  ]
}
```

---

#### `GET /api/admin/reports/orders/`
- **Summary:** Order Report: order volume, average order value (AOV), and status distribution.
- **Access:** Staff / Admin

**Example Request:**
```http
GET /api/admin/reports/orders/?start_date=2026-10-01&end_date=2026-10-28
Authorization: Bearer <admin_token>
```

**Example Response (200 OK):**
```json
{
  "report": "Order Report",
  "start_date": "2026-10-01",
  "end_date": "2026-10-28",
  "summary": {
    "total_orders": 24,
    "total_revenue": 6250000.0,
    "average_order_value": 260416.67
  },
  "orders_by_status": [
    { "status": "DELIVERED", "count": 16 },
    { "status": "IN_TRANSIT", "count": 4 },
    { "status": "PROCESSING", "count": 2 },
    { "status": "PENDING", "count": 2 }
  ]
}
```

---

#### `GET /api/admin/reports/payments/`
- **Summary:** Payment Report: breakdown by payment provider (Koko, Mintpay, Bank Transfer) and verification status.
- **Access:** Staff / Admin

**Example Request:**
```http
GET /api/admin/reports/payments/?start_date=2026-10-01&end_date=2026-10-28
Authorization: Bearer <admin_token>
```

**Example Response (200 OK):**
```json
{
  "report": "Payment Report",
  "start_date": "2026-10-01",
  "end_date": "2026-10-28",
  "summary": {
    "total_transactions": 25,
    "total_successful_volume": 5850000.0,
    "total_pending_volume": 400000.0
  },
  "payments_by_method": [
    { "payment_method": "BANK_TRANSFER", "count": 14, "total_amount": "3950000.00" },
    { "payment_method": "KOKO", "count": 7, "total_amount": "1450000.00" },
    { "payment_method": "MINTPAY", "count": 4, "total_amount": "850000.00" }
  ],
  "payments_by_status": [
    { "status": "SUCCESSFUL", "count": 22, "total_amount": "5850000.00" },
    { "status": "PENDING", "count": 2, "total_amount": "400000.00" },
    { "status": "FAILED", "count": 1, "total_amount": "0.00" }
  ]
}
```

---

#### `GET /api/admin/reports/income/`
- **Summary:** Income / Revenue Report: gross sales, discounts given, delivery fees, and net store revenue.
- **Access:** Staff / Admin

**Example Request:**
```http
GET /api/admin/reports/income/?start_date=2026-10-01&end_date=2026-10-28
Authorization: Bearer <admin_token>
```

**Example Response (200 OK):**
```json
{
  "report": "Income / Revenue Report",
  "start_date": "2026-10-01",
  "end_date": "2026-10-28",
  "summary": {
    "gross_subtotal": 6500000.0,
    "total_discounts_granted": 350000.0,
    "total_delivery_charges": 25000.0,
    "net_revenue": 6175000.0
  }
}
```

---

#### `GET /api/admin/reports/inventory/`
- **Summary:** Inventory / Stock Report: total units on hand, total asset valuation, and low/out-of-stock listings.
- **Access:** Staff / Admin

**Example Request:**
```http
GET /api/admin/reports/inventory/
Authorization: Bearer <admin_token>
```

**Example Response (200 OK):**
```json
{
  "report": "Inventory / Stock Report",
  "summary": {
    "total_active_products": 23,
    "total_units_on_hand": 95,
    "inventory_valuation": 24850000.0,
    "low_stock_count": 2,
    "out_of_stock_count": 1
  },
  "low_stock_items": [
    {
      "id": 1,
      "name": "Arrow E-Trail 750W",
      "sku": "ARW-ET-750W",
      "stock_quantity": 4,
      "low_stock_threshold": 5
    }
  ],
  "out_of_stock_items": [
    {
      "id": 8,
      "name": "48V 2A Fast Charger",
      "sku": "ARW-CHG-48V2A"
    }
  ]
}
```

---

#### `GET /api/admin/reports/customer-purchases/`
- **Summary:** Customer Purchase Report: unique buyers and top spending customer accounts.
- **Access:** Staff / Admin

**Example Request:**
```http
GET /api/admin/reports/customer-purchases/?start_date=2026-10-01&end_date=2026-10-28
Authorization: Bearer <admin_token>
```

**Example Response (200 OK):**
```json
{
  "report": "Customer Purchase Report",
  "start_date": "2026-10-01",
  "end_date": "2026-10-28",
  "summary": {
    "unique_purchasing_customers": 18
  },
  "top_customers": [
    {
      "user__id": 14,
      "user__email": "nimal.perera@example.com",
      "user__first_name": "Nimal",
      "user__last_name": "Perera",
      "order_count": 3,
      "total_spent": "710000.00"
    }
  ]
}
```

---

#### `GET /api/admin/reports/discounts-promotions/`
- **Summary:** Discount & Promotion Report: coupon redemption counts, discount savings, and breakdown per code.
- **Access:** Staff / Admin

**Example Request:**
```http
GET /api/admin/reports/discounts-promotions/?start_date=2026-10-01&end_date=2026-10-28
Authorization: Bearer <admin_token>
```

**Example Response (200 OK):**
```json
{
  "report": "Discount & Promotion Report",
  "start_date": "2026-10-01",
  "end_date": "2026-10-28",
  "summary": {
    "total_coupons_redeemed": 10,
    "total_discount_amount": 360000.0
  },
  "coupons_breakdown": [
    {
      "coupon_code": "ARROW10",
      "times_used": 10,
      "total_discount_given": "360000.00"
    }
  ]
}
```

---

#### `GET /api/admin/reports/cancellations-refunds/`
- **Summary:** Cancellation, Return & Refund Report: total requests, completed refund amount, and status breakdown.
- **Access:** Staff / Admin

**Example Request:**
```http
GET /api/admin/reports/cancellations-refunds/?start_date=2026-10-01&end_date=2026-10-28
Authorization: Bearer <admin_token>
```

**Example Response (200 OK):**
```json
{
  "report": "Cancellation, Return & Refund Report",
  "start_date": "2026-10-01",
  "end_date": "2026-10-28",
  "summary": {
    "total_cancellation_requests": 2,
    "total_return_refund_requests": 1,
    "total_completed_refund_amount": 324000.0
  },
  "cancellations_by_status": [
    { "status": "APPROVED", "count": 2 }
  ],
  "returns_by_status": [
    { "status": "COMPLETED", "count": 1 }
  ]
}
```

---

## 5. Error Handling & Status Codes

All errors return a predictable JSON payload:

```json
{
  "success": false,
  "code": "validation_error",
  "detail": "Insufficient stock for 'Arrow E-Trail 750W'. Available: 2, Requested: 5",
  "errors": {
    "quantity": ["Insufficient stock for 'Arrow E-Trail 750W'. Available: 2, Requested: 5"]
  }
}
```

| HTTP Code | Meaning | Typical Scenario |
|---|---|---|
| `200 OK` | Success | Successful retrieval, update, or cancellation. |
| `201 Created` | Created | Order placed, review created, address saved. |
| `400 Bad Request` | Validation Error | Insufficient stock, expired coupon, password mismatch. |
| `401 Unauthorized` | Not Authenticated | Missing or expired JWT access token. |
| `403 Forbidden` | Permission Denied | Customer attempting to access administrative endpoints. |
| `404 Not Found` | Not Found | Product slug, order number, or address ID does not exist. |

---

## 6. Deployment & Environment Setup

### Environment Variables
Configure the following environment variables in `.env` or GCP Cloud Run:

```bash
# General
DJANGO_SECRET_KEY="your-production-secret-key"
K_SERVICE="arrowapi" # Set automatically on Google Cloud Run

# Managed MySQL Database
DB_NAME="arrowdev"
DB_USER="ssw1naruto"
DB_PASSWORD="Devrious_45"
DB_HOST="140.245.232.213"
DB_PORT="3306"

# Google Cloud Storage (Bucket arrowcs)
GS_BUCKET_NAME="arrowcs"
```

### Running Tests
Execute the end-to-end integration test suite:
```bash
python manage.py test tests
```
Output:
```text
Ran 5 tests in 10.326s - OK
```

---

*Arrow Ventures E-Commerce API Documentation - Maintained for DEVRIOUS & Arrow Ventures.*
