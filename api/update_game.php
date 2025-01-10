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

// Check if POST data is set
if (!isset($_POST['board']) || !isset($_POST['currentPlayer'])) {
    echo json_encode(['error' => 'Missing game data.']);
    exit;
}

// Get the updated game board in JSON format
$board = $_POST['board']; 
// Get the current player
$currentPlayer = $_POST['currentPlayer']; 

// Decode the board JSON string into a PHP array
$board = json_decode($board, true); 

// Check if json_decode was successful
if ($board === null) {
    echo json_encode(['error' => 'Invalid board data.']);
    exit;
}

// Validate the board format (should be a 7x7 array)
if (count($board) !== 7) {
    echo json_encode(['error' => 'Invalid board data.']);
    exit;
}
foreach ($board as $row) {
    if (strlen($row) !== 7) { // Check if each row is exactly 7 characters
        echo json_encode(['error' => 'Invalid board row length.']);
        exit;
    }
}

// Convert the board array into a single string, with rows separated by commas
$boardString = implode(',', $board);

// Create the SQL query for updating the game
$sql = "UPDATE Games SET game_board = '$boardString', current_turn = '$currentPlayer' WHERE game_id = $gameId AND game_state = 'ongoing'";

// Execute the query using the executeQuery() function from sql.php
$result = executeQuery($sql);



// Check if the update was successful
if ($result) {
    echo json_encode(['success' => true, 'message' => 'Game updated successfully.']);
} else {
    echo json_encode(['error' => 'Failed to update the game. ']);
}

exit;
?>
