# API Documentation

**Base URL:** `http://localhost:3000/api/v1`

> All protected routes require a `Bearer` token in the `Authorization` header.
> ```
> Authorization: Bearer <your_token>
> ```

---

## Auth

### `POST /auth/login`
Returns a JWT token for valid credentials.

**Body**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Success `200`**
```json
{
  "status": "success",
  "token": "<jwt>"
}
```

**Error `401`** — wrong email or password
```json
{ "status": "error", "message": "Invalid email or password" }
```

---

### `POST /auth/register`
Creates a new user account. No token required.

**Body**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "yourpassword"
}
```

**Success `201`**
```json
{
  "status": "success",
  "user": {
    "id": 11,
    "name": "Jane ",
    "email": "jane@example.com"
  }
}
```

**Error `409`** — email already taken
```json
{ "status": "error", "message": "Email already in use" }
```

---

## Users

>  All user routes require a valid token.

### `GET /users`
Returns all users.

**Success `200`**
```json
{
  "status": "success",
  "data": [
    { "id": 1, "name": "Limbani Phiri", "email": "limbani@example.mw", "age": 28, ... }
  ]
}
```

---

### `GET /users/:id`
Returns a single user by ID.

**URL param:** `id` — the user's integer ID

**Success `200`**
```json
{
  "status": "success",
  "data": [{ "id": 1, "name": "Limbani Phiri", ... }]
}
```

---

### `POST /users`
Admin route — creates a user. Requires token.

**Body**
```json
{
  "name": "John Banda",
  "email": "john@example.com",
  "age": 24,
  "password": "yourpassword"
}
```

**Success `200`**
```json
{ "status": "success", "message": "User created successfully" }
```

---

## Orders

>  Requires a valid token.

### `GET /orders`
Returns all orders with user, product, and category details (JOIN query).

**Success `200`**
```json
{
  "status": "success",
  "data": [
    {
      "order_id": 3,
      "user_name": "Limbani Phiri",
      "product_name": "Maize Flour",
      "category_name": "Groceries",
      "amount": "1500.00"
    }
  ]
}
```

---

## Error Responses

### `401` — No token
```json
{ "status": "error", "message": "No token provided" }
```

### `403` — Invalid/expired token
```json
{ "status": "error", "message": "Invalid or expired token" }
```

### `404` — Route not found
```json
{ "status": "error", "message": "Cannot GET /api/v1/whatever — route not found" }
```
