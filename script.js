document.addEventListener('DOMContentLoaded', () => {
    // Game state variables
    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    
    // DOM elements
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const replayButton = document.getElementById('replay');
    
    // Winning conditions (indices of cells)
    const winningConditions = [
        [0, 1, 2], // top row
        [3, 4, 5], // middle row
        [6, 7, 8], // bottom row
        [0, 3, 6], // left column
        [1, 4, 7], // middle column
        [2, 5, 8], // right column
        [0, 4, 8], // diagonal top-left to bottom-right
        [2, 4, 6]  // diagonal top-right to bottom-left
    ];
    
    // Initialize the game
    function initGame() {
        currentPlayer = 'X';
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        
        // Clear all cells
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning-cell');
        });
        
        // Hide modal if visible
        modal.style.display = 'none';
    }
    
    // Handle cell click
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        // If cell already filled or game not active, ignore click
        if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
        
        // Update game state
        gameBoard[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        
        // Check for win or draw
        if (checkWin()) {
            endGame(false);
            return;
        }
        
        if (checkDraw()) {
            endGame(true);
            return;
        }
        
        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    }
    
    // Check for win
    function checkWin() {
        return winningConditions.some(condition => {
            const [a, b, c] = condition;
            
            // Check if all three cells in the condition are filled by the same player
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                // Highlight winning cells
                condition.forEach(index => {
                    cells[index].classList.add('winning-cell');
                });
                return true;
            }
            return false;
        });
    }
    
    // Check for draw
    function checkDraw() {
        return gameBoard.every(cell => cell !== '');
    }
    
    // End the game
    function endGame(draw) {
        gameActive = false;
        
        if (draw) {
            modalMessage.textContent = 'Game ended in a draw!';
        } else {
            modalMessage.textContent = `Player ${currentPlayer} wins!`;
        }
        
        // Show modal
        modal.style.display = 'flex';
    }
    
    // Event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    resetButton.addEventListener('click', initGame);
    replayButton.addEventListener('click', initGame);
    
    // Initialize the game on load
    initGame();
});