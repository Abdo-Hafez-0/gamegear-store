# API Endpoints Documentation

This document outlines the API endpoints implemented in the cart and order controllers.

## Authentication
All endpoints require authentication via JWT token in the Authorization header.

## Validation Rules
Endpoints use express-validator for input validation. Invalid requests return 400 status with validation errors.

## Cart Endpoints

### 1. Get Cart
- **Method:** GET
- **Endpoint:** `/api/cart`
- **Description:** Retrieves the user's cart with populated product details.
- **Response:**
  ```json
  {
    "success": true,
    "message": "Cart fetched successfully",
    "data": {
      "user": "...",
      "items": [
        {
          "product": { /* product object */ },
          "quantity": 2
        }
      ]
    }
  }
  ```
  - If cart is empty:
  ```json
  {
    "success": true,
    "message": "Cart is empty",
    "data": {
      "items": []
    }
  }
  ```

### 2. Add to Cart
- **Method:** POST
- **Endpoint:** `/api/cart`
- **Description:** Adds a product to the user's cart (quantity = 1). If product already exists, increments quantity by 1.
- **Validation:**
  - `productId`: Required, must be a valid MongoDB ObjectId
- **Request Body:**
  ```json
  {
    "productId": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Product added to cart",
    "data": { /* cart object */ }
  }
  ```

### 3. Update Cart Item
- **Method:** PUT
- **Endpoint:** `/api/cart/:productId`
- **Description:** Updates the quantity of a specific item in the cart.
- **Validation:**
  - `quantity`: Required, must be an integer >= 1
- **Request Body:**
  ```json
  {
    "quantity": "number"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Cart updated successfully",
    "data": { /* cart object */ }
  }
  ```

### 4. Clear Cart
- **Method:** DELETE
- **Endpoint:** `/api/cart`
- **Description:** Removes all items from the user's cart.
- **Response:**
  ```json
  {
    "success": true,
    "message": "Cart cleared successfully",
    "data": { /* cart object */ }
  }
  ```

### 5. Remove Cart Item
- **Method:** DELETE
- **Endpoint:** `/api/cart/:productId`
- **Description:** Removes a specific item from the cart.
- **Response:**
  ```json
  {
    "success": true,
    "message": "Item removed from cart",
    "data": { /* cart object */ }
  }
  ```

## Order Endpoints

### 1. Create Order
- **Method:** POST
- **Endpoint:** `/api/orders`
- **Description:** Creates a new order from the user's cart, validates stock, and clears the cart.
- **Validation:**
  - `paymentMethod`: Required, must be "Cash", Credit Card & Paypal can be shown as "soon" in the UI
  - `shippingAddress`: Required
- **Request Body:**
  ```json
  {
    "paymentMethod": "Cash",
    "shippingAddress": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Order created successfully",
    "data": { /* order object */ }
  }
  ```

### 2. Get Orders
- **Method:** GET
- **Endpoint:** `/api/orders`
- **Description:** Retrieves all orders for the authenticated user.
- **Response:**
  ```json
  {
    "success": true,
    "message": "Orders fetched successfully",
    "count": 2,
    "data": [ /* array of order objects */ ]
  }
  ```
  - If no orders:
  ```json
  {
    "success": true,
    "message": "No orders yet!  :(",
    "data": {
      "items": []
    }
  }
  ```

### 3. Get All Orders (Admin)
- **Method:** GET
- **Endpoint:** `/api/orders/admin`
- **Description:** Retrieves all orders with pagination (Admin only).
- **Authorization:** Requires admin role.
- **Query Parameters:**
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
- **Response:**
  ```json
  {
    "success": true,
    "message": "All orders fetched successfully",
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalOrders": 50,
      "limit": 10
    },
    "count": 10,
    "data": [ /* array of order objects with user info */ ]
  }
  ```

### 4. Update Order Status
- **Method:** PUT
- **Endpoint:** `/api/orders/:id`
- **Description:** Updates the status of an order (Admin only).
- **Authorization:** Requires admin role.
- **Validation:**
  - `orderStatus`: Required, must be one of: "Pending", "Processing", "Shipped", "Delivered"
- **Request Body:**
  ```json
  {
    "orderStatus": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Order status updated",
    "data": { /* order object */ }
  }
  ```