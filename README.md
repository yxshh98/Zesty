# 🍕 Zesty - Food & Quick Commerce Delivery Platform

[![Flutter](https://img.shields.io/badge/Flutter-3.6.0-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev)
[![NodeJS](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io)

**Zesty** is an enterprise-grade, end-to-end Food Ordering and Quick Commerce (Grocery & Daily Essentials / Zesty Mart) delivery ecosystem. Built as a full-stack monorepo, Zesty provides seamless integration across user mobile ordering, real-time backend API services, restaurant partner management, and executive admin operations.

---

## 🏗️ System Architecture & Sub-Projects

```
Zesty (Monorepo Root)
├── 📱 zesty-app/         # Cross-platform Mobile Client (Flutter / Dart)
├── ⚡ zesty-backend/     # Scalable REST API & WebSockets Engine (Node.js / Express / MongoDB)
├── 🍽️ zesty-restaurant/  # Restaurant Partner Portal (React 19 / MUI)
└── 👑 zesty-admin/       # Executive Operations Admin Dashboard (React 19 / Bootstrap)
```

---

## 🎯 Key Application Components

### 📱 1. Mobile Application (`zesty-app/`)
Cross-platform client application for Android and iOS built using **Flutter**.
- **Food & Grocery Ordering**: Explore nearby restaurants, search dishes, apply dietary filters (Veg/Non-Veg), and order groceries via **Zesty Mart**.
- **Live GPS Tracking**: Integrates Google Maps SDK with OSRM (Open Source Routing Machine) for interactive route generation, live driver animation, and accurate ETA calculations.
- **Offline Storage**: Powered by **Hive Local DB** for instant cart retention, saved delivery addresses, and user preferences.
- **Payment Gateways**: Integrated with **Razorpay**, **PhonePe Sandbox**, and Cash on Delivery (COD) threshold verification.
- **Animations & UX**: Features **Lottie** micro-animations, custom **Shimmer** loading skeletons, and interactive state dialogs.

### ⚡ 2. Backend API Engine (`zesty-backend/`)
Production-grade RESTful API server and WebSocket event orchestrator.
- **Real-Time WebSockets**: **Socket.IO** rooms (`user_join`, `partner_join`, `admin_join`) powering live order tracking states (`Placed` ➔ `Accepted` ➔ `Preparing` ➔ `Prepared` ➔ `Out for Delivery` ➔ `Delivered`).
- **Database & Storage**: MongoDB Atlas with Mongoose ORM for high-throughput queries, coupled with **Cloudinary** for image uploads and **Redis** caching.
- **Authentication & Security**: Passport.js JWT strategies, mobile OTP authentication, and bcrypt password hashing.
- **Email Notifications**: Integrated **Nodemailer** transaction service for welcome alerts, verification updates, and order invoices.

### 🍽️ 3. Restaurant Partner Portal (`zesty-restaurant/`)
React-based portal designed for restaurant owners and kitchen management.
- **Multi-Step Onboarding**: Structured sign-in process including business details, PAN/GST validation, bank account setup, menu creation, and partner contracts.
- **Live Order Management**: Real-time order pipeline with instant audio alerts and status transitions (`Accept`, `Mark Prepared`, `Assign Delivery`).
- **Menu & Price Control**: Complete CRUD operations for food categories, items, pricing, availability toggles, and item photos.
- **Promotions & Ads**: Custom in-app banner campaign management to boost restaurant visibility on customer home feeds.

### 👑 4. Executive Admin Dashboard (`zesty-admin/`)
Central command operations portal for platform administrators.
- **Live Partner Verification**: Instant WebSocket notifications when new restaurant partners register, complete with document inspection modals for 1-click approvals/rejections.
- **Zesty Mart Quick Commerce Management**: Complete catalog control for grocery products, inventory stock monitoring, and category organization.
- **Coupons & Discount Engine**: Platform-wide promo code creator supporting percentage/flat discounts, minimum purchase rules, and expiration limits.
- **Analytics & Platform Oversight**: Live orders dashboard, sales revenue reports via Chart.js, user monitoring, and outlet management.

---

## 🛠️ Technology Stack Overview

| Category | Technology Used |
| :--- | :--- |
| **Mobile App (Frontend)** | Flutter 3.x, Dart, Google Maps SDK, Provider, Hive DB, Razorpay SDK, Socket.IO Client |
| **Backend API Engine** | Node.js, Express.js, MongoDB Atlas (Mongoose), Socket.IO, Redis, Cloudinary, Passport JWT |
| **Restaurant Web App** | React 19, React Router v7, Material UI (MUI v6), Chart.js, Bootstrap 5, Axios, Toastify |
| **Admin Operations Web App** | React 19, React Router v7, Bootstrap 5, Chart.js, Socket.IO Client, FontAwesome |
| **Routing & Geolocation** | Google Maps Geocoding API, OSRM (Open Source Routing Machine) |

---

## 🔄 Real-Time Order & Tracking State Machine

```
[ Customer App ] ──(Place Order)──> [ Backend API ] ──(Socket.IO Alert)──> [ Restaurant Portal ]
                                          │                                       │
                                          │                                (Accept & Prepare)
                                          ▼                                       │
[ Delivery Tracking Map ] <──(Live GPS Broadcast)── [ Order Active ] <────────────┘
         │
         ├── Order Prepared
         ├── Driver Out for Delivery (OSRM Polyline + ETA)
         └── Order Delivered (Live Confirmation)
```

---

## ⚡ Quick Start & Setup Guide

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Flutter SDK**: v3.6.0 or higher
- **MongoDB Atlas Connection URI**
- **Google Maps API Key**

---

### 1️⃣ Setting Up the Backend API (`zesty-backend/`)
```bash
cd zesty-backend
npm install

# Configure environment variables
cp .env.example .env
```

Update your `.env` configuration file:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/zesty
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
SUPPORT_EMAIL=support@zesty.com
```

Start the API development server:
```bash
npm start
```
The server will boot on `http://localhost:5000`.

---

### 2️⃣ Setting Up the Mobile App (`zesty-app/`)
```bash
cd zesty-app

# Install dependencies
flutter pub get

# Run on Android or iOS emulator
flutter run
```

---

### 3️⃣ Setting Up the Restaurant Portal (`zesty-restaurant/`)
```bash
cd zesty-restaurant

# Install web dependencies
npm install

# Start React development server
npm start
```
The portal will open at `http://localhost:3000`.

---

### 4️⃣ Setting Up the Admin Portal (`zesty-admin/`)
```bash
cd zesty-admin

# Install admin dependencies
npm install

# Start React admin server
npm start
```
The admin portal will open at `http://localhost:3001`.

---

## 🌐 API Route Endpoints Summary

| Endpoint Group | Base Route | Key Operations |
| :--- | :--- | :--- |
| **Authentication** | `/user` | User registration, login, JWT token auth, mobile OTP verification |
| **Restaurants** | `/restaurant` | Get near restaurants, filter by veg/non-veg, partner application submit |
| **Menu Items** | `/menu` | Restaurant menu fetch, item additions, category updates |
| **Orders** | `/order` | Place order, fetch user order history, socket status update |
| **Payments** | `/payment` | Razorpay order creation, payment signature verification |
| **Zesty Mart** | `/zesty-mart` | Quick commerce grocery catalog query, stock updates |
| **Promotions** | `/coupon` | Apply coupon, validate minimum purchase threshold |
| **Admin Operations**| `/admin` | Partner verification approval/rejection, system stats |

---

## 📜 License & Copyright

Copyright © 2026 **Yash Chhabda**. All rights reserved.  
Licensed under the [ISC License](LICENSE).
