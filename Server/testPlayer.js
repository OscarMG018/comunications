const WebSocket = require('ws')

const socket = new WebSocket('wss://omedinagalvez.ieti.site:443');

socket.addEventListener('open', (event) => {
    console.log('Connected to WebSocket server');
});
socket.addEventListener('message', (event) => {
});
socket.addEventListener('error', (event) => {
    console.error('WebSocket error:', event);
});
socket.addEventListener('close', (event) => {
    console.log('Disconnected from WebSocket server');
});
