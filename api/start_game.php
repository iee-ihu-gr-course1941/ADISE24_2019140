<?php
session_start();
require_once('sql.php');

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the data from the POST request
    $player1Name = isset($_POST['player1_name']) ? trim($_POST['player1_name']) : '';
    $player2Name = isset($_POST['player2_name']) ? trim($_POST['player2_name']) : '';

    // Validate the input
    if (empty($player1Name) || empty($player2Name)) {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required.']);
        exit;
    }

    // Store data in the session
    $_SESSION['player1_name'] = $player1Name;
    $_SESSION['player2_name'] = $player2Name;

    // Check if player1 exists
    $sql = "SELECT * FROM Players WHERE username = '$player1Name'";
    $player1Exists = executeQuery($sql);

    if (empty($player1Exists)) {
        // Insert player1 into the Players table if they don't exist
        $insertPlayer1Sql = "INSERT INTO Players (username) VALUES ('$player1Name')";
        executeQuery($insertPlayer1Sql);
    }

    // Check if player2 exists
    $player2Exists = executeQuery("SELECT * FROM Players WHERE username = '$player2Name'");

    if (empty($player2Exists)) {
        // Insert player2 into the Players table if they don't exist
        $insertPlayer2Sql = "INSERT INTO Players (username) VALUES ('$player2Name')";
        executeQuery($insertPlayer2Sql);
    }

    // Check if there's already an "ongoing" game with the same players and game name
    $checkExistingGameSql = "SELECT game_id FROM Games 
                            WHERE player1_username = '$player1Name' 
                            AND player2_username = '$player2Name' 
                            AND game_state = 'ongoing'";

    $existingGame = executeQuery($checkExistingGameSql);

    if (!empty($existingGame)) {
        // If an "ongoing" game exists, store the game_id in the session
        $_SESSION['game_id'] = $existingGame[0]['game_id'];
        echo json_encode(['message' => 'Game already exists.']);
        exit;
    }

    // Generate the game board
    $gameBoard = generateGameBoard();

    // Now, create the game in the Games table
    $insertGameSql = "INSERT INTO Games (player1_username, player2_username, game_board, current_turn)
                    VALUES ('$player1Name', '$player2Name', '$gameBoard', '$player1Name')";
    
    // Execute the query
    $result = executeQuery($insertGameSql);

    // Get the game_id
    $fetchGameIdSql = "SELECT game_id FROM Games 
                    WHERE player1_username = '$player1Name' 
                    AND player2_username = '$player2Name' 
                    AND game_state = 'ongoing'";
    
    $newGame = executeQuery($fetchGameIdSql);

    if (!empty($newGame)) {
        $_SESSION['game_id'] = $newGame[0]['game_id'];
    }

    // Respond with a success message
    echo json_encode(['message' => 'Game started successfully.']);
    exit;
} else {
    // Respond with an error if the request is not POST
    http_response_code(405);
    echo json_encode(['error' => 'Invalid request method.']);
    exit;
}


// Function to generate the default game board
function generateGameBoard() {
    // Create a 7x7 board with correct placement of player 1 (p) and player 2 (q)
    $board = [
        "peeeeee",
        "eeeeeee",
        "eeeeeee",
        "eeeeeee",
        "eeeeeee",
        "eeeeeee", 
        "eeeeeeq"
    ];

    // Convert the board array into a single string with commas separating rows
    return implode(",", $board);
}
?>
