const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const port = 5000;

// Database Connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'train_seat_booking',
    password: 'password',
    port: 5432
});

app.use(cors());
app.use(bodyParser.json());

// Utility function to authenticate the user
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send('Access denied');
    }
    jwt.verify(token, 'secretKey', (err, decoded) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }
        req.user = decoded;
        next();
    });
};

// User signup route
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
            [username, email, hashedPassword]
        );
        res.status(201).send({ userId: result.rows[0].id });
    } catch (err) {
        res.status(500).send('Error during signup');
    }
});

// User login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).send('User not found');
        }
        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).send('Incorrect password');
        }
        const token = jwt.sign({ userId: user.id }, 'secretKey', { expiresIn: '1h' });
        res.status(200).send({ token });
    } catch (err) {
        res.status(500).send('Error during login');
    }
});

// Check seat availability
const checkSeatsAvailability = async (seatsToBook) => {
    const query = `
        SELECT * FROM seats WHERE id = ANY($1) AND is_reserved = FALSE
    `;
    const result = await pool.query(query, [seatsToBook]);
    return result.rows.length === seatsToBook.length;
};

// Book seats
app.post('/api/book', authenticate, async (req, res) => {
    const { seatsToBook } = req.body;
    const { userId } = req.user;
    
    try {
        const available = await checkSeatsAvailability(seatsToBook);
        if (!available) {
            return res.status(400).send('Some or all seats are already reserved');
        }
        
        // Reserve seats
        await pool.query(
            'UPDATE seats SET is_reserved = TRUE, reserved_by = $1 WHERE id = ANY($2)',
            [userId, seatsToBook]
        );
        
        // Create booking record
        await pool.query(
            'INSERT INTO bookings (user_id, seat_ids) VALUES ($1, $2)',
            [userId, seatsToBook]
        );
        
        res.status(200).send('Seats successfully booked');
    } catch (err) {
        res.status(500).send('Error while booking seats');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
