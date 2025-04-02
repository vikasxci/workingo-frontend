import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';
import ChatWindow from '../components/ChatWindow';
import { fetchWorkerById } from '../services/api';

const ChatPage = () => {
  const { workerId } = useParams();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadWorker = async () => {
      try {
        const { data } = await fetchWorkerById(workerId);
        setWorker(data);
      } catch (err) {
        setError('Failed to load worker details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadWorker();
  }, [workerId]);

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
      <Card>
        <Card.Header as="h5">
          Chat with {worker?.name}
        </Card.Header>
        <Card.Body>
          <ChatWindow workerId={workerId} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ChatPage;