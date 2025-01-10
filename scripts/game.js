$(document).ready(function () {
    let game;
    // To store the current player ('player1' or 'player2')
    let currentPlayer = '';
    // To store the current player username
    let currentPlayerName = null;
    // To keep track of the currently selected cell
    let selectedCell = null;

    // The turn timer
    let timer;
    // 20 seconds for each player
    let timeLeft = 20;

    function startTimer() {
        timeLeft = 20; // reset the timer to 20 seconds
        $('#time-left').text(timeLeft); // update the timer display

        // Decrease the timer every second
        timer = setInterval(function () {
            timeLeft--;
            $('#time-left').text(timeLeft); // update the display

            if (timeLeft <= 0) {
                clearInterval(timer); // stop the timer when time is up
                switchPlayer(); // automatically switch the player when time is up
            }
        }, 1000);
    }

    // Stops the timer
    function stopTimer() {
        clearInterval(timer);
    }

    // Switches the player turn
    function switchPlayer() {
        $('#game-board .cell').removeClass('highlight highlight-valid-player1 highlight-valid-player2');
        // Clear sellected player ball
        document.getElementById(currentPlayer + "turn").classList.remove("ball-circle");
        // Change the variables
        currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
        currentPlayerName = currentPlayer === 'player1' ? game.player1 : game.player2;
        // Update the UI with the new player's name
        $('#player-turn').text(currentPlayerName);
        // Show sellected player ball
        document.getElementById(currentPlayer + "turn").classList.add("ball-circle");
        // Start the timer for the next player
        startTimer();
    }

    // Fetch the game data from get_game.php
    $.ajax({
        url: '../api/get_game.php',
        method: 'GET',
        success: function (response) {
            // Parse response to a JavaScript object
            response = JSON.parse(response);

            if (response.error) {
                window.location.href = '../index.html';
                return;
            }
            // Get the game history data between this players
            get_history();
            // Update the current player variables
            currentPlayer = response.current_turn == response.player1 ? 'player1' : 'player2';
            currentPlayerName = response.current_turn == response.player1 ? response.player1 : response.player2;
            // Store the game
            game = response;
            const board = game.game_board;
            // Update the player usernames UI
            $('#player1').text(response.player1);
            $('#player2').text(response.player2);
            document.getElementById(currentPlayer + "turn").classList.add("ball-circle");
            // Render the game board
            renderBoard(board);
            // Start the timer for the first player
            startTimer();
        }
    });

    // Fetch the game history data and log the response
    function get_history() {
        $.ajax({
            url: '../api/game_history.php',
            method: 'GET',
            success: function (historyResponse) {
                // Parse the response to JSON
                historyResponse = JSON.parse(historyResponse);
                // Update the hystory UI
                $('#player1-history').html(game.player1 + ": <strong>" + historyResponse.overallWins[game.player1] + "</strong> Win" + (historyResponse.overallWins[game.player1] > 1 ? "s" : ""));
                $('#player2-history').html(game.player2 + ": <strong>" + historyResponse.overallWins[game.player2] + "</strong> Win" + (historyResponse.overallWins[game.player2] > 1 ? "s" : ""));
                $('#players-history-vs').html(game.player1 + " <strong>" + historyResponse.gameWins.player1_wins + " VS " + historyResponse.gameWins.player2_wins + "</strong> " + game.player2);
            },
            error: function () {
                alert('An error occurred while fetching the game history. Please try again.');
            }
        });
    }

    // Abandon game button click handler
    $('#abandon-game-button').click(function () {
        // Send a POST request to abandon the game
        $.ajax({
            url: '../api/abandon_game.php',
            method: 'POST',
            success: function (response) {
                response = JSON.parse(response);

                if (response.success) {
                    // Redirect to index.html after abandoning the game
                    window.location.href = '../index.html';
                } else {
                    alert('Error abandoning the game. Please try again.');
                }
            },
            error: function () {
                alert('An error occurred while abandoning the game. Please try again.');
            }
        });
    });

    // Function to render the board
    function renderBoard(board) {
        $('#game-board').empty();
        // Since the board is 7x7
        const boardSize = 7;
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const cell = $('<div>').addClass('cell');

                // Check the cell status and assign the respective class
                const cellStatus = board[row].charAt(col); // 'p', 'q', or 'e'
                if (cellStatus === 'p') {
                    cell.addClass('player1');
                } else if (cellStatus === 'q') {
                    cell.addClass('player2');
                }
                cell.attr('data-row', row).attr('data-col', col);
                $('#game-board').append(cell);
            }
        }
    }

    // Handle cell click event (for making moves or checking valid moves)
    $('#game-board').on('click', '.cell', function () {
        const row = $(this).data('row');
        const col = $(this).data('col');

        // Check if the cell is a valid move for the current player
        const cellStatus = $(this).hasClass(currentPlayer);

        if (!selectedCell) {
            // If no cell is selected, check if the clicked cell has the current player's piece
            if (cellStatus) {
                selectedCell = { row, col }; // Store the selected cell
                $(this).addClass('highlight'); // Highlight the selected piece
                highlightValidMoves(selectedCell); // Highlight valid moves
            }
        } else {
            // If a cell is already selected, check if the clicked cell is a valid move
            const isValidMove = checkIsValidMove(selectedCell, { row, col });

            if (isValidMove) {
                // Update the board locally
                updateBoard(selectedCell, { row, col });

                // Reset the selected cell
                selectedCell = null;
                $('#game-board .cell').removeClass('highlight highlight-valid-player1 highlight-valid-player2'); // Remove all highlights
            } else {
                // Clear the selected piece and reset highlights
                selectedCell = null;
                $('#game-board .cell').removeClass('highlight highlight-valid-player1 highlight-valid-player2'); // Remove all highlights
            }
        }
    });

    // Highlight valid moves for the selected piece
    function highlightValidMoves(selectedCell) {
        // First, remove all previous highlights
        $('#game-board .cell').removeClass('highlight-valid-player1 highlight-valid-player2');

        // Loop through all cells and check if each one is a valid move
        $('#game-board .cell').each(function () {
            const row = $(this).data('row');
            const col = $(this).data('col');

            // Check if this cell is a valid move using checkIsValidMove
            const isValidMove = checkIsValidMove(selectedCell, { row, col });

            // If valid, highlight the cell
            if (isValidMove) {
                // Add the appropriate class based on the current player
                if (currentPlayer === 'player1') {
                    $(this).addClass('highlight-valid-player1'); // Blue glow for player 1
                } else {
                    $(this).addClass('highlight-valid-player2'); // Red glow for player 2
                }
            }
        });
    }

    // Function to check if a move is valid
    function checkIsValidMove(fromCell, toCell) {
        const rowDiff = Math.abs(fromCell.row - toCell.row);
        const colDiff = Math.abs(fromCell.col - toCell.col);

        // Ataxx moves: valid if one or two steps away in any direction or L-shaped move
        const isOneStepMove = rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0);
        const isTwoStepMove = (rowDiff === 2 && colDiff === 0) || (rowDiff === 0 && colDiff === 2) || (rowDiff === 2 && colDiff === 2);
        const isLShapedMove = (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);

        // Check if the destination cell is empty
        const isDestinationEmpty = game.game_board[toCell.row][toCell.col] === 'e';

        return (isOneStepMove || isTwoStepMove || isLShapedMove) && isDestinationEmpty;
    }

    // Update the board after a valid move
    function updateBoard(fromCell, toCell) {
        const board = game.game_board;
        const fromRow = fromCell.row;
        const fromCol = fromCell.col;
        const toRow = toCell.row;
        const toCol = toCell.col;

        const rowDiff = Math.abs(fromRow - toRow);
        const colDiff = Math.abs(fromCol - toCol);
        const isOneStepMove = rowDiff <= 1 && colDiff <= 1;

        const playerClass = currentPlayer === 'player1' ? 'p' : 'q';

        if (isOneStepMove) {
            board[toRow] = board[toRow].substring(0, toCol) + playerClass + board[toRow].substring(toCol + 1);
        } else {
            board[fromRow] = board[fromRow].substring(0, fromCol) + 'e' + board[fromRow].substring(fromCol + 1);
            board[toRow] = board[toRow].substring(0, toCol) + playerClass + board[toRow].substring(toCol + 1);
        }

        convertAdjacentPieces(toCell);

        renderBoard(board);
        // Stop the timer after the move
        stopTimer();
        // Switch to the next player
        switchPlayer();

        // Update the game
        $.ajax({
            url: '../api/update_game.php',
            method: 'POST',
            data: {
                board: JSON.stringify(board),
                currentPlayer: currentPlayer === 'player1' ? game.player2 : game.player1,
            },
            success: function (response) {
                response = JSON.parse(response);

                if (response.success) {
                    $('#player-turn').text(currentPlayerName);
                    selectedCell = null;
                    $('#game-board .cell').removeClass('highlight highlight-valid-player1 highlight-valid-player2');

                    // Check for victory after the move is successfully updated
                    checkForVictory();
                } else {
                    alert("Error updating the game. Please try again.");
                }
            },
            error: function () {
                alert("An error occurred while updating the game. Please try again.");
            }
        });
    }

    // Function to convert opponent's adjacent pieces
    function convertAdjacentPieces(cell) {
        const directions = [
            { row: -1, col: 0 }, { row: 1, col: 0 },
            { row: 0, col: -1 }, { row: 0, col: 1 },
            { row: -1, col: -1 }, { row: -1, col: 1 },
            { row: 1, col: -1 }, { row: 1, col: 1 }
        ];

        directions.forEach(direction => {
            const newRow = cell.row + direction.row;
            const newCol = cell.col + direction.col;

            // Check if the new position is on the board and occupied by the opponent
            if (newRow >= 0 && newRow < 7 && newCol >= 0 && newCol < 7) {
                const opponentPiece = currentPlayer === 'player1' ? 'q' : 'p';
                const currentCell = game.game_board[newRow][newCol];
                if (currentCell === opponentPiece) {
                    game.game_board[newRow] = game.game_board[newRow].substring(0, newCol) + (currentPlayer === 'player1' ? 'p' : 'q') + game.game_board[newRow].substring(newCol + 1);
                }
            }
        });
    }

    // Redirect to menu
    document.getElementById('menu-game-button').addEventListener('click', function () {
        window.location.href = '../index.html';
    });


    // Function to check if a player has won
    function checkForVictory() {
        let player1Count = 0;
        let player2Count = 0;

        const board = game.game_board;

        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col] === 'p') {
                    player1Count++;
                } else if (board[row][col] === 'q') {
                    player2Count++;
                }
            }
        }

        if (player1Count === 0) {
            $('#victory-text').text(`${game.player2} wins!`); // Player 2 wins
            endGame(game.player2);
        } else if (player2Count === 0) {
            $('#victory-text').text(`${game.player1} wins!`); // Player 1 wins
            endGame(game.player1);
        }
    }

    function endGame(player) {
        // Dim the game board and prevent further clicks
        $('#game-board').css('opacity', '0.7');
        $('#game-board').off('click');
        // Stop the turn timer
        stopTimer();

        // Send a POST request to mark the game as completed and pass the winner's name
        $.ajax({
            url: '../api/complete_game.php',
            method: 'POST',
            data: { winner: player },
            success: function (response) {
                response = JSON.parse(response);
                get_history()
                if (response.success) {
                    document.getElementById("abandon-game-button").setAttribute("disabled", "true");
                } else {
                    alert('Error marking the game as completed. Please try again.');
                }
            },
            error: function () {
                alert('An error occurred while marking the game as completed. Please try again.');
            }
        });
    }

});
