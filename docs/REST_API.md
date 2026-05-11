# Smart Pet Care Platform - REST API Documentation

## Base URL
`http://localhost:8080/api`

---

## 1. Authentication Endpoints

### `POST /auth/signup`
**Description:** Registers a new user.
**Body:**
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword",
  "phone": "555-1234",
  "role": "OWNER" 
}
```

### `POST /auth/signin`
**Description:** Authenticates user and returns JWT.
**Body:**
```json
{
  "email": "jane@example.com",
  "password": "securepassword"
}
```

---

## 2. Pet Management Endpoints (*Requires JWT*)

### `GET /pets/owner/{ownerId}`
**Description:** Fetch all pets belonging to a specific owner.

### `POST /pets/owner/{ownerId}`
**Description:** Add a new pet.
**Body:**
```json
{
  "name": "Luna",
  "species": "Dog",
  "breed": "Golden Retriever",
  "ageYears": 3
}
```

---

## 3. Veterinarian & Appointments (*Requires JWT*)

### `GET /vets`
**Description:** Get list of all registered veterinarians.

### `POST /appointments`
**Description:** Book a new appointment.
**Body:**
```json
{
  "owner": {"id": 1},
  "vet": {"id": 1},
  "pet": {"id": 1},
  "appointmentDate": "2026-04-10",
  "appointmentTime": "10:30:00",
  "reason": "Annual checkup"
}
```

---

## 4. E-Commerce & Payments (*Requires JWT*)

### `GET /products/category/{category}`
**Description:** Fetch products by category (`FOOD`, `TOY`, `GROOMING`, `ACCESSORY`, `MEDICINE`).

### `POST /payments/verify`
**Description:** Verifies simulated Razorpay transaction checkout.
**Body:**
```json
{
  "razorpay_payment_id": "pay_xyz123abc",
  "order_id": 42
}
```
