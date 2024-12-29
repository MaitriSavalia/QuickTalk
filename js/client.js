// Make sure you have included the Socket.io client library in your HTML
// <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>

const socket = io('http://localhost:8000', {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5
});

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

var audio = new Audio('ting.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
    if(position === 'left') {
        console.log('sound is playing');
        audio.play();
    }
}

// Add connection status handling
socket.on('connect', () => {
    console.log('Connected to server');
    // Only prompt for name after connection is established
    const name = prompt("Enter your name to join Chat");
    if (name) {
        socket.emit('new-user-joined', name);
    }
});

socket.on('connect_error', (error) => {
    console.log('Connection error:', error);
    append('Unable to connect to chat server', 'left');
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
});

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
    append(`${name} left the chat`, 'left');
});