# Claude Code Prompts — FoodExpress Cheatsheet

> Copy-paste these prompts into Claude Code **in order**. Wait for each one to
> finish and verify before sending the next.
>
> **Stack:** Node.js + Express + MongoDB backend, React (Vite) + Tailwind frontend.

---

## Pre-flight

| Step | Command / Action |
|---|---|
| 1. Create project folder | `mkdir food-express && cd food-express` |
| 2. Drop in context files | Copy `PROJECT_CONTEXT.md` and `CLAUDE.md` into this folder |
| 3. MongoDB ready | Local install running, or a free MongoDB Atlas connection string ready |
| 4. Node installed | `node -v && npm -v` |
| 5. Launch Claude Code | `claude` — run inside `food-express/` |

---

## PROMPT 0 — Establish context

```
Read PROJECT_CONTEXT.md and CLAUDE.md fully. Then give me a short confirmation:
1. The tech stack
2. The data models and their key fields
3. The 5 rules you'll hold yourself to
Then STOP. Don't write any code yet — wait for PROMPT 1.
```

**Verify:** Claude Code repeats the stack/models/rules correctly.

---

## PROMPT 1 — Bootstrap the project structure

```
Bootstrap the FoodExpress project per PROJECT_CONTEXT.md → Project Structure.

BACKEND (backend/):
1. Create package.json, install express, mongoose, dotenv, cors, bcryptjs, jsonwebtoken.
2. Create the folder skeleton: config/, models/, controllers/, routes/, middleware/.
3. Create server.js with a basic Express app, cors enabled, and a health-check route GET /api/health.

FRONTEND (frontend/):
4. Create a React app with Vite: npm create vite@latest frontend -- --template react
5. Install react-router-dom, axios, and set up Tailwind CSS.
6. Create the folder skeleton: src/components/, src/pages/, src/services/.
7. Replace App.jsx with a minimal router shell.

VERIFY: show me `tree -L 3 -I 'node_modules'` when done.
```

**Verify:** Folder structure matches PROJECT_CONTEXT.md, `npm run dev` (backend) and `npm run dev` (frontend) both boot with no errors.

---

## PROMPT 2 — Database connection + core models

```
Reference: PROJECT_CONTEXT.md → Data Models.

1. Create backend/config/db.js — connect to MongoDB using MONGO_URI from .env.
2. Create these Mongoose models exactly as specified in PROJECT_CONTEXT.md:
   - User (name, email unique, password hashed, role)
   - Restaurant (name, description, cuisine, address, image, rating, isOpen)
   - MenuItem (restaurantId ref, name, price, description, category, image, isAvailable)
   - Cart (userId ref, items array)
   - Order (userId ref, restaurantId, items array, totalPrice, status, deliveryAddress)
3. Call the db connection in server.js on startup.
4. Create backend/.env.example with MONGO_URI and JWT_SECRET placeholders.

VERIFY: npm run dev shows "MongoDB connected" with no errors.
```

**Verify:** Server starts, console shows successful DB connection.

---

## PROMPT 3 — User authentication

```
Reference: PROJECT_CONTEXT.md → Rules #1 and #2.

1. Create authController.js with signup and login functions.
   - Signup: hash password with bcrypt, save user, return JWT.
   - Login: verify password, return JWT.
2. Create authMiddleware.js — verifies JWT from Authorization header, attaches
   req.user, rejects with 401 if invalid/missing.
3. Create authRoutes.js: POST /api/auth/signup, POST /api/auth/login.
4. Wire the routes into server.js.

VERIFY: test signup and login with curl or Postman — login returns a valid JWT.
```

**Verify:** Signup creates a user with a hashed password in MongoDB (check in Compass/Atlas — password should NOT be readable plain text). Login returns a token.

---

## PROMPT 4 — Restaurant + Menu API (public)

