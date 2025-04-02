import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner, Tab, Tabs } from 'react-bootstrap';
import { fetchWorkerById, createBooking } from '../services/api';
import BookingModal from '../components/BookingModal';
import ChatWindow from '../components/ChatWindow';
import workerimg from '../images/worker.jpg'
const WorkerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const loadWorker = async () => {
      try {
        // const { data } = await fetchWorkerById(id);
        // setWorker(data);
        setWorker({
          id,
          name: "Ramesh Kumar",
          skills: "Electrician",
          pricePerHour: 300,
          rating: 4.5,
          photoUrl: workerimg,
          description: "Experienced electrician with 5+ years in repairing and installations.",
          available: true,
          reviews: [
            {
              id: 1,
              userName: "Amit Verma",
              rating: 5,
              comment: "Very professional and skilled in his work."
            },
            {
              id: 2,
              userName: "Priya Sharma",
              rating: 4,
              comment: "Good work, but arrived late."
            }
          ]
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load worker details, showing dummy data.');

        // Dummy Worker Data
       

        setError('');
      } finally {
        setLoading(false);
      }
    };
    loadWorker();
  }, [id]);

  const handleBookingSuccess = () => {
    navigate('/bookings');
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-3">
        Back to List
      </Button>

      {worker && (
        <>
          <Row className="mb-4">
            <Col md={4}>
              <Card.Img 
                variant="top" 
                src={worker.photoUrl || '/default-worker.jpg'} 
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            </Col>
            <Col md={8}>
              <Card>
                <Card.Body>
                  <Card.Title as="h2">{worker.name}</Card.Title>
                  <Card.Subtitle className="mb-3 text-muted">{worker.skills}</Card.Subtitle>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <div>
                      <span className="fs-4">₹{worker.pricePerHour}</span>
                      <span className="text-muted"> / hour</span>
                    </div>
                    <div>
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`bi bi-star${i < Math.floor(worker.rating) ? '-fill' : ''} text-warning fs-4`}
                        />
                      ))}
                      <span className="ms-2 fs-5">{worker.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-100 mb-3"
                    onClick={() => setShowBookingModal(true)}
                  >
                    Book Now
                  </Button>

                  <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k)}
                    className="mb-3"
                  >
                    <Tab eventKey="details" title="Details">
                      <div className="mt-3">
                        <h5>About</h5>
                        <p>{worker.description || 'No description provided.'}</p>
                        
                        <h5 className="mt-4">Availability</h5>
                        <p>{worker.available ? 'Available for bookings' : 'Currently not available'}</p>
                      </div>
                    </Tab>
                    <Tab eventKey="reviews" title="Reviews">
                      <div className="mt-3">
                        {worker.reviews && worker.reviews.length > 0 ? (
                          worker.reviews.map(review => (
                            <div key={review.id} className="mb-3 p-3 border rounded">
                              <div className="d-flex justify-content-between">
                                <strong>{review.userName}</strong>
                                <div>
                                  {[...Array(5)].map((_, i) => (
                                    <i 
                                      key={i} 
                                      className={`bi bi-star${i < review.rating ? '-fill' : ''} text-warning`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="mt-2 mb-0">{review.comment}</p>
                            </div>
                          ))
                        ) : (
                          <p>No reviews yet.</p>
                        )}
                      </div>
                    </Tab>
                    <Tab eventKey="chat" title="Chat">
                      <div className="mt-3">
                        {/* <ChatWindow workerId={worker.id} /> */}
                      </div>
                    </Tab>
                  </Tabs>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <BookingModal
            show={showBookingModal}
            worker={worker}
            onHide={() => setShowBookingModal(false)}
            onSuccess={handleBookingSuccess}
          />
        </>
      )}
    </Container>
  );
};

export default WorkerDetail;