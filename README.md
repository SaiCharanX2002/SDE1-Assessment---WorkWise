# Train Seat Booking System

## Description
The Train Seat Booking System is a web application that allows users to book train seats. The system supports user authentication (signup/login), seat reservation, and seat availability checks. Users can reserve seats in a train coach with a layout that includes 7 seats per row (except for the last row, which has 3 seats). This system ensures that users cannot double-book seats, and reservations are handled based on available seats in the rows.

## Tech Stack
- **Frontend**: Next.js (React-based framework)
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Styling**: Custom CSS (optional use of CSS frameworks like Tailwind or Bootstrap)
- **Deployment**: Vercel (Frontend), Heroku/AWS (Backend), PostgreSQL (Cloud Database)

## Features
- **User Authentication**: Allows users to sign up, log in, and manage their bookings.
- **Seat Reservation**: Users can book up to 7 seats, and the system ensures seats are reserved in the same row or nearby.
- **Seat Availability**: Seats are marked as reserved, and no user can double-book the same seat.
- **Responsive UI**: The train seat layout is responsive and works on all screen sizes.
  
## Database Schema

### Users Table:
- **id**: User ID (Primary Key)
- **username**: Username for the user
- **email**: User email (Unique)
- **password**: User password (hashed)

### Seats Table:
- **id**: Seat ID (Primary Key)
- **row_number**: Row number of the seat (e.g., 1, 2, 3...)
- **seat_number**: Seat number in that row (e.g., 1, 2, 3, etc.)
- **is_reserved**: A boolean indicating if the seat is reserved
- **reserved_by**: The ID of the user who reserved the seat

### Bookings Table:
- **id**: Booking ID (Primary Key)
- **user_id**: The ID of the user who made the booking (Foreign Key to users table)
- **seat_ids**: Array of seat IDs reserved by the user
- **booking_time**: Timestamp when the booking was made

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd train-seat-booking
