# DEVRIOUS | Arrow Ventures E-Commerce Website - SRS

## 1. Project Overview

The proposed solution comprises a comprehensive e-commerce platform for Arrow Ventures, focused on the sale of electric bicycles, electric bicycle parts, spare parts, accessories, and related products. The platform will provide customers with product discovery, detailed product information, interactive 3D product viewing for supported items, online purchasing, multiple payment options, order tracking, and account management.

## 2. Objectives

The primary objective is to provide Arrow Ventures with a complete online sales channel that simplifies product discovery and purchasing, supports modern payment options, reduces manual administrative work, and provides customers with a clear and engaging shopping experience.

## 3. Technology Stack

The website will be developed using the following technologies:

- **Frontend:** ReactJS

## 4. User Roles

| Role | Permissions / Responsibilities |
|---|---|
| **Customer** | Browse products, use search and filters, view product details and 3D models, manage cart and wishlist, place orders, make payments, track orders, and submit reviews. |
| **Guest** | Browse the store, search and filter products, view product details and 3D models, and add products to the cart. Account creation is required for account-based features. |
| **Admin** | Manage products, categories, variants, inventory, 3D models, orders, customers, payments, bank-payment verification, promotions, discounts, reviews, delivery information, and reports. |

## 5. Functional Requirements

- Product and category management
- Product search, filtering, and sorting
- Product detail pages with images, specifications, variants, reviews, and related products
- Interactive 3D product viewing for selected products only, with rotate and zoom controls so customers can inspect supported products from different angles
- Standard product images and image galleries remain available for products that do not have a 3D model
- Shopping cart and wishlist management
- Customer registration, login, profile, and address management
- Checkout and order placement
- Multiple payment options including Koko, Mintpay, and direct bank payment
- Order history, order status tracking, cancellation, returns, and refunds
- Inventory and stock management
- Discounts, coupon codes, and promotional campaigns
- Product reviews and ratings
- Invoice and receipt access
- Customer and administrator notifications
- Administrative dashboard and store management
- Order, payment, customer, inventory, and sales reporting

### 5.1 3D Product Viewing for Selected Products

- The admin can enable 3D viewing for individual products by assigning a 3D model to the product.
- Customers can open the 3D viewer on product pages only when a model is available.
- The viewer provides rotate and zoom controls so customers can inspect a supported product from different angles and at different magnifications.
- Products without an assigned 3D model continue to display their regular product images and image gallery; 3D viewing is not required for every product.
- Product information and normal purchasing actions remain available whether or not a product has a 3D model.

## 6. Product & Shopping Information

The system captures the following information for products and customer purchases:

- Product name, category, brand, SKU, description, price, discount, availability, images, and warranty information
- Product variants such as color, size, model, battery capacity, wheel size, and configuration where applicable
- Electric bicycle specifications and other relevant product specifications
- Whether a product has a 3D model enabled; only selected products need to offer interactive 3D viewing
- Cart items, quantities, selected variants, prices, discounts, delivery charges, and order totals
- Order number, order date, order status, payment method, payment status, and delivery information

## 7. Customer Information

The system captures the following details for each customer:

- Name
- Email
- Contact Number
- Profile Information
- Saved Delivery Addresses
- Order History
- Booked/Purchased Products
- Payment History
- Cancellation, Return & Refund History
- Reviews & Ratings

## 8. Payment Module

- Customers can select Koko during checkout where available.
- Customers can select Mintpay during checkout where available.
- Direct bank payment is supported, with bank details and payment-reference information presented to the customer.
- Bank-payment submissions can remain pending until verified by an authorized administrator.
- Payment status is recorded against each order, with successful, failed, cancelled, refunded, and pending states supported.
- Payment results are used to update the related order status and customer confirmation.

## 9. Reports

The system generates reports based on a custom date/time range selected by the admin:

- Product Sales Reports
- Order Reports
- Payment Reports
- Income Reports
- Inventory / Stock Reports
- Customer Purchase Reports
- Discount & Promotion Reports
- Cancellation, Return & Refund Reports
