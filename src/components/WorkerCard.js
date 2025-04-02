import React, { useState } from 'react';
import { Card, Button, Badge, Modal, Form,Tab,Tabs } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/WorkerCard.css';
import workerimg from '../images/worker.jpg';
const WorkerCard = ({ worker }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingType, setBookingType] = useState('direct'); // 'direct' or 'bid'
  const [bidAmount, setBidAmount] = useState(worker.pricePerHour);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleBidSubmit = (e) => {
    e.preventDefault();
    // Handle bid submission
    console.log({
      workerId: worker.id,
      startTime,
      endTime,
      bidAmount,
      isBid: true
    });
    setShowBookingModal(false);
  };

  const handleDirectBook = (e) => {
    e.preventDefault();
    // Handle direct booking
    console.log({
      workerId: worker.id,
      startTime,
      endTime,
      price: worker.pricePerHour,
      isBid: false
    });
    setShowBookingModal(false);
  };

  return (
    <>
      <Card className="h-100 shadow-sm">
        <Card.Img 
          variant="top" 
          src={workerimg|| '/default-worker.jpg'} 
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title>{worker.name}</Card.Title>
          <Badge bg="primary" className="mb-2 align-self-start">{worker.skills}</Badge>
          <div className="mb-2">
            <strong>₹{worker.pricePerHour}</strong> per hour
          </div>
          <div className="mb-3">
            {[...Array(5)].map((_, i) => (
              <i 
                key={i} 
                className={`bi bi-star${i < Math.floor(worker.rating) ? '-fill' : ''} text-warning`}
              />
            ))}
            <span className="ms-2">{worker.rating.toFixed(1)}</span>
          </div>
          <div className="mt-auto">
            <Button 
              variant="primary" 
              className="w-100"
              onClick={() => setShowBookingModal(true)}
            >
              Book Now
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Booking Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book {worker.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            activeKey={bookingType}
            onSelect={(k) => setBookingType(k)}
            className="mb-3"
          >
            <Tab eventKey="direct" title="Direct Book">
              <Form onSubmit={handleDirectBook}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </Form.Group>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span>Fixed Price:</span>
                  <span className="fs-5">₹{worker.pricePerHour}/hour</span>
                </div>
                <Button variant="primary" type="submit" className="w-100">
                  Confirm Booking
                </Button>
              </Form>
            </Tab>
            <Tab eventKey="bid" title="Place Bid">
              <Form onSubmit={handleBidSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Your Bid Amount (₹/hour)</Form.Label>
                  <Form.Control
                    type="number"
                    min={worker.minBid || worker.pricePerHour * 0.8}
                    max={worker.pricePerHour * 2}
                    step="50"
                    required
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Current price: ₹{worker.pricePerHour}/hour
                  </Form.Text>
                </Form.Group>
                <Button variant="warning" type="submit" className="w-100">
                  Place Bid
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WorkerCard;