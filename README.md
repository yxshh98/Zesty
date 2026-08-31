# 🍕 Zesty - Food & Grocery Delivery Platform

Welcome to the official repository for **Zesty**, a modern food ordering and quick grocery delivery service platform (Zesty Mart).

This repository is structured as a full-stack project containing both the Flutter mobile application frontend and the Node.js backend API service.

---

## 📁 Repository Structure

```
Zesty/
├── zesty-app/         # 📱 Flutter Mobile Application (iOS, Android, Web)
├── zesty-backend/     # ⚡ Node.js, Express, MongoDB & Socket.IO API Backend
└── zesty-restaurant/  # 🍽️ React Restaurant Owner Dashboard & Portal
```

---

## 📱 Frontend Mobile App (`zesty-app/`)

Built with **Flutter** for cross-platform support across iOS, Android, and Web.

### Getting Started:
```bash
cd zesty-app
flutter pub get
flutter run
```

Refer to [zesty-app/README.md](zesty-app/README.md) for further frontend setup details.

---

## ⚡ Backend API Service (`zesty-backend/`)

Built with **Node.js**, **Express**, **MongoDB**, and **Socket.IO** for real-time order status tracking.

### Key Features:
- **Authentication**: JWT & Passport with mobile OTP support
- **Real-Time Tracking**: WebSocket connections via Socket.IO
- **Payments**: Razorpay & PhonePe Sandbox API integration
- **Storage**: Media management via Cloudinary & Multer

### Getting Started:
```bash
cd zesty-backend
npm install
cp .env.example .env
npm start
```

Refer to [zesty-backend/README.md](zesty-backend/README.md) for full API endpoint documentation and environment setup.

---

## 🍽️ Restaurant Dashboard (`zesty-restaurant/`)

Built with **React.js** for restaurant owners and partners to manage menus, orders, outlet info, and analytics.

### Getting Started:
```bash
cd zesty-restaurant
npm install
npm start
```

---

## 📜 License
This project is licensed under the ISC License.
