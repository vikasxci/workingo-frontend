import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Spinner, Alert, Button } from 'react-bootstrap';
import WorkerCard from '../components/WorkerCard';
import MapView from '../components/MapView';
import dummyWorkers from '../data/dummyWorkers';
import '../styles/Home.css';

const Home = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ skill: '', minPrice: '', maxPrice: '', available: true });
  const [location, setLocation] = useState(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        let filteredWorkers = dummyWorkers;
        if (filters.skill) {
          filteredWorkers = filteredWorkers.filter(worker => worker.skills.toLowerCase().includes(filters.skill.toLowerCase()));
        }
        if (filters.minPrice) {
          filteredWorkers = filteredWorkers.filter(worker => worker.pricePerHour >= Number(filters.minPrice));
        }
        if (filters.maxPrice) {
          filteredWorkers = filteredWorkers.filter(worker => worker.pricePerHour <= Number(filters.maxPrice));
        }
        if (filters.available) {
          filteredWorkers = filteredWorkers.filter(worker => worker.available);
        }
        setWorkers(filteredWorkers);
      } catch (err) {
        setError('Failed to load workers');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 1000);
  }, [filters]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }, []);

  return (
    <Container fluid className="home-container">
      <div className="hero-section text-center text-white">
        <h1 className="hero-title">Find Trusted Workers Near You</h1>
        <p className="hero-subtitle">Search for skilled professionals and book them instantly.</p>
      </div>
      <Container className="py-4">
        <Form className="filter-form p-4 shadow-sm rounded">
          <Row className="g-3">
            <Col md={4}>
              <Form.Control
                className="filter-input"
                placeholder="Search by skill (e.g., Plumber, Electrician)"
                value={filters.skill}
                onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type="number"
                className="filter-input"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type="number"
                className="filter-input"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </Col>
            <Col md={2} className="d-flex align-items-center">
              <Form.Check
                type="switch"
                id="available-switch"
                label="Available Only"
                checked={filters.available}
                onChange={(e) => setFilters({ ...filters, available: e.target.checked })}
              />
            </Col>
            <Col md={2}>
              <Button variant="primary" className="w-100">Search</Button>
            </Col>
          </Row>
        </Form>
        {location && (
          <div className="map-container my-4">
            <MapView workers={workers} center={[location.latitude, location.longitude]} />
          </div>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p>Loading workers...</p>
          </div>
        ) : workers.length === 0 ? (
          <Alert variant="info">No workers found matching your criteria</Alert>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {workers.map(worker => (
              <Col key={worker.id}>
                <WorkerCard worker={worker} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </Container>
  );
};

export default Home;