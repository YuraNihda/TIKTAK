const socket = io();
const board = document.getElementById("board");
const status = document.getElementById("status");

let playerSymbol = '';
let gameBoard = Array(9).fill(null);

function createBoard() {
    board.innerHTML = '';
    gameBoard.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.textContent = cell;
        cellElement.addEventListener('click', () => handleCellClick(index));
        board.appendChild(cellElement);
    });
}

function handleCellClick(index) {
    if (gameBoard[index] || playerSymbol === '') return;
    
    socket.emit('makeMove', index);
}

socket.on('updateBoard', (boardState) => {
    gameBoard = boardState;
    createBoard();
});

socket.on('playerAssigned', (symbol) => {
    playerSymbol = symbol;
    status.textContent = `Ваш символ: ${playerSymbol}`;
});

socket.on('gameOver', (message) => {
    status.textContent = message;
    gameBoard = Array(9).fill(null); // Reset the board after game over
    createBoard();
});

createBoard();
