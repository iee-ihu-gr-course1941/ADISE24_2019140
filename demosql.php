<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);


$host = "localhost";
$user = "iee2019140";
$password = "DR6147NB";
$dbname = "ADISE24";


// Create a connection
$conn = new mysqli($host, $user, $password, $dbname, null, '/home/student/iee/2019/iee2019140/mysql/run/mysql.sock');

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


// Example function to send an SQL query
function sendQuery($conn, $query) {
    $result = $conn->query($query);

    if ($result) {
        // If the query is a SELECT query, fetch the results
        if ($result instanceof mysqli_result) {
            $data = [];
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            $result->free();
            return $data;
        }
        // For non-SELECT queries (INSERT, UPDATE, DELETE)
        return true;
    } else {
        // Handle query error
        return "Error: " . $conn->error;
    }
}

// Example usage
// SELECT query
// $query = "CREATE TABLE Games (
//     game_id INT AUTO_INCREMENT PRIMARY KEY,
//     player1_username VARCHAR(20) NOT NULL,
//     player2_username VARCHAR(20) NOT NULL,
//     game_board TEXT NOT NULL,
//     current_turn VARCHAR(20) NOT NULL,
//     game_state ENUM('ongoing', 'completed', 'abandoned') DEFAULT 'ongoing',
//     winner VARCHAR(20) DEFAULT NULL,
//     FOREIGN KEY (player1_username) REFERENCES Players(username),
//     FOREIGN KEY (player2_username) REFERENCES Players(username)
// );
// ";


// Example usage
// SELECT query
$query = "DELETE FROM Players WHERE 1=1;
";

$result = sendQuery($conn, $query);
if (is_array($result)) {
    echo "Query Results:\n";
    print_r($result);
} else {
    echo "Query Execution: " . $result . "\n";
}

// Close connection
$conn->close();
?>