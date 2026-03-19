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

$sql = "
SELECT 
r.id,
r.issue_id,
r.return_date,
r.status AS return_status,
i.book_id AS bookid,
i.member_id AS userId,
i.no_of_books AS books,
i.issue_date AS dueDate,
DATE(i.created_at) AS issuedAt
FROM return_book r
JOIN issue i ON r.issue_id = i.id
ORDER BY r.id DESC
";


$result = mysqli_query($conn, $sql);

$data = [];

while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

echo json_encode($data);
?>
