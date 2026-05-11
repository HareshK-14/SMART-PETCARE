# Smart Pet Care Platform - Installation Guide

## Prerequisites
- **Java 17+**
- **Maven 3.8+**
- **Node.js 18+**
- **PostgreSQL 14+**

---

## Step 1: Database Setup
1. Open pgAdmin or `psql` command line.
2. Create a database named `petcare`:
   ```sql
   CREATE DATABASE petcare;
   ```
3. Run the SQL schema script provided in `database/schema.sql` to generate tables.

## Step 2: Backend Setup
1. Open terminal and navigate: `cd backend`
2. Verify application.properties: Make sure `spring.datasource.password` matches your local postgres root password inside `backend/src/main/resources/application.properties`.
3. Install dependencies and build:
   ```bash
   ./mvnw clean install
   ```
4. Run the Spring Boot App:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The server will start on port `8080`.*

## Step 3: Frontend Setup
1. Open a new terminal and navigate: `cd frontend`
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The UI will usually run on `http://localhost:5173/`.*
