// Variables iniciales: tablero vacío, turno inicial y estado de la partida
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameOver = false;

// Objeto para guardar las puntuaciones a medida que juegan
const score = { X: 0, O: 0, ties: 0 };

// Lista de las posiciones necesarias para hacer 3 en raya
const WINNING_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
    [0, 4, 8], [2, 4, 6] // Diagonales
];

// Capturamos los elementos de HTML que vamos a modificar
const statusEl = document.getElementById('status');
const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restart-btn');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const scoreTiesEl = document.getElementById('score-ties');

// Le decimos a cada celda y al botón qué hacer al hacerles clic
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);

// Esta función se activa cuando alguien toca una casilla
function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.dataset.index); // Sacamos el número de la casilla tocada

    // Si la celda ya tiene una letra o el juego terminó, ignoramos el clic
    if (board[index] !== '' || gameOver) return;

    // Registramos la jugada y le ponemos color a la letra ('x-glow' u 'o-glow')
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('taken', currentPlayer === 'X' ? 'x-glow' : 'o-glow');

    // Revisamos si alguien ganó con este último movimiento
    if (checkWinner()) return;

    // Si nadie ganó, cambiamos de jugador
    changePlayer();
}

// Alterna los turnos entre la X y la O
function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    
    // Cambiamos el texto y el color para que sepa de quién es el turno
    const colorVar = currentPlayer === 'X' ? 'var(--color-x)' : 'var(--color-o)';
    statusEl.innerHTML = `Turno de <span style="color: ${colorVar}">${currentPlayer}</span>`;
}

// Analiza si hay victoria o empate
function checkWinner() {
    for (const combo of WINNING_COMBOS) {
        const [a, b, c] = combo;
        
        // Si las tres posiciones de una combinación tienen la misma letra
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameOver = true;
            
            // Iluminamos de verde las casillas ganadoras
            combo.forEach(index => cells[index].classList.add('winner-cell'));
            
            // Sumamos 1 punto al ganador y actualizamos la pantalla
            score[currentPlayer]++;
            updateScoreboard();
            statusEl.innerHTML = `🏆 ¡Ganó el jugador <span style="color: ${currentPlayer === 'X' ? 'var(--color-x)' : 'var(--color-o)'}">${currentPlayer}</span>!`;
            return true;
        }
    }

    // Si no quedan espacios vacíos y nadie ganó, decretamos empate
    if (!board.includes('')) {
        gameOver = true;
        score.ties++;
        updateScoreboard();
        statusEl.innerHTML = `🤝 ¡Es un emocionante Empate!`;
        return true;
    }

    return false;
}

// Refleja los puntos almacenados en el HTML
function updateScoreboard() {
    scoreXEl.textContent = score.X;
    scoreOEl.textContent = score.O;
    scoreTiesEl.textContent = score.ties;
}

// Limpia el tablero y resetea variables para jugar otra vez
function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameOver = false;

    statusEl.innerHTML = `Turno de <span style="color: var(--color-x)">X</span>`;
    
    // Borramos el contenido y las clases visuales de todas las casillas
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell'; 
    });
}