const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server started on port 8080');

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received position:', data);

      if (isValidPosition(data)) {
        const response = {
          status: 'valid',
          message: `Position received: (${data.x}, ${data.y})`,
          position: data
        };
        ws.send(JSON.stringify(response));
      } else {
        const response = {
          status: 'invalid',
          message: 'Invalid position'
        };
        ws.send(JSON.stringify(response));
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const response = {
        status: 'error',
        message: 'Error processing message'
      };
      ws.send(JSON.stringify(response));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  const welcomeMessage = {
    status: 'info',
    message: 'Connected to position server'
  };
  ws.send(JSON.stringify(welcomeMessage));
});

function isValidPosition(position) {
  if (position && 
      typeof position.x === 'number' && 
      typeof position.y === 'number' &&
      !isNaN(position.x) && 
      !isNaN(position.y)) {
    return true;
  }
  return false;
}