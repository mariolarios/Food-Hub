# Food-Hub-API

The Food-Hub API is a comprehensive solution designed for optimizing food service operations. It is built with a focus on security, efficiency, and scalability. This RESTful API integrates advanced user authentication mechanisms, including JWT for secure token-based authentication, express-rate-limit for request rate limiting to prevent brute-force attacks, and bcryptjs for secure password hashing. It supports systematic meal and order management modules, alongside an interactive review aggregation system. Leveraging real-time data processing and a centralized MongoDB database, the Food-Hub API is engineered to enhance operational efficiency, user engagement, and enable data-driven decision-making within the food service ecosystem.

## Documentation
API Documentation can be found at: https://food-hub-docs.onrender.com/

## Features

- **User Authentication**: Secure registration, login, and logout functionalities using JWT.
- **User Management**: Retrieve and update user profiles securely.
- **Meal Management**: CRUD operations for meals, including image upload capabilities.
- **Order Processing**: Manage orders with real-time updates.
- **Review System**: Create, retrieve, update, and delete reviews for meals.

## Endpoints

### Auth

- `GET {{URL}}/auth/logout` - Logout User
- `POST {{URL}}/auth/register` - Register User
- `POST {{URL}}/auth/login` - Login User

### User

- `GET {{URL}}/users` - Get all users
- `GET {{URL}}/users/:id` - Get single user (Replace `:id` with the actual ID)
- `GET {{URL}}/users/showMe` - Show current logged-in user
- `PATCH {{URL}}/users/updateUser` - Update user
- `PATCH {{URL}}/users/updateUserPassword` - Update user password

### Meal

- `GET {{URL}}/meals` - Get all meals
- `POST {{URL}}/meals` - Create a new meal
- `GET {{URL}}/meals/:id` - Get single meal (Replace `:id` with the actual ID)
- `PATCH {{URL}}/meals/:id` - Update meal (Replace `:id` with the actual ID)
- `DELETE {{URL}}/meals/:id` - Delete meal (Replace `:id` with the actual ID)
- `POST {{URL}}/meals/uploadImage` - Upload image for a meal
- `GET {{URL}}/meals/:id/reviews` - Get reviews for a single meal (Replace `:id` with the actual ID)

### Review

- `GET {{URL}}/reviews` - Get all reviews
- `POST {{URL}}/reviews` - Create a new review
- `GET {{URL}}/reviews/:id` - Get single review (Replace `:id` with the actual ID)
- `PATCH {{URL}}/reviews/:id` - Update review (Replace `:id` with the actual ID)
- `DELETE {{URL}}/reviews/:id` - Delete review (Replace `:id` with the actual ID)

### Order

- `POST {{URL}}/orders` - Create a new order
- `GET {{URL}}/orders` - Get all orders
- `GET {{URL}}/orders/:id` - Get single order (Replace `:id` with the actual ID)
- `PATCH {{URL}}/orders/:id` - Update order (Replace `:id` with the actual ID)
- `GET {{URL}}/orders/userOrders` - Show current user's orders

## Installation

```bash
# Clone the repository
git clone https://github.com/mariolarios/the-new-food-hub.git


## Setup

To set up the server locally, run the following:

`
npm i && npm run dev
`

## Enviroment Setup
Before running the application, create a .env file in the root directory and add the following environment variables:

- MONGO_URL: Your MongoDB connection string.
- JWT_SECRET: A secret key for JWT signing and verification.
- JWT_LIFETIME: Duration that a JWT token is valid (e.g., 1d for 1 day).
