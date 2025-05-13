// Display Controller Module
const displayController = (() => {
    const boardElement = document.querySelector("#gameboard");
    const cells = document.querySelectorAll(".cell");
    const messageElement = document.querySelector("#message");
    const restartButton = document.querySelector("#restartBtn");

    const renderBoard = () => {
        const board = gameBoard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    const handleCellClick = (event) => {
        if(gameController.gameOver) return;

        const index = event.target.dataset.index;
        if(gameBoard.getBoard()[index] === "") {
            gameController.playTurn(index);
        }
    };

    const updateMessage = (message) => {
        messageElement.textContent = message;
    };

    const handleRestart = () => {
        gameBoard.resetBoard();
        renderBoard();
        
        gameController.gameOver = false; // Allow new game after reset
        gameController.players = [
            { name: "Player 1", marker: "X" },
            { name: "Player 2", marker: "O" }
        ];
        gameController.setPlayerNames(); // Re-initialize names and message

        displayController.updateMessage("Game restarted! Player 1 goes first.");

        gameController.currentPlayerIndex = 0; // Ensures Player 1 starts correctly
    };

    cells.forEach(cell => cell.addEventListener("click", handleCellClick));
    restartButton.addEventListener("click", handleRestart);

    return {renderBoard, updateMessage, boardElement};        
})();

// Game Board Module
const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];
    const getBoard = () => [...board]; // Return a copy to prevent external mutation
    
    const placeMarker = (index, marker) => {
        if(board[index] === "") {
            board[index] = marker;
            console.log(`Placed marker ${marker} at index ${index}`);
        } 
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""]; // Explicitly clear board
        console.log("Board reset.");
    }

    const checkWin = () => {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for(let [a, b, c] of winningCombos) {
            if(board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a] // Return the winning marker ;
            }
        }
        return board.includes("") ? null : "Tie";
    };
    return {getBoard, placeMarker, resetBoard, checkWin};
})();

//Player Factory
const player = (name, marker) => {
    return {name, marker};
};

// Game Controller
const gameController = (() => {
    let currentPlayerIndex = 0;
    let players = [{name: "Player 1", marker: "X"}, {name: "Player 2", marker: "O"}];
    let gameOver = false; // To track game state

    const setPlayerNames = () => {
        const player1Input = document.querySelector("#player1");
        const player2Input = document.querySelector("#player2");

        players[0].name = player1Input.value || "Player 1";
        players[1].name = player2Input.value || "Player 2";

        currentPlayerIndex = 0;
        gameOver = false; // Reset game when setting player names
        
        displayController.updateMessage(`${players[currentPlayerIndex].name}'s turn!`);
        
    };
    
    const switchPlayer = () => {
        if (gameOver) return; // Prevents switching players after a win
        
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
        displayController.updateMessage(`${players[currentPlayerIndex].name}'s turn!`);
        
       /* setTimeout(() => {
            displayController.updateMessage(`${players[currentPlayerIndex].name}'s turn!`);
        }, 50); // Forces browser repaint*/
    }

    const playTurn = (index) => {
        if (gameOver || gameBoard.getBoard()[index] !== "") return;
        
        const currentPlayer = players[currentPlayerIndex]; // Define currentPlayer correctly
        const correctMarker = currentPlayer.marker; // Assign marker correctly
        gameBoard.placeMarker(index, correctMarker); // Pass correct marker
            
        displayController.renderBoard(); // Ensures board refreshes
        const result = gameBoard.checkWin();
        
        if(result) {
            gameOver = true; // Marks game as finished

            if(result === "Tie") {
                displayController.updateMessage("It's a tie! Game Over!");
            } else {
                const winner = players.find(p => p.marker === result);
                displayController.updateMessage(`${winner.name} wins! Game Over!`);
            }
        } else {
            switchPlayer();
                displayController.updateMessage(`${players[currentPlayerIndex].name}'s turn!`)
        }    
    };
    return {
        playTurn, 
        setPlayerNames, 
        players, 
        get currentPlayerIndex() {
            return currentPlayerIndex;
        },
        get gameOver() {
            return gameOver;
        },
        set gameOver(value) {
            gameOver = value;
        }};
})();
