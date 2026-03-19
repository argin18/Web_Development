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

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['issueId'])) {
    echo json_encode(["error" => "Issue ID required"]);
    exit;
}

$issueId = $data['issueId'];

// Get issue info
$issueQuery = mysqli_query($conn, "SELECT * FROM issue WHERE id = $issueId");
if (mysqli_num_rows($issueQuery) == 0) {
    echo json_encode(["error" => "Issue not found"]);
    exit;
}

$issue = mysqli_fetch_assoc($issueQuery);

// Check overdue
$status = "On Time";
if (strtotime(date("Y-m-d")) > strtotime($issue['issue_date'])) {
    $status = "overdue";
}

// Insert return record
$stmt = mysqli_prepare($conn, "
INSERT INTO return_book (issue_id, status)
VALUES (?, ?)
");
mysqli_stmt_bind_param($stmt, "is", $issueId, $status);
mysqli_stmt_execute($stmt);
mysqli_stmt_close($stmt);

// ✅ Mark issue as returned instead of deleting
$stmt2 = mysqli_prepare($conn, "UPDATE issue SET status='returned' WHERE id=?");
mysqli_stmt_bind_param($stmt2, "i", $issueId);
mysqli_stmt_execute($stmt2);
mysqli_stmt_close($stmt2);

echo json_encode(["success" => true]);
?>
