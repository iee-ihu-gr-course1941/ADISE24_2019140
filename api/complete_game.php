<?php
session_start();
require_once('sql.php');

// Check if the session has the game ID
if (!isset($_SESSION['game_id'])) {
    echo json_encode(['error' => 'No active game found.']);
    exit;
}

// Get the game ID
$gameId = $_SESSION['game_id'];

// Check if the winner's name is provided
if (!isset($_POST['winner'])) {
    echo json_encode(['error' => 'Winner not specified.']);
    exit;
}

// Get the winner's name
$winner = $_POST['winner'];

// Create the SQL query to update the game state to 'completed' and add the winner to the row
$sql = "UPDATE Games SET game_state = 'completed', winner = '$winner' WHERE game_id = $gameId AND game_state = 'ongoing'";

// Execute the query
$result = executeQuery($sql);

// Check if the update was successful
if ($result) {
    // Now update the player's wins in the players table
    $updatePlayerWinsSql = "UPDATE Players SET wins = wins + 1 WHERE username = '$winner'";

    // Execute the query
    $playerUpdateResult = executeQuery($updatePlayerWinsSql);

    if ($playerUpdateResult) {
        echo json_encode(['success' => true, 'message' => 'Game marked as completed and player wins updated.']);
    } else {
        echo json_encode(['error' => 'Failed to update player wins.']);
    }
} else {
    echo json_encode(['error' => 'Failed to mark the game as completed.']);
}

exit;
?>
