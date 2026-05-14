# E-Commerce API Documentation

A RESTful API for managing products and categories, built with Node.js, Express, and MongoDB.

---

## Table of Contents

- [Base URL](#base-url)
- [1. Category APIs](#1-category-apis)
  - [getCategories](#getcategories)
  - [createCategory](#createcategory)
  - [updateCategory](#updatecategory)
  - [deleteCategory](#deletecategory)
- [2. Product APIs](#2-product-apis)
  - [getProducts](#getproducts)
  - [getProductById](#getproductbyid)
  - [createProduct](#createproduct)
  - [updateProduct](#updateproduct)
  - [deleteProduct](#deleteproduct)
- [3. Validation Rules](#3-validation-rules)
- [4. Upload Rules](#4-upload-rules)

---

## Base URL

```
http://localhost:5000/api
```


---

## 1. Category APIs

Base Path: `/api/categories`

---

### getCategories

Returns all categories sorted by newest first.

- **URL**: `/api/categories/getCategories`
- **Method**: `GET`
- **Auth**: None

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Keyboards",
      "description": "Mechanical and membrane keyboards",
      "image": "src/uploads/categories/1690000000000-123456789.jpg",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

---

### createCategory

Creates a new category. Supports an optional image upload.

- **URL**: `/api/categories/createCategory`
- **Method**: `POST`
- **Auth**: Required — Admin Only
- **Content-Type**: `multipart/form-data`

**Request Body:**

| Field         | Type   | Required | Description                              |
|---------------|--------|----------|------------------------------------------|
| `name`        | String | ✅ Yes   | Category name (2–50 chars)               |
| `description` | String | ❌ No    | Short description (max 500 chars)        |
| `image`       | File   | ❌ No    | jpeg / jpg / png / webp — max 5MB        |

**Response `201 Created`:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Keyboards",
    "description": "Mechanical and membrane keyboards",
    "image": "src/uploads/categories/1690000000000-123456789.jpg",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Reason                        |
|--------|-------------------------------|
| `400`  | Validation failed             |
| `401`  | Missing or invalid token      |
| `403`  | User is not an admin          |

---

### updateCategory

Updates an existing category by ID. Only the fields you send will be changed.

- **URL**: `/api/categories/updateCategory/:id`
- **Method**: `PUT`
- **Auth**: Required — Admin Only
- **Content-Type**: `multipart/form-data`

**URL Parameters:**

| Parameter | Type     | Description            |
|-----------|----------|------------------------|
| `id`      | ObjectId | The category MongoDB ID |

**Request Body (all optional):**

| Field         | Type   | Description                          |
|---------------|--------|--------------------------------------|
| `name`        | String | New name (2–50 chars)                |
| `description` | String | New description (max 500 chars)      |
| `image`       | File   | New image — replaces the current one |

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Mechanical Keyboards",
    "description": "Updated description",
    "image": "src/uploads/categories/1690000001000-987654321.png",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-02T10:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Reason              |
|--------|---------------------|
| `400`  | Validation failed   |
| `404`  | Category not found  |

---

### deleteCategory

Permanently deletes a category by ID.

- **URL**: `/api/categories/deleteCategory/:id`
- **Method**: `DELETE`
- **Auth**: Required — Admin Only

**URL Parameters:**

| Parameter | Type     | Description            |
|-----------|----------|------------------------|
| `id`      | ObjectId | The category MongoDB ID |

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": null
}
```

**Error Responses:**

| Status | Reason             |
|--------|--------------------|
| `404`  | Category not found |

---

## 2. Product APIs

Base Path: `/api/products`

---

### getProducts

Returns a list of products. Supports filtering, searching, and price range.

- **URL**: `/api/products/getProducts`
- **Method**: `GET`
- **Auth**: None

**Query Parameters:**

| Parameter  | Type   | Description                                              |
|------------|--------|----------------------------------------------------------|
| `category` | String | Filter by category ID or category name (case-insensitive)|
| `brand`    | String | Filter by brand name (case-insensitive)                  |
| `minPrice` | Number | Minimum price                                            |
| `maxPrice` | Number | Maximum price                                            |
| `search`   | String | Search by product title (case-insensitive)               |

**Example:**
```
GET /api/products/getProducts?category=Keyboards&brand=Logitech&minPrice=20&maxPrice=200&search=wireless
```

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "count": 1,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "title": "Logitech G Pro X",
      "description": "Professional gaming keyboard",
      "price": 149.99,
      "stock": 50,
      "brand": "Logitech",
      "category": { "_id": "64f1a2b3c4d5e6f7a8b9c0d1", "name": "Keyboards" },
      "images": ["src/uploads/products/1690000000000-111.jpg"],
      "rating": 4.7,
      "specifications": {
        "connectivity": "Wired",
        "rgb": true,
        "switches": "GX Blue",
        "dpi": null
      },
      "createdBy": { "_id": "64f1a2b3c4d5e6f7a8b9c0d9", "name": "Admin", "email": "admin@store.com" },
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

---

### getProductById

Retrieves a single product by its ID with full category and creator details.

- **URL**: `/api/products/getProductById/:id`
- **Method**: `GET`
- **Auth**: None

**URL Parameters:**

| Parameter | Type     | Description           |
|-----------|----------|-----------------------|
| `id`      | ObjectId | The product MongoDB ID |

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Product fetched successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "title": "Logitech G Pro X",
    "description": "Professional gaming keyboard",
    "price": 149.99,
    "stock": 50,
    "brand": "Logitech",
    "category": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Keyboards",
      "description": "Mechanical and membrane keyboards"
    },
    "images": ["src/uploads/products/1690000000000-111.jpg"],
    "rating": 4.7,
    "specifications": {
      "connectivity": "Wired",
      "rgb": true,
      "switches": "GX Blue",
      "dpi": null
    },
    "createdBy": { "_id": "64f1a2b3c4d5e6f7a8b9c0d9", "name": "Admin", "email": "admin@store.com" }
  }
}
```

**Error Responses:**

| Status | Reason            |
|--------|-------------------|
| `404`  | Product not found |

---

### createProduct

Creates a new product. Supports uploading up to 10 images. Send `specifications` as a JSON string.

- **URL**: `/api/products/createProduct`
- **Method**: `POST`
- **Auth**: Required — Admin Only
- **Content-Type**: `multipart/form-data`

**Request Body:**

| Field                    | Type     | Required | Description                                    |
|--------------------------|----------|----------|------------------------------------------------|
| `title`                  | String   | ✅ Yes   | Product title (2–200 chars)                    |
| `price`                  | Number   | ✅ Yes   | Price — must be greater than 0                 |
| `stock`                  | Number   | ✅ Yes   | Available stock — min 0                        |
| `category`               | ObjectId | ✅ Yes   | Valid category ID                              |
| `brand`                  | String   | ❌ No    | Brand name (max 100 chars)                     |
| `description`            | String   | ❌ No    | Product description (max 2000 chars)           |
| `rating`                 | Number   | ❌ No    | Rating between 0 and 5                         |
| `specifications`         | String   | ❌ No    | JSON string (see structure below)              |
| `images`                 | Files    | ❌ No    | Up to 10 images — jpeg/jpg/png/webp, max 5MB each |

**Specifications JSON string example:**
```json
{
  "connectivity": "Wireless",
  "rgb": true,
  "switches": "Cherry MX Red",
  "dpi": 12000
}
```

**Response `201 Created`:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "title": "Logitech G Pro X",
    "price": 149.99,
    "stock": 50,
    "brand": "Logitech",
    "category": "64f1a2b3c4d5e6f7a8b9c0d1",
    "images": ["src/uploads/products/1690000000000-111.jpg"],
    "rating": 4.7,
    "specifications": { "connectivity": "Wired", "rgb": true, "switches": "GX Blue", "dpi": null },
    "createdBy": "64f1a2b3c4d5e6f7a8b9c0d9",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Reason                       |
|--------|------------------------------|
| `400`  | Validation failed            |
| `400`  | Category not found           |
| `401`  | Missing or invalid token     |
| `403`  | User is not an admin         |

---

### updateProduct

Updates an existing product by ID. Only the fields you send will be changed. New images are **appended** to the existing list.

- **URL**: `/api/products/updateProduct/:id`
- **Method**: `PUT`
- **Auth**: Required — Admin Only
- **Content-Type**: `multipart/form-data`

**URL Parameters:**

| Parameter | Type     | Description           |
|-----------|----------|-----------------------|
| `id`      | ObjectId | The product MongoDB ID |

**Request Body (all optional):**

| Field            | Type     | Description                                        |
|------------------|----------|----------------------------------------------------|
| `title`          | String   | New title (2–200 chars)                            |
| `price`          | Number   | New price (must be > 0)                            |
| `stock`          | Number   | New stock (min 0)                                  |
| `category`       | ObjectId | New category ID                                    |
| `brand`          | String   | New brand name                                     |
| `description`    | String   | New description                                    |
| `rating`         | Number   | New rating (0–5)                                   |
| `specifications` | String   | JSON string — merged with existing specifications  |
| `images`         | Files    | New images to append (up to 10, max 5MB each)      |

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {}
}
```

**Error Responses:**

| Status | Reason                    |
|--------|---------------------------|
| `400`  | Validation failed         |
| `404`  | Product or category not found |

---

### deleteProduct

Permanently deletes a product by ID.

- **URL**: `/api/products/deleteProduct/:id`
- **Method**: `DELETE`
- **Auth**: Required — Admin Only

**URL Parameters:**

| Parameter | Type     | Description           |
|-----------|----------|-----------------------|
| `id`      | ObjectId | The product MongoDB ID |

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": null
}
```

**Error Responses:**

| Status | Reason            |
|--------|-------------------|
| `404`  | Product not found |

---

## 3. Validation Rules

### Category

| Field         | Rule                          |
|---------------|-------------------------------|
| `name`        | Required — 2 to 50 characters |
| `description` | Optional — max 500 characters |

### Product

| Field                | Rule                                  |
|----------------------|---------------------------------------|
| `title`              | Required — 2 to 200 characters        |
| `price`              | Required — number greater than 0      |
| `stock`              | Required — integer, min 0             |
| `category`           | Required — valid MongoDB ObjectId     |
| `brand`              | Optional — max 100 characters         |
| `description`        | Optional — max 2000 characters        |
| `rating`             | Optional — number between 0 and 5     |
| `specifications.dpi` | Optional — positive integer           |

---

## 4. Upload Rules

| Setting              | Value                          |
|----------------------|--------------------------------|
| Allowed formats      | `jpeg`, `jpg`, `png`, `webp`   |
| Max file size        | 5MB per file                   |
| Max files (product)  | 10 images                      |
| Max files (category) | 1 image                        |

| Resource   | Upload Path                 |
|------------|-----------------------------|
| Products   | `src/uploads/products/`     |
| Categories | `src/uploads/categories/`   |