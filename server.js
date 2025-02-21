const { Server } = require('socket.io');
const io = new Server();

let players = {};
let gameState = ['', '', '', '', '', '', '', '', ''];

exports.handler = async (event, context) => {
    io.on('connection', (socket) => {
        console.log('New player connected:', socket.id);

        if (Object.keys(players).length < 2) {
            const playerSymbol = Object.keys(players).length === 0 ? 'X' : 'O';
            players[socket.id] = playerSymbol;
            socket.emit('playerAssignment', playerSymbol);

            if (Object.keys(players).length === 2) {
                io.emit('move', { index: null, player: null }); // Signal game start
            }
        } else {
            socket.emit('status', 'Game is full!');
            socket.disconnect();
            return;
        }

        socket.on('move', ({ index, player }) => {
            if (gameState[index] === '' && players[socket.id] === player) {
                gameState[index] = player;
                io.emit('move', { index, player });
            }
        });

        socket.on('reset', () => {
            gameState = ['', '', '', '', '', '', '', '', ''];
            io.emit('reset');
        });

        socket.on('disconnect', () => {
            delete players[socket.id];
            gameState = ['', '', '', '', '', '', '', '', ''];
            io.emit('status', 'Opponent disconnected. Waiting for another player...');
        });
    });

    // Netlify Functions need an HTTP response
    return {
        statusCode: 200,
        body: 'Socket.IO server running'
    };
};

// Attach Socket.IO to the Netlify function's serverless HTTP handling
exports.io = io;
