// Variables de estado del juego
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameOver = false;

// Marcador independiente
const score = { X: 0, O: 0, ties: 0 };

// Combinaciones posibles para ganar (Filas, Columnas y Diagonales)
const WINNING_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
    [0, 4, 8], [2, 4, 6] // Diagonales
];

// Captura de elementos del DOM
const statusEl = document.getElementById('status');
const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restart-btn');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const scoreTiesEl = document.getElementById('score-ties');

// Inicializar escuchadores de eventos
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);

function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.dataset.index);

    // Validar si la celda ya está ocupada o el juego terminó
    if (board[index] !== '' || gameOver) return;

    // Actualizar matriz interna y renderizado en pantalla
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('taken', currentPlayer === 'X' ? 'x-glow' : 'o-glow');

    // Verificar si hay un ganador o un empate
    if (checkWinner()) return;

    // Cambiar de turno si el juego continúa
    changePlayer();
}

function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    
    // Cambiar el color del texto del estado según el turno
    const colorVar = currentPlayer === 'X' ? 'var(--color-x)' : 'var(--color-o)';
    statusEl.innerHTML = `Turno de <span style="color: ${colorVar}">${currentPlayer}</span>`;
}

function checkWinner() {
    for (const combo of WINNING_COMBOS) {
        const [a, b, c] = combo;
        
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameOver = true;
            
            // Resaltar celdas ganadoras
            combo.forEach(index => cells[index].classList.add('winner-cell'));
            
            // Actualizar marcador y UI
            score[currentPlayer]++;
            updateScoreboard();
            statusEl.innerHTML = `🏆 ¡Ganó el jugador <span style="color: ${currentPlayer === 'X' ? 'var(--color-x)' : 'var(--color-o)'}">${currentPlayer}</span>!`;
            return true;
        }
    }

    // Comprobar empate si todas las celdas están llenas y no hubo ganador
    if (!board.includes('')) {
        gameOver = true;
        score.ties++;
        updateScoreboard();
        statusEl.innerHTML = `🤝 ¡Es un emocionante Empate!`;
        return true;
    }

    return false;
}

function updateScoreboard() {
    scoreXEl.textContent = score.X;
    scoreOEl.textContent = score.O;
    scoreTiesEl.textContent = score.ties;
}

function restartGame() {
    // Resetear variables lógicas
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameOver = false;

    // Restablecer interfaz por defecto
    statusEl.innerHTML = `Turno de <span style="color: var(--color-x)">X</span>`;
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell'; // Remueve las clases dinámicas (taken, x-glow, o-glow, winner-cell)
    });
}