```
Create restaurantController.js and menuController.js with these public endpoints:
- GET /api/restaurants — list all restaurants
- GET /api/restaurants/:id — single restaurant detail
- GET /api/menu/:restaurantId — menu items for a restaurant

Also create POST/PUT/DELETE versions of these, but protect them with authMiddleware 
AND an admin role check (create adminMiddleware.js for this).

Wire up restaurantRoutes.js and menuRoutes.js into server.js.
```

**Verify:** `GET /api/restaurants` returns `[]` (empty, no data yet) with no errors. Admin-only routes reject requests without a valid admin JWT.

---

## PROMPT 5 — Cart and Order system

```
Reference: PROJECT_CONTEXT.md → Data Models → Cart, Order.

1. Create cartController.js: add item to cart, view cart, update quantity, remove item.
   All routes protected with authMiddleware — cart is tied to req.user.id.
2. Create orderController.js: place order (converts cart into an order, clears cart),
   view order history for the logged-in user.
3. Wire up cartRoutes.js and orderRoutes.js.

VERIFY: adding an item to cart, then placing an order, creates a correctly linked
Order document and empties the Cart.
```

**Verify:** Full flow works via Postman — add to cart → place order → order appears in order history.

---

## PROMPT 6 — Seed some test data

```
Create a seed script (backend/seed.js) that inserts 3 sample restaurants, each with 
4-5 menu items, so the frontend has real data to display. Add a script to package.json: 
"seed": "node seed.js".
```

**Verify:** `npm run seed` populates MongoDB, `GET /api/restaurants` now returns real data.

---

## PROMPT 7 — React frontend pages

```
Create these pages using React Router and Tailwind for styling:
- Home.jsx — lists restaurants (fetched from /api/restaurants)
- RestaurantDetail.jsx — shows menu items for one restaurant, "add to cart" buttons
- Cart.jsx — shows cart items, quantity controls, total price
- Checkout.jsx — delivery address form, "place order" button
- Login.jsx and Signup.jsx — forms connected to the auth API

Set up src/services/api.js with an axios instance pointing to the backend, and 
store the JWT in localStorage after login.
```

**Verify:** `npm run dev` (frontend) loads the Home page, navigation between pages works.

---

## PROMPT 8 — Connect everything end-to-end

```
Wire up the full flow in the frontend:
1. Home page fetches and displays real restaurants from the backend.
2. Clicking a restaurant goes to RestaurantDetail with its real menu items.
3. "Add to cart" calls the cart API (requires login — redirect to Login if not authenticated).
4. Cart page shows real cart data and lets me update/remove items.
5. Checkout places a real order and redirects to an order confirmation message.
6. Add a simple Navbar showing login state and a cart item count.
```

**Verify:** Full walkthrough works — browse → add to cart → login → checkout → order saved in MongoDB.

---

## Run & Test

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

---

## Git — commit after every working prompt

```bash
git init          # first time only
git add .
git commit -m "Prompt X: <what was added>"
```

---

## Emergency Prompts

### ⚠️ MongoDB won't connect
```
Check backend/.env — is MONGO_URI set? If using Atlas, confirm the current IP is 
whitelisted under Network Access, and the password has no unescaped special characters.
```

### ⚠️ CORS error in browser console
```
Confirm cors() is enabled in server.js before the routes are registered. Restart the 
backend and hard-refresh the browser.
```

### ⚠️ 401 Unauthorized on routes that should work
```
Check the frontend is sending the JWT in the Authorization header as 
"Bearer <token>", and that the token is actually saved in localStorage after login.
```

### ⚠️ Context getting too full / Claude Code losing track
```
Open a fresh Claude Code session in the same folder — it reads CLAUDE.md 
automatically. Continue from the next prompt in this cheatsheet.
```

---

## Final walkthrough — the 8-step end state

1. Visit the frontend — Home page shows real restaurants.
2. Click a restaurant — menu items load.
3. Add an item to cart (prompts login if not signed in).
4. Sign up / log in.
5. Go to Cart — item is there with correct price.
6. Checkout — enter address, place order.
7. Order appears in order history.
8. Confirm in MongoDB — the Order document was saved correctly, Cart is now empty.

That's a **working food delivery website**, built step-by-step with Claude Code. 🟢
