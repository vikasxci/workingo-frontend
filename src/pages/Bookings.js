import React, { useState, useEffect } from 'react';
import { Container, Table, Alert, Spinner, Button } from 'react-bootstrap';
import { getBookings } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const { data } = await getBookings();
        setBookings(data);
      } catch (err) {
        setError('Failed to load bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">My Bookings</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading your bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <Alert variant="info">
          You don't have any bookings yet. <Button variant="link" onClick={() => navigate('/')}>Find workers</Button>
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Worker</th>
              <th>Service</th>
              <th>Date & Time</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>
                  <Button 
                    variant="link" 
                    onClick={() => navigate(`/workers/${booking.worker.id}`)}
                  >
                    {booking.worker.name}
                  </Button>
                </td>
                <td>{booking.worker.skills}</td>
                <td>{formatDate(booking.startTime)}</td>
                <td>
                  {Math.ceil(
                    (new Date(booking.endTime) - new Date(booking.startTime)) / (1000 * 60 * 60)
                  )} hours
                </td>
                <td>
                  <span className={`badge bg-${
                    booking.status === 'CONFIRMED' ? 'success' :
                    booking.status === 'PENDING' ? 'warning' :
                    booking.status === 'CANCELLED' ? 'danger' : 'info'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td>
                  ₹{Math.ceil(
                    (new Date(booking.endTime) - new Date(booking.startTime)) / (1000 * 60 * 60) * booking.worker.pricePerHour
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Bookings;