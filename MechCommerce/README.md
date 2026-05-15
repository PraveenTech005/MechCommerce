# 🏎️ MechCommerce

MechCommerce is a full-stack, premium e-commerce platform specifically designed for automotive parts, vehicles, and accessories. Built with a modern architecture, it provides a seamless and visually stunning shopping experience for end-users, alongside robust management capabilities for administrators.

## ✨ Key Features

### 📱 User Application (React Native / Expo)
The user-facing mobile application features a modern, card-based grid UI styled with NativeWind for a highly responsive and native feel.

* **Smooth Onboarding & Authentication:** Engaging onboarding flow with secure login and registration.
* **Advanced Product Discovery:** 
  * Browse by categories (Bike, Car, Engine, Accessories).
  * Home screen highlighting "Featured" items.
  * Search functionality for quick access to specific parts.
* **Intelligent Product Details:** 
  * Premium detail pages with high-quality image sliders.
  * **Vehicle Compatibility System:** Users can easily check if a product fits their specific vehicle through an intuitive brand-and-model selection interface.
* **Streamlined Checkout Experience:** 
  * Persistent shopping cart.
  * Comprehensive checkout flow with saved address management and seamless payment integration.
* **Order & Profile Management:** 
  * View detailed order history and item imagery.
  * Editable user profiles with robust input validation and location management (City, Pincode).

### 🛠️ Admin Dashboard
A comprehensive administrative toolset built with React Native to manage the store's operations and inventory efficiently.

* **Catalog Management:** Create, update, and delete products easily.
* **Media & Attributes:** Upload product images and toggle "Is Featured" status for homepage promotion.
* **Smart Compatibility Picker:** An intuitive "bubble picker" UI for rapidly assigning vehicle compatibility (Brand/Model) to new products.
* **Order Oversight:** Real-time visibility into customer orders with administrative deletion capabilities.

### ⚙️ Backend & Infrastructure
A secure and scalable backend designed to handle e-commerce operations flawlessly.

* **RESTful API:** Powered by Node.js and Express to handle all client-server communications securely.
* **Optimized Database (MongoDB):** Efficient data modeling, including a flattened and grouped storage format for vehicle compatibility, ensuring fast query performance.
* **Inventory Sync:** Automatic real-time stock reduction logic triggered upon successful order placement.

## 💻 Tech Stack

### Frontend (Mobile Apps)
* **Framework:** React Native / Expo
* **Navigation:** React Navigation
* **Styling:** NativeWind (Tailwind CSS)
* **State Management:** React Context API & Async Storage
* **Icons:** Expo Vector Icons

### Backend
* **Environment:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose
* **API Communication:** Axios

## 🚀 Getting Started

### Prerequisites
* Node.js and npm installed
* Expo CLI (`npm install -g expo-cli`)
* MongoDB instance running

### Installation

1. **Backend Setup** (in `server` directory)
   ```bash
   cd server
   npm install
   # Configure your .env file with your MongoDB URI and port
   npm start
   ```

2. **User App Setup** (in `MechCommerce` directory)
   ```bash
   cd MechCommerce
   npm install
   # Configure your .env file with your API URL
   npm start
   ```

3. **Admin App Setup** (in `MechanicCommerce-Admin` directory)
   ```bash
   cd MechanicCommerce-Admin
   npm install
   # Configure your .env file with your API URL
   npm start
   ```

## 📸 Project Overview
MechCommerce takes the friction out of buying automotive parts by ensuring users only see products compatible with their vehicles, wrapped in an aesthetic, modern interface. It handles everything from catalog browsing to final checkout, providing a complete end-to-end e-commerce solution.
