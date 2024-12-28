import { useEffect, useState } from 'react';

const SeatLayout = () => {
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        fetch('/api/seats')
            .then((res) => res.json())
            .then((data) => setSeats(data))
            .catch((error) => console.error('Error fetching seats:', error));
    }, []);

    const handleSelectSeat = (seatId) => {
        setSelectedSeats((prevSelectedSeats) =>
            prevSelectedSeats.includes(seatId)
                ? prevSelectedSeats.filter((id) => id !== seatId)
                : [...prevSelectedSeats, seatId]
        );
    };

    const handleBookSeats = () => {
        fetch('/api/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ seatsToBook: selectedSeats }),
        })
            .then((res) => res.json())
            .then((data) => alert(data.message))
            .catch((error) => console.error('Error booking seats:', error));
    };

    return (
        <div>
            <h1>Train Seat Layout</h1>
            <div className="seat-layout">
                {seats.map((seat) => (
                    <button
                        key={seat.id}
                        disabled={seat.is_reserved}
                        onClick={() => handleSelectSeat(seat.id)}
                        className={seat.is_reserved ? 'reserved' : 'available'}
                    >
                        {seat.seat_number}
                    </button>
                ))}
            </div>
            <button onClick={handleBookSeats}>Book Seats</button>
        </div>
    );
};

export default SeatLayout;
