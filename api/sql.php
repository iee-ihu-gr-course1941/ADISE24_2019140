<?php

// Enable error reporting for debugging
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

// Database connection details
$host = "localhost";
$user = "iee2019140";
$password = "DR6147NB";
$dbname = "ADISE24";
$socket = "/home/student/iee/2019/iee2019140/mysql/run/mysql.sock";

// Function to execute SQL query and return the result
function executeQuery($sql) {
    // Use global variables to get database connection details
    global $host, $user, $password, $dbname, $socket;

    // Create a new MySQL connection
    $conn = new mysqli($host, $user, $password, $dbname, null, $socket);

    // Check for connection errors
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Run the query
    $result = $conn->query($sql);

    // Check if the query was successful
    if (!$result) {
        die("Query execution failed: " . $conn->error);
    }

    // If the query is a SELECT statement, fetch the results
    if ($result instanceof mysqli_result) {
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        // Close the connection after fetching data
        $conn->close();

        // Return the fetched data
        return $data;
    } else {
        // If it's an UPDATE/INSERT/DELETE query, check the affected rows
        if ($conn->affected_rows > 0) {
            // If at least one row was affected, return true
            $conn->close();
            return true;
        } else {
            // If no rows were affected (query did not update any data)
            $conn->close();
            return false;
        }
    }
}

?>
