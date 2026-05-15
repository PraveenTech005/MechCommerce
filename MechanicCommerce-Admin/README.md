# 🛠️ MechCommerce - Admin Dashboard

The Admin Dashboard is a powerful, mobile-first administrative toolset for the MechCommerce platform. Built with React Native, it empowers store owners and managers to completely control their product catalog and oversee incoming user orders on the go.

## ✨ Key Features

### 📦 Catalog Management
* **CRUD Operations:** Seamlessly add, edit, or delete automotive parts, accessories, and vehicles from the database.
* **Media Management:** Direct support for uploading and managing high-quality product imagery.
* **Featured Promotions:** Easily toggle "Is Featured" status to instantly promote products to the user-facing home screen.

### 🚗 Vehicle Compatibility Intelligence
* **Smart Compatibility Picker:** Features a highly intuitive "bubble picker" UI allowing admins to rapidly assign multiple vehicle brands and models that are compatible with a specific part.
* **Dynamic Data Sync:** Uses an optimized database schema ensuring the user application can easily filter and search for parts based on their specific car or bike.

### 📊 Order Oversight
* **Order Tracking:** View all customer orders flowing in from the MechCommerce user application in real-time.
* **Detailed Views:** Inspect individual order items, shipping details, and payment statuses.
* **Order Management:** Includes capabilities such as administrative order deletion and stock synchronization with the main database.

## 💻 Tech Stack

* **Framework:** React Native / Expo
* **Navigation:** React Navigation
* **Styling:** NativeWind (Tailwind CSS)
* **State Management:** React Context API
* **API Communication:** Axios
* **Icons:** Expo Vector Icons

## 🚀 Getting Started

### Prerequisites
* Node.js and npm installed
* Expo CLI (`npm install -g expo-cli`)
* The MechCommerce Backend Server must be running locally or deployed.

### Installation & Setup

1. **Install Dependencies**
   Navigate to the admin directory and install packages:
   ```bash
   cd MechanicCommerce-Admin
   npm install
   ```

2. **Environment Configuration**
   Ensure your API configuration points to your running instance of the MechCommerce backend server.

3. **Start the Development Server**
   ```bash
   npm start
   ```

## 🔗 Related Projects
* **MechCommerce User App** - The customer-facing shopping application.
* **MechCommerce Backend** - The Node.js/MongoDB server powering the platform.
