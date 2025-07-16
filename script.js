document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const board = document.getElementById('board');
    const statusDisplay = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const replayButton = document.getElementById('replay');
    const newGameButton = document.getElementById('new-game');
    const scoreXDisplay = document.getElementById('score-x');
    const scoreODisplay = document.getElementById('score-o');
    const playerXScoreboard = document.getElementById('playerX-score');
    const playerOScoreboard = document.getElementById('playerO-score');
    const canvas = document.getElementById('winning-line-canvas');
    const ctx = canvas.getContext('2d');

    // --- Game State Variables ---
    let currentPlayer = 'X';
    let gameBoard = Array(9).fill('');
    let gameActive = true;
    let scores = { X: 0, O: 0 };
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // --- Game Initialization ---
    function initGame() {
        gameBoard = Array(9).fill('');
        gameActive = true;
        // The loser of the last round starts the next one, or X if it's a draw/new game
        currentPlayer = currentPlayer === 'X' ? 'X' : 'O';

        // Clear board UI
        board.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.dataset.index = i;
            cell.className = 'cell';
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
        
        updateStatus();
        hideModal();
        clearWinningLine();
    }

    function startNewGame() {
        scores = { X: 0, O: 0 };
        currentPlayer = 'X';
        updateScoreboard();
        initGame();
    }
    
    // --- UI Updates ---
    function updateStatus() {
        if (gameActive) {
            statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
            if (currentPlayer === 'X') {
                playerXScoreboard.classList.remove('inactive');
                playerOScoreboard.classList.add('inactive');
            } else {
                playerOScoreboard.classList.remove('inactive');
                playerXScoreboard.classList.add('inactive');
            }
        }
    }

    function updateScoreboard() {
        scoreXDisplay.textContent = scores.X;
        scoreODisplay.textContent = scores.O;
    }

    // --- Game Logic ---
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        gameBoard[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer === 'X' ? 'text-x' : 'text-o');
        
        checkForWinner();
    }

    function checkForWinner() {
        let roundWon = false;
        let winningLine = null;

        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            const [a, b, c] = winCondition;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                roundWon = true;
                winningLine = winCondition;
                break;
            }
        }

        if (roundWon) {
            endGame(false, winningLine);
            return;
        }

        if (!gameBoard.includes('')) {
            endGame(true);
            return;
        }

        switchPlayer();
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
    }

    // --- End Game ---
    function endGame(draw, winningLine = null) {
        gameActive = false;
        statusDisplay.textContent = 'Round Over';
        playerXScoreboard.classList.remove('inactive');
        playerOScoreboard.classList.remove('inactive');

        if (draw) {
            modalMessage.textContent = 'It\'s a Draw!';
            modalSubtitle.textContent = 'A hard-fought battle with no winner.';
        } else {
            scores[currentPlayer]++;
            updateScoreboard();
            drawWinningLine(winningLine);
            
            if (scores.X >= 3 || scores.O >= 3) {
                 modalMessage.textContent = `Player ${currentPlayer} Wins the Match!`;
                 modalSubtitle.textContent = `Congratulations! A true champion.`;
            } else {
                 modalMessage.textContent = `Player ${currentPlayer} Wins the Round!`;
                 modalSubtitle.textContent = `The score is now ${scores.X} - ${scores.O}.`;
            }
        }
        
        setTimeout(showModal, winningLine ? 1000 : 500);
    }

    // --- Modal Handling ---
    function showModal() {
        modal.classList.remove('hidden');
    }

    function hideModal() {
        modal.classList.add('hidden');
    }
    
    // --- Winning Line Canvas ---
    function resizeCanvas() {
        const boardRect = board.getBoundingClientRect();
        canvas.width = boardRect.width;
        canvas.height = boardRect.height;
    }

    function drawWinningLine(condition) {
        if (!condition) return;
        
        resizeCanvas();

        const cells = document.querySelectorAll('.cell');
        const startCell = cells[condition[0]];
        const endCell = cells[condition[2]];

        const startX = startCell.offsetLeft + startCell.offsetWidth / 2;
        const startY = startCell.offsetTop + startCell.offsetHeight / 2;
        const endX = endCell.offsetLeft + endCell.offsetWidth / 2;
        const endY = endCell.offsetTop + endCell.offsetHeight / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#FFD700'; // Gold color for the line
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 15;
        ctx.stroke();
    }

    function clearWinningLine() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // --- Event Listeners ---
    resetButton.addEventListener('click', initGame);
    replayButton.addEventListener('click', () => {
        // If a match was just won, this button starts a new game
        if (scores.X >= 3 || scores.O >= 3) {
            startNewGame();
        } else {
            initGame();
        }
    });
    newGameButton.addEventListener('click', startNewGame);
    window.addEventListener('resize', resizeCanvas);

    // --- Initial Call ---
    startNewGame();
});
