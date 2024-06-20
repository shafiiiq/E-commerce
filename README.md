# E-commerce Application Documentation

## Overview

The E-commerce application consists of three main components:
1. **Frontend** - User interface running on port 3000 (React).
2. **Admin Panel** - Admin interface running on port 3001 (React).
3. **Backend** - REST API running on port 4000 (Node.js with Express).

## Directory Structure

Certainly! Here's a concise representation of the directory structure for your E-commerce application:

**Root Directory:**

- **E-commerce/**  
  Root directory for the E-commerce application.

  - **adminpanel/**  
    Admin interface  
    Port: 3001

  - **backend/**  
    Backend REST API  
    Port: 4000

  - **frontend/**  
    User interface  
    Port: 3000

## Cloning the Repository

1. Copy the GitHub repository URL.
2. Open your terminal.
3. Use the `git clone` command followed by the repository URL to clone the project.
4. Navigate into the cloned repository directory.

## Building and Running the Application

### Backend

1. Navigate to the `backend` directory.
2. Install the required dependencies.
3. Start the backend server.
4. The backend server will run on port 4000.

### Admin Panel

1. Navigate to the `adminpanel` directory.
2. Install the required dependencies.
3. Start the admin panel.
4. The admin panel will run on port 3001.

### Frontend

1. Navigate to the `frontend` directory.
2. Install the required dependencies.
3. Start the frontend.
4. The frontend will run on port 3000.

## Summary

- **Backend:** Running on `http://localhost:4000`
- **Admin Panel:** Running on `http://localhost:3001`
- **Frontend:** Running on `http://localhost:3000`

By following these steps, you will successfully build and run the E-commerce application.


# E-commerce API Documentation

## Base URL
All endpoints are relative to:
```
http://localhost:4000
```

## Authentication
This API uses JWT for authentication. Secure endpoints require the `auth-token` header to be included in requests.

## Endpoints

### General

#### Get Server Status
**GET** `/`
- **Description:** Checks if the server is running.
- **Response:** A message confirming that the server is running.

### Products

#### Get All Products
**GET** `/get-products`
- **Description:** Fetches all products.
- **Response:** An array of product objects.

#### Get Product by ID
**GET** `/product/:id`
- **Description:** Fetches a product by its ID.
- **Path Parameters:** 
  - `id` (required): ID of the product.
- **Response:** A product object or a 404 error if the product is not found.

#### Add Product
**POST** `/add-products`
- **Description:** Adds a new product.
- **Request Body:** Details of the product to be added.
- **Response:** Success status and the name of the added product.

#### Update Product
**PUT** `/update-product/:id`
- **Description:** Updates an existing product.
- **Path Parameters:** 
  - `id` (required): ID of the product to update.
- **Request Body:** Updated details of the product.
- **Response:** Success status and the updated product object.

#### Delete Product
**POST** `/delete-product`
- **Description:** Deletes a product.
- **Request Body:** ID of the product to be deleted.
- **Response:** Success status and the name of the deleted product.

#### Upload Product Image
**POST** `/upload`
- **Description:** Uploads a product image.
- **Form Data:** The image file to upload.
- **Response:** Success status and the URL of the uploaded image.

### Users

#### Signup
**POST** `/signup`
- **Description:** Registers a new user.
- **Request Body:** Email and password for the new user.
- **Response:** Success status and a JWT token.

#### Login
**POST** `/login`
- **Description:** Logs in an existing user.
- **Request Body:** Email and password of the user.
- **Response:** Success status and a JWT token.

### Cart

#### Add to Cart
**POST** `/addtocart`
- **Description:** Adds a product to the user's cart.
- **Request Headers:** `auth-token` (required): JWT token.
- **Request Body:** ID of the item to add to the cart.
- **Response:** A message confirming the product was added to the cart.

#### Remove from Cart
**POST** `/removefromcart`
- **Description:** Removes a product from the user's cart.
- **Request Headers:** `auth-token` (required): JWT token.
- **Request Body:** ID of the item to remove from the cart.
- **Response:** A message confirming the product was removed from the cart.

#### Get User Cart
**GET** `/getcart`
- **Description:** Retrieves the user's cart.
- **Request Headers:** `auth-token` (required): JWT token.
- **Response:** An array of product objects with quantities.

## Error Handling
Common error responses include:
- **400 Bad Request:** Invalid input.
- **401 Unauthorized:** Missing or invalid authentication token.
- **404 Not Found:** Resource not found.
- **500 Internal Server Error:** An error occurred on the server.

## Notes
- Ensure all requests requiring authentication include the `auth-token` header with a valid JWT token.
