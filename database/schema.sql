-- ==========================================
-- SMART PET CARE PLATFORM V2 - DATABASE SCHEMA
-- ==========================================

-- Clean previous runs
DROP TABLE IF EXISTS help_support CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS health_metrics CASCADE;
DROP TABLE IF EXISTS health_alerts CASCADE;
DROP TABLE IF EXISTS vaccinations CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS medical_records CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS vet_slots CASCADE;
DROP TABLE IF EXISTS vet_profiles CASCADE;
DROP TABLE IF EXISTS pets CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS email_verifications CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Layer
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('OWNER', 'VET', 'ADMIN')),
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE email_verifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expiry_date TIMESTAMP NOT NULL
);

CREATE TABLE user_profiles (
    profile_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    profile_image_url TEXT
);

-- 2. Owner & Pets Layer
CREATE TABLE pets (
    pet_id SERIAL PRIMARY KEY,
    owner_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    age_years DECIMAL(4,1),
    gender VARCHAR(10),
    weight_kg DECIMAL(5,2),
    image_url TEXT,
    blood_group VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Veterinarian Layer
CREATE TABLE vet_profiles (
    vet_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE UNIQUE,
    specialization VARCHAR(150) NOT NULL,
    experience_years INT,
    clinic_name VARCHAR(150),
    clinic_address TEXT,
    consultation_fee DECIMAL(10,2) NOT NULL,
    document_proof_url TEXT,
    is_verified_by_admin BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0.0
);

CREATE TABLE vet_slots (
    slot_id SERIAL PRIMARY KEY,
    vet_id INT REFERENCES vet_profiles(vet_id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE
);

-- 4. Clinical Layer
CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    owner_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    vet_id INT REFERENCES vet_profiles(vet_id) ON DELETE CASCADE,
    pet_id INT REFERENCES pets(pet_id) ON DELETE CASCADE,
    slot_id INT REFERENCES vet_slots(slot_id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED', 'REJECTED')),
    reason_for_visit TEXT,
    consultation_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medical_records (
    record_id SERIAL PRIMARY KEY,
    pet_id INT REFERENCES pets(pet_id) ON DELETE CASCADE,
    vet_id INT REFERENCES vet_profiles(vet_id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL,
    diagnosis TEXT,
    treatment_plan TEXT,
    document_url TEXT,
    date_recorded TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prescriptions (
    prescription_id SERIAL PRIMARY KEY,
    medical_record_id INT REFERENCES medical_records(record_id) ON DELETE CASCADE,
    appointment_id INT REFERENCES appointments(appointment_id) ON DELETE SET NULL,
    medicine_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(100),
    duration_days INT,
    instructions TEXT,
    document_url TEXT
);

CREATE TABLE vaccinations (
    vaccine_id SERIAL PRIMARY KEY,
    pet_id INT REFERENCES pets(pet_id) ON DELETE CASCADE,
    vaccine_name VARCHAR(150) NOT NULL,
    date_administered DATE NOT NULL,
    next_due_date DATE,
    certificate_url TEXT
);

-- 5. AI & Health Monitoring
CREATE TABLE health_metrics (
    metric_id SERIAL PRIMARY KEY,
    pet_id INT REFERENCES pets(pet_id) ON DELETE CASCADE,
    recorded_date DATE NOT NULL,
    weight_kg DECIMAL(5,2),
    temperature_celsius DECIMAL(4,1),
    heart_rate_bpm INT,
    notes TEXT
);

CREATE TABLE health_alerts (
    alert_id SERIAL PRIMARY KEY,
    pet_id INT REFERENCES pets(pet_id) ON DELETE CASCADE,
    alert_type VARCHAR(50), -- VACCINE_DUE, ABNORMAL_WEIGHT, MEDICATION_REMINDER
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Marketplace Layer
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('FOOD', 'TOY', 'GROOMING', 'ACCESSORY', 'MEDICINE')),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    image_url TEXT,
    rating DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart (
    cart_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE UNIQUE
);

CREATE TABLE cart_items (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INT REFERENCES cart(cart_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INT DEFAULT 1 CHECK (quantity > 0)
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
    shipping_address TEXT NOT NULL,
    razorpay_order_id VARCHAR(100),
    invoice_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10,2) NOT NULL
);

-- 7. Payment System
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    reference_id INT NOT NULL, -- logical ref to order_id or appointment_id depending on type
    payment_type VARCHAR(20) CHECK (payment_type IN ('ORDER', 'APPOINTMENT')),
    amount DECIMAL(10,2) NOT NULL,
    razorpay_payment_id VARCHAR(100) UNIQUE,
    razorpay_signature VARCHAR(255),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Support & Community
CREATE TABLE feedback (
    feedback_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    target_id INT NOT NULL, -- references product_id or vet_profile_id
    feedback_type VARCHAR(20) CHECK (feedback_type IN ('PRODUCT', 'VET', 'SYSTEM')),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE help_support (
    ticket_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    admin_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
