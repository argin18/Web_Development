<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

include __DIR__ . "/../../database/db.php";

// Optional: auto mark overdue
mysqli_query($conn, "
UPDATE issue 
SET status='overdue' 
WHERE issue_date < CURDATE()
");

$sql = "SELECT 
id,
book_id AS bookid,
member_id AS userId,
no_of_books AS books,
issue_date AS dueDate,
DATE(created_at) AS issuedAt,
TIME(created_at) AS issueTime,
status
FROM issue
WHERE status != 'returned'
ORDER BY id DESC";


$result = mysqli_query($conn, $sql);

$issues = [];

while($row = mysqli_fetch_assoc($result)){
    $issues[] = $row;
}

echo json_encode($issues);
?>
