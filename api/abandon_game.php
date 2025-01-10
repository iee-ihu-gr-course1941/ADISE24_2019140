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

// Create the SQL query to update the game state to "abandoned"
$sql = "UPDATE Games SET game_state = 'abandoned' WHERE game_id = $gameId AND game_state = 'ongoing'";

// Execute the query
$result = executeQuery($sql);

// Check if the update was successful
if ($result) {
    // Unset the game ID from session
    unset($_SESSION['game_id']);
    // Echo the success message
    echo json_encode(['success' => true, 'message' => 'Game abandoned successfully.']);
} else {
    echo json_encode(['error' => 'Failed to abandon the game.']);
}

exit;
?>
