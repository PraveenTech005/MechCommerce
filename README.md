# 🏎️ MechCommerce

MechCommerce is a full-stack, premium e-commerce platform specifically designed for automotive parts, vehicles, and accessories. Built with a modern architecture, it provides a seamless and visually stunning shopping experience for end-users, alongside robust management capabilities for administrators.

This repository contains the complete ecosystem including the user application, the administrative dashboard, and the backend server.

## 📂 Project Structure

* **`MechCommerce/`** - The customer-facing mobile application.
* **`MechanicCommerce-Admin/`** - The administrative dashboard mobile application.
* **`server/`** - The Node.js and Express backend powering both applications.

## ✨ Key Features

### 📱 User Application (React Native / Expo)
The user-facing mobile application features a modern, card-based grid UI styled with NativeWind.
* **Advanced Product Discovery:** Browse by categories (Bike, Car, Engine, Accessories) or search directly.
* **Vehicle Compatibility System:** Users can easily check if a product fits their specific vehicle through an intuitive brand-and-model selection interface.
* **Streamlined Checkout:** Persistent shopping cart, saved addresses, and seamless payment flow.
* **Order & Profile Management:** View detailed order history and edit user profiles.

### 🛠️ Admin Dashboard (React Native / Expo)
A comprehensive administrative toolset to manage operations on the go.
* **Catalog Management:** Create, update, and delete products with image upload support.
* **Smart Compatibility Picker:** An intuitive "bubble picker" UI for rapidly assigning vehicle compatibility (Brand/Model) to new products.
* **Featured Promotions:** Toggle "Is Featured" status to instantly promote products.
* **Order Oversight:** Real-time visibility into customer orders with administrative management capabilities.

### ⚙️ Backend & Infrastructure (Node.js / Express / MongoDB)
A secure and scalable backend designed to handle e-commerce operations.
* **RESTful API:** Secure endpoints handling user authentication, product catalog, and order processing.
* **Optimized Database:** Efficient data modeling with flattened storage for vehicle compatibility.
* **Inventory Sync:** Real-time stock reduction logic triggered upon order placement.

## 💻 Tech Stack

* **Frontend (Mobile Apps):** React Native, Expo, React Navigation, NativeWind (Tailwind CSS)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **State & Data Fetching:** React Context API, Axios

## 🚀 Getting Started

### Prerequisites
* Node.js and npm installed
* Expo CLI (`npm install -g expo-cli`)
* MongoDB instance running

### 1. Backend Setup
```bash
cd server
npm install
# Configure your .env file with your MongoDB URI and port
npm start
```

### 2. User App Setup
```bash
cd MechCommerce
npm install
# Configure your .env file with the API URL
npm start
```

### 3. Admin App Setup
```bash
cd MechanicCommerce-Admin
npm install
# Configure your .env file with the API URL
npm start
```
