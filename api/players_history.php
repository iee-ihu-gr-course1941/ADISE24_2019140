<?php
require_once 'sql.php';

// Set the header to return JSON
header('Content-Type: application/json');

try {
    // Create query to get all players and their wins, ordered by wins in descending order
    $sql = "SELECT username, wins FROM Players ORDER BY wins DESC";

    // Execute the query
    $result = executeQuery($sql);

    // Create the data array
    $players = [];
    if ($result) {
        // Loop through the result and build the players array
        foreach ($result as $row) {
            $players[] = [
                'username' => $row['username'],
                'wins' => intval($row['wins']),
            ];
        }
    }

    // Output the players data as JSON
    echo json_encode($players);
} catch (Exception $e) {
    // Return an error response in case of exceptions
    echo json_encode(['error' => $e->getMessage()]);
}

exit;
?>
