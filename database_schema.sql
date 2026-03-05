-- GlowKin Database Schema (PostgreSQL)
-- Optimized for a Beauty Marketplace in Kinshasa

-- 1. Enums for type safety
CREATE TYPE user_role AS ENUM ('client', 'professional', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'success', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('cash', 'm_pesa', 'orange_money', 'airtel_money');

-- 2. Core Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL, -- Primary login method
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role user_role NOT NULL DEFAULT 'client',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Professional Profiles (Extended info for Pros)
CREATE TABLE professionals (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    is_verified BOOLEAN DEFAULT false,
    verification_date TIMESTAMP WITH TIME ZONE,
    id_card_url TEXT, -- For admin validation
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    location_lat DECIMAL(9,6),
    location_lng DECIMAL(9,6),
    address_summary TEXT, -- e.g. "Gombe, Kinshasa"
    commission_rate DECIMAL(5,2) DEFAULT 20.00, -- Default 20%
    is_premium BOOLEAN DEFAULT false
);

-- 4. Services & Categories
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    icon_name VARCHAR(50), -- Lucide icon key
    display_order INTEGER DEFAULT 0
);

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(12,2) NOT NULL -- In Congolese Francs (FC)
);

-- 5. Professional's Catalog (Custom prices per Pro)
CREATE TABLE pro_services (
    pro_id UUID REFERENCES professionals(user_id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    custom_price DECIMAL(12,2), -- Pros can set their own price
    duration_minutes INTEGER DEFAULT 60,
    PRIMARY KEY (pro_id, service_id)
);

-- 6. Portfolio Images
CREATE TABLE portfolio_images (
    id SERIAL PRIMARY KEY,
    pro_id UUID REFERENCES professionals(user_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Availability (Weekly Schedule)
CREATE TABLE availability (
    id SERIAL PRIMARY KEY,
    pro_id UUID REFERENCES professionals(user_id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    UNIQUE(pro_id, day_of_week)
);

-- 8. Bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES users(id),
    pro_id UUID REFERENCES users(id),
    service_id INTEGER REFERENCES services(id),
    status booking_status DEFAULT 'pending',
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    commission_amount DECIMAL(12,2) NOT NULL,
    location_lat DECIMAL(9,6) NOT NULL,
    location_lng DECIMAL(9,6) NOT NULL,
    address_details TEXT,
    payment_method payment_method NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Reviews
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    booking_id UUID UNIQUE REFERENCES bookings(id),
    client_id UUID REFERENCES users(id),
    pro_id UUID REFERENCES users(id),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Payments Tracking
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    amount DECIMAL(12,2) NOT NULL,
    status payment_status DEFAULT 'pending',
    method payment_method NOT NULL,
    external_transaction_id VARCHAR(100), -- ID from M-Pesa/Orange
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Admin Commissions & Payouts
CREATE TABLE payouts (
    id SERIAL PRIMARY KEY,
    pro_id UUID REFERENCES professionals(user_id),
    amount DECIMAL(12,2) NOT NULL,
    payout_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status payment_status DEFAULT 'success'
);

-- Indices for performance
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_bookings_pro_status ON bookings(pro_id, status);
CREATE INDEX idx_bookings_scheduled ON bookings(scheduled_at);
CREATE INDEX idx_pro_location ON professionals(location_lat, location_lng);
