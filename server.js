const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Вказуємо, що статичні файли знаходяться в папці "public"
app.use(express.static('public'));

let gameBoard = Array(9).fill(null);
let currentPlayer = 'X';
let players = [];

io.on('connection', (socket) => {
    console.log('A user connected');
    
    if (players.length < 2) {
        players.push(socket);
        socket.emit('playerAssigned', currentPlayer);
        
        if (players.length === 2) {
            io.emit('updateBoard', gameBoard);
        }
    } else {
        socket.emit('gameOver', 'Гра вже почалась!');
    }

    socket.on('makeMove', (index) => {
        if (gameBoard[index] === null) {
            gameBoard[index] = currentPlayer;
            const winner = checkWinner(gameBoard);
            io.emit('updateBoard', gameBoard);
            
            if (winner) {
                io.emit('gameOver', `${winner} виграв!`);
                gameBoard = Array(9).fill(null);
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        players = players.filter(player => player !== socket);
    });
});

function checkWinner(board) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

// Запускаємо сервер на порту 3000
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
