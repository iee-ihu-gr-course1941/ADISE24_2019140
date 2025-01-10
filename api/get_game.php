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


// Create the query to get the game data
$sql = "SELECT game_board, current_turn, player1_username AS player1, player2_username AS player2
        FROM Games WHERE game_id = $gameId AND game_state = 'ongoing'";

// Execute the query
$gameData = executeQuery($sql);

// Check if the game exists
if (empty($gameData)) {
    echo json_encode(['error' => 'Game not found or not in an ongoing state.']);
    exit;
}

// Decode the game board string (peeeeee, eeeeeee...) back to an array
$gameData[0]['game_board'] = explode(',', $gameData[0]['game_board']);

// Remove the game_id from the response
unset($gameData[0]['game_id']); 

// Send the game data as JSON
echo json_encode($gameData[0]);
exit;
?>
