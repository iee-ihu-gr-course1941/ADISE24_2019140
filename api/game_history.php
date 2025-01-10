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

// Create the SQL query to get the usernames from the game
$sqlPlayers = "SELECT player1_username, player2_username 
            FROM Games 
            WHERE game_id = '$gameId'";

// Execute the SQL query
$playersResult = executeQuery($sqlPlayers);

// Check if the query returned a result
if (!$playersResult || count($playersResult) == 0) {
    echo json_encode(['error' => 'Players not found for this game.']);
    exit;
}

// Get the usernames from the result
$player1 = $playersResult[0]['player1_username'];
$player2 = $playersResult[0]['player2_username'];

// Query to get the overall wins for both players from the players table
$sqlOverallWins = "SELECT username, wins FROM Players WHERE username IN ('$player1', '$player2')";
$overallWinsResult = executeQuery($sqlOverallWins);

// Query to get the wins versus each other from the games table
$sqlGameWins = "SELECT winner, COUNT(*) as total_wins 
                FROM Games 
                WHERE (player1_username = '$player1' AND player2_username = '$player2') 
                    OR (player1_username = '$player2' AND player2_username = '$player1') 
                GROUP BY winner";
$gameWinsResult = executeQuery($sqlGameWins);

// Create the data for the response
$overallWins = [];
if ($overallWinsResult) {
    foreach ($overallWinsResult as $row) {
        $overallWins[$row['username']] = $row['wins'];
    }
}

$gameWins = [
    'player1_wins' => 0,
    'player2_wins' => 0
];

if ($gameWinsResult) {
    foreach ($gameWinsResult as $row) {
        if ($row['winner'] == $player1) {
            $gameWins['player1_wins'] = $row['total_wins'];
        } elseif ($row['winner'] == $player2) {
            $gameWins['player2_wins'] = $row['total_wins'];
        }
    }
}

// Create the response data
$response = [
    'overallWins' => $overallWins,
    'gameWins' => $gameWins
];

// Output the response as JSON
echo json_encode($response);

exit;
?>
