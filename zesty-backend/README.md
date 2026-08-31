# 🍕 Zesty - Food & Grocery Delivery Platform Backend API

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.21-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-black.svg)](https://socket.io/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

A robust, scalable, real-time backend API service for **Zesty**, a modern food ordering and grocery delivery platform (Zesty Mart). Built with Node.js, Express, MongoDB, and Socket.IO.

---

## 🌟 Key Features

- **🔐 User & Admin Authentication**:
  - Secure signup/signin using Passport Local Strategy & JWT.
  - Role-based authorization for Users, Restaurant Owners, and Platform Administrators.
  - Mobile OTP verification via Message Central API integration.

- **🍕 Restaurant & Menu Management**:
  - Full CRUD operations for restaurant profiles, menus, categories, and item listings.
  - Image upload management integrated with **Cloudinary** and **Multer**.

- **🛒 Zesty Mart (Grocery Delivery)**:
  - Inventory and category management for quick grocery ordering.

- **⚡ Real-Time Order Management**:
  - WebSocket connection via **Socket.IO** for live order state updates between customers, delivery riders, and restaurants.

- **💳 Payment Gateway Integration**:
  - Dual payment processing support with **Razorpay** and **PhonePe API**.

- **📢 Ads & Promotion Engine**:
  - Promotional banners, coupons, and discount system.

- **📧 Automated Notifications & Support**:
  - Email notification engine built with **Nodemailer** for customer support queries and status alerts.

---

## 🛠️ Tech Stack & Dependencies

- **Core Runtime**: Node.js, Express.js
- **Database & ORM**: MongoDB, Mongoose, Connect-Mongo
- **Real-Time Communication**: Socket.IO
- **Security & Authentication**: BcryptJS, JSON Web Token (JWT), Passport.js, Express-Session
- **Media Storage**: Cloudinary, Multer, Sharp
- **Payments**: Razorpay, PhonePe Sandbox API
- **Utilities**: Axios, Nodemailer, Dotenv, UUID

---

## 📁 Project Structure

```
zesty-backend/
├── images/             # Local upload assets
├── middleware/         # Custom authentication & security middleware
├── models/             # Mongoose schemas (Users, Restaurant, Menu, Order, ZestyMart, etc.)
├── routes/             # Express API route modules
│   ├── adminRoutes.js
│   ├── adRoutes.js
│   ├── CategoryRoutes.js
│   ├── couponRoutes.js
│   ├── MenuRoute.js
│   ├── orderRoutes.js
│   ├── otpRoutes.js
│   ├── paymentRoutes.js
│   ├── restaurantRoute.js
│   ├── riderRoute.js
│   ├── userRoutes.js
│   └── zestyMartRoutes.js
├── server.js           # Main Express server entry point & Socket.IO initialization
├── socket.js           # WebSocket connection handlers
├── vercel.json         # Deployment configuration for Vercel
├── .env.example        # Environment variable template
├── package.json        # Dependencies and scripts
└── README.md           # Documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or MongoDB Atlas instance)

### 2. Installation

Clone the repository and install the dependencies:

```bash
# Clone the repository
git clone https://github.com/yxshh98/Zesty.git

# Navigate to the project directory
cd Zesty

# Install dependencies
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory using `.env.example` as reference:

```bash
cp .env.example .env
```

Configure your credentials inside `.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

### 4. Running the Application

```bash
# Run in development mode with Nodemon
npm start
```

The server will start running at `http://localhost:5000`.

---

## 🔌 API Endpoints Summary

| Module | Route Endpoint | Description |
| :--- | :--- | :--- |
| **Auth** | `/user/signup` / `/user/signin` | User registration & authentication |
| **Admin** | `/admin/signin` | Administrator portal authentication |
| **Restaurant** | `/restaurant` | Restaurant profile & listing operations |
| **Menu** | `/menu` | Food item creation & inventory management |
| **Zesty Mart** | `/zestyMart` | Quick grocery store products & categories |
| **Orders** | `/order` | Place, track, and manage customer orders |
| **Payments** | `/payment/create-order` | Process payments via Razorpay / PhonePe |
| **OTP** | `/otp/validate-otp` | Validate phone numbers via Message Central OTP |

---

## 📄 License

This project is licensed under the ISC License.
