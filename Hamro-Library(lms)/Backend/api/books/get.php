<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
include __DIR__ . "/../../database/db.php";

// Update available quantities based on current issues
$conn->query("
    UPDATE books b
    SET b.available = b.quantity - COALESCE(
        (SELECT SUM(no_of_books) 
         FROM issue 
         WHERE book_id = b.id AND status != 'returned'
        ), 0
    )
");

$sql = "SELECT * FROM books ORDER BY id DESC";
$result = $conn->query($sql);

$books = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $books[] = $row;
    }
}

echo json_encode($books);
$conn->close();
?>