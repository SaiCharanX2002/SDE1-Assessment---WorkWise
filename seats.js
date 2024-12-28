import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'train_seat_booking',
    password: 'password',
    port: 5432,
});

export default async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM seats ORDER BY row_number, seat_number');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching seats' });
    }
};
