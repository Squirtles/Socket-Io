const socket = io('/.netlify/functions/server');
const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetButton = document.getElementById('reset');
let currentPlayer = null;
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('playerAssignment', (player) => {
    currentPlayer = player;
    status.textContent = player === 'X' ? 'You are X. Your turn!' : 'You are O. Waiting for X...';
    gameActive = true;
});

socket.on('move', ({ index, player }) => {
    gameBoard[index] = player;
    cells[index].textContent = player;
    checkWin();
    if (gameActive) {
        status.textContent = currentPlayer === player ? 'Waiting for opponent...' : `Your turn (${currentPlayer})!`;
    }
});

socket.on('reset', () => {
    resetGame();
});

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.getAttribute('data-index');
        if (gameBoard[index] === '' && gameActive && status.textContent.includes('Your turn')) {
            socket.emit('move', { index: parseInt(index), player: currentPlayer });
        }
    });
});

resetButton.addEventListener('click', () => {
    socket.emit('reset');
});

function checkWin() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]            // Diagonals
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            status.textContent = `${gameBoard[a]} wins!`;
            gameActive = false;
            resetButton.style.display = 'block';
            return;
        }
    }

    if (!gameBoard.includes('')) {
        status.textContent = 'It\'s a tie!';
        gameActive = false;
        resetButton.style.display = 'block';
    }
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => (cell.textContent = ''));
    status.textContent = currentPlayer === 'X' ? 'You are X. Your turn!' : 'You are O. Waiting for X...';
    gameActive = true;
    resetButton.style.display = 'none';
}
