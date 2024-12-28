-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Seats Table
CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    row_number INT NOT NULL,
    seat_number INT NOT NULL,
    is_reserved BOOLEAN DEFAULT FALSE,
    reserved_by INT REFERENCES users(id)
);

-- Bookings Table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    seat_ids INT[] NOT NULL,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
