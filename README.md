# GameGear Store

## Project Overview

GameGear Store is a full-stack Gaming Accessories E-Commerce platform developed as a backend and frontend web application project.

The platform allows users to browse and purchase gaming accessories such as:
- Gaming Keyboards
- Gaming Mice
- Headsets
- Controllers
- Monitors
- Gaming Chairs
- Streaming Equipment
- Mouse Pads
- Microphones
- Webcams

The project is designed using a scalable backend architecture with REST APIs and a modern frontend application connected to the backend services.

---

# Technologies Used

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs
- Multer
- express-validator

## Frontend
- Modern frontend framework chosen by the frontend developer
- API integration using Axios or Fetch

## Database
- MongoDB Atlas Cloud Database

---

# Project Goals

The main goals of this project are:
- Build a scalable REST API
- Implement full CRUD operations
- Use MongoDB with Mongoose
- Implement Authentication & Authorization
- Create filtering and search APIs
- Build a responsive frontend application
- Implement cart and order systems
- Follow clean modular backend architecture

---

# Main Features

## User Features
- Register and login
- Browse products
- Search and filter products
- Add products to cart
- Place orders
- View order history

## Admin Features
- Manage products
- Manage categories
- Manage orders
- Manage users

---

# Database Collections

The project database contains the following collections:

1. Users
2. Categories
3. Products
4. Cart
5. Orders

MongoDB Atlas is used as the cloud database server for storing and managing all application data.

---

# Project Workflow

## 1. User Authentication Flow

1. User registers using email and password
2. Password is encrypted using bcrypt
3. User logs in
4. JWT token is generated
5. Protected routes use JWT middleware for authorization

---

## 2. Product Management Flow

1. Admin creates categories
2. Admin adds products
3. Product images are uploaded using Multer
4. Products are stored in MongoDB Atlas
5. Users can browse and filter products

---

## 3. Cart Flow

1. User adds products to cart
2. Cart stores product references and quantities
3. User can update quantities or remove items
4. Cart belongs to one user

---

## 4. Order Flow

1. User proceeds to checkout
2. Order is created from cart items
3. Total price is calculated
4. Product stock is reduced
5. Order status is updated by admins

---

# Backend Architecture

The backend follows a modular scalable architecture.

Main folders:
- config
- controllers
- middleware
- models
- routes
- validations
- utils
- uploads

This structure keeps the project organized and maintainable.

---

# GitHub Branch Strategy

Main branches:
- main
- develop
- backend
- frontend

Feature branches:
- feature/auth
- feature/products
- feature/cart-orders
- feature/testing-docs

---

# Team Structure

| Member | Responsibility |
|---|---|
| Member 1 | Authentication & Users |
| Member 2 | Products & Categories |
| Member 3 | Cart & Orders |
| Member 4 | Frontend Development |
| Member 5 | Testing, Documentation & Admin Features |

---

# API Modules

## Authentication APIs
- Register
- Login
- Profile

## Categories APIs
- Create category
- Update category
- Delete category
- Get categories

## Products APIs
- Create product
- Update product
- Delete product
- Get products
- Product filtering

## Cart APIs
- Add to cart
- Update quantity
- Remove item
- Get user cart

## Orders APIs
- Create order
- Get orders
- Update order status

---

# Validation & Security

The project includes:
- Request validation
- JWT Authentication
- Password hashing
- Protected routes
- Role-based authorization
- Error handling middleware

---

# Setup Instructions

## Clone Repository

```bash
git clone https://github.com/Abdo-Hafez-0/gamegear-store.git
```

## Install Backend Dependencies

```bash
cd backend
npm install
```

## Environment Variables

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

---

# Run Backend Server

```bash
npm run dev
```

---

# Future Improvements

Possible future enhancements:
- Wishlist system
- Product reviews
- Payment gateway integration
- Real-time notifications
- Analytics dashboard
- Pagination and advanced sorting

---

# Project Status

Current Phase:
Backend architecture and module development.

The project is being developed collaboratively by a 5-member team using GitHub for version control and MongoDB Atlas for cloud database hosting.