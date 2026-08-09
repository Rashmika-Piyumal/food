# PROJECT_CONTEXT.md — FoodExpress (Food Delivery Website)

## 1. What is this project

A food delivery website where customers can browse restaurants/menus, add items to
a cart, place an order, and track it. Admin can manage restaurants, menu items, and orders.

## 2. Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** React (Vite)
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt
- **Styling:** Tailwind CSS

No TypeScript. No other frameworks unless explicitly added later.

## 3. Project Structure

```
food-express/
├── CLAUDE.md
├── PROJECT_CONTEXT.md
├── PROMPTS_CHEATSHEET.md
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   ├── MenuItem.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── RestaurantDetail.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Login.jsx
    │   │   └── Signup.jsx
    │   ├── services/
    │   │   └── api.js
    │   └── App.jsx
    └── package.json
```

## 4. Data Models

### User
- name, email (unique), password (hashed), role (customer/admin), timestamps

### Restaurant
- name, description, cuisine, address, image, rating, isOpen, timestamps

### MenuItem
- restaurantId (ref Restaurant), name, price, description, category, image, isAvailable

### Cart
- userId (ref User), items: [{ menuItemId, quantity }], timestamps

### Order
- userId (ref User), restaurantId, items: [{ menuItemId, name, price, quantity }],
  totalPrice, status (pending/confirmed/delivered/cancelled), deliveryAddress, timestamps

## 5. Core Features (in build priority order)

1. Restaurant + menu listing (public, no auth needed)
2. User signup/login (JWT)
3. Add to cart, view cart, update quantity
4. Place order, view order history
5. Admin: add/edit restaurants and menu items
6. Admin: view and update order status

## 6. API Route Conventions

- `/api/restaurants` — public, list + detail
- `/api/menu/:restaurantId` — public, menu items for a restaurant
- `/api/auth/signup`, `/api/auth/login` — public
- `/api/cart` — protected (requires JWT)
- `/api/orders` — protected
- `/api/admin/*` — protected + admin role check

## 7. Rules Claude Code Must Follow

1. Keep backend and frontend fully decoupled — communicate only via REST API.
2. Every protected route must check JWT via middleware, never inline.
3. Passwords must always be hashed with bcrypt before saving — never store plain text.
4. Use environment variables (`.env`) for DB connection string and JWT secret — never hardcode.
5. Don't introduce new npm packages without explaining why they're needed first.
