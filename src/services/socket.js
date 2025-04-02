import { Client } from '@stomp/stompjs';

let client = null;

export const initializeSocket = (onMessageReceived) => {
  client = new Client({
    brokerURL: process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws',
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('Connected to WebSocket');
    },
  });

  return client;
};

export const subscribeToChat = (workerId, callback) => {
  if (client) {
    client.subscribe(`/topic/messages/${workerId}`, (message) => {
      callback(JSON.parse(message.body));
    });
  }
};

export const sendMessage = (workerId, message) => {
  if (client) {
    client.publish({
      destination: `/app/chat/${workerId}`,
      body: JSON.stringify(message),
    });
  }
};

export const disconnectSocket = () => {
  if (client) {
    client.deactivate();
  }
};