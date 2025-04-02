import React, { useState, useEffect, useRef } from 'react';
import { ListGroup, Form, Button, InputGroup } from 'react-bootstrap';
import { initializeSocket, subscribeToChat, sendMessage } from '../services/socket';

const ChatWindow = ({ workerId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const client = initializeSocket();
    
    subscribeToChat(workerId, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });

    return () => {
      client.deactivate();
    };
  }, [workerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(workerId, {
        content: message,
        sender: 'user',
        timestamp: new Date().toISOString()
      });
      setMessage('');
    }
  };

  return (
    <div style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
      <ListGroup variant="flush" style={{ flex: 1, overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <ListGroup.Item 
            key={index} 
            className={msg.sender === 'user' ? 'text-end' : 'text-start'}
          >
            <div className="d-flex flex-column">
              <small className="text-muted">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </small>
              <div>{msg.content}</div>
            </div>
          </ListGroup.Item>
        ))}
        <div ref={messagesEndRef} />
      </ListGroup>
      <Form onSubmit={handleSubmit} className="mt-2">
        <InputGroup>
          <Form.Control
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <Button variant="primary" type="submit">
            Send
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default ChatWindow;