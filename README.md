# Ecommerce Backend

This is the backend for an eCommerce application built with Node.js, Express, and MongoDB. It provides APIs for user authentication, product management, orders, payments, and more.

## Features

- User authentication (JWT)
- Role-based access control (RBAC)
- Product and cart management
- Order and payment processing (Stripe)
- Redis caching for performance optimization
- Cloudinary integration for image uploads
- Error handling and middleware support

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JWT, bcryptjs
- **Caching:** Redis (ioredis)
- **File Uploads:** Cloudinary, Multer
- **Payment Gateway:** Stripe

## Folder Structure

```
backend/
│── src/
│   ├── config/                # Configuration files (DB, Redis, Stripe, etc.)
│   ├── controllers/           # Business logic for handling requests
│   ├── middlewares/           # Authentication & error-handling middlewares
│   ├── models/                # Mongoose models for database schema
│   ├── routes/                # API route handlers
│   ├── utils/                 # Utility functions
│   ├── index.js               # Entry point of the application
│── .env                       # Environment variables
│── package.json               # Dependencies and scripts
│── .gitignore                 # Files to ignore in Git
```

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/faridomarAf/reactjs-ecommerce-backend.git
   cd backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```sh
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   REDIS_URL=your_redis_url
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. Run the development server:
   ```sh
   npm run dev
   ```

## API Routes

- **Auth**: `/api/v1/auth/`
- **Products**: `/api/v1/products/`
- **Cart**: `/api/v1/cart/`
- **Orders**: `/api/v1/orders/`
- **Payments**: `/api/v1/payments/`
- **Coupons**: `/api/v1/coupons/`

## Contributing

Feel free to fork and submit pull requests. Follow best practices and ensure proper documentation.

## License

This project is licensed under the ISC License.

