# Food-Hub

Food-Hub is a comprehensive platform for managing meals, orders, and user interactions within a food service context. This system allows for intricate user authorization, meal management, order handling, and review coordination.

## Features

- User Authentication (Register, Login, Logout)
- User Management (Retrieve, Update)
- Meal Management (Create, Retrieve, Update, Delete, Review)
- Order Processing (Create, Retrieve, Update)
- Review System (Create, Retrieve, Update, Delete)

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
