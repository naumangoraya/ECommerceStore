# Modern E-Commerce Platform 🛒

A full-featured e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js), featuring a modern UI, secure authentication, and comprehensive admin capabilities.



## 🌟 Features

### User Features
- **Authentication**
  - Secure signup and login system
  - JWT-based authentication with access and refresh tokens
  - Persistent login for 24 hours
  - Password hashing and security measures

- **Shopping Experience**
  - Browse products by categories
  - Product search and filtering
  - Product details with images and descriptions
  - Shopping cart management
  - Manual coupon code application
  - Secure checkout with Stripe
  - Gift coupons for purchases over $200

- **Product Reviews & Ratings**
  - Star rating system (1-5 stars)
  - Write detailed product reviews
  - View other users' reviews and ratings
  - Average rating display
  - Review submission date tracking
  - Comment-based reviews

### Admin Features
- **Dashboard**
  - Analytics cards showing key metrics
  - Total users count
  - Total products count
  - Total sales count
  - Total revenue statistics
  - Real-time notifications for new orders

- **Product Management**
  - Add, edit, and delete products
  - Image upload with Cloudinary
  - Category management
  - Set featured products
  - Product pricing
  - Product descriptions

- **Order Management**
  - View orders
  - Basic order details
  - Customer information

- **Coupon System**
  - Create and manage discount coupons
  - Set discount percentages
  - Track coupon usage
  - Automatic gift coupons

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI library
- **Tailwind CSS** - Styling and design
- **Zustand** - State management
- **React Router** - Navigation
- **Axios** - API requests
- **React Hot Toast** - Notifications
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **React Hook Form** - Form handling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Redis** - Caching
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage
- **Stripe** - Payment processing
- **Socket.io** - Real-time notifications

### DevOps & Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control
- **npm** - Package management

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Redis
- Stripe account
- Cloudinary account

### Environment Variables
Create a `.env` file in the backend directory:
```bash
PORT=5000
MONGO_URI=your_mongo_uri
UPSTASH_REDIS_URL=your_redis_url
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/naumangoraya/ECommerceStore.git
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

5. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

## 🔒 Security Features
- JWT-based authentication
- Password hashing with bcrypt
- HTTP-only cookies
- CORS protection
- Rate limiting
- Input validation and sanitization
- Secure headers with Helmet
- XSS protection

## 💳 Payment Integration
- Secure payment processing with Stripe
- Support for card payments
- Automatic order creation after successful payment
- Payment error handling
- Automatic cart clearing after successful purchase

## 🎯 Core Functionalities
1. **User Management**
   - User registration and authentication
   - Profile management
   - Review submission capabilities

2. **Product System**
   - Product categorization
   - Image management
   - Featured products
   - Rating and review system
   - Product search and filtering

3. **Shopping Cart**
   - Add/remove items
   - Quantity management
   - Price calculation
   - Coupon application

4. **Review System**
   - Star rating submission
   - Written reviews
   - Review display
   - Rating averages

5. **Admin Panel**
   - User management
   - Product management
   - Order processing
   - Analytics dashboard
   - Coupon management

## 📱 Responsive Design
- Mobile-first approach
- Responsive on all devices
- Touch-friendly interface
- Optimized images

## 🔄 State Management
- Zustand for global state
- Persistent cart state
- User authentication state
- Admin state management

## 🚀 Performance Optimizations
- Redis caching
- Image optimization
- Code splitting
- Lazy loading
- Memoization where necessary

## 📦 Deployment
The application can be deployed using various platforms:
- Frontend: Vercel, Netlify, or similar
- Backend: Heroku, DigitalOcean, or AWS
- Database: MongoDB Atlas
- Cache: Upstash Redis

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.
