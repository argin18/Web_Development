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

$data = json_decode(file_get_contents("php://input"), true);

if(!isset($data['bookid'], $data['userId'], $data['books'], $data['dueDate'])){
    echo json_encode(["error" => "Missing fields"]);
    exit;
}

$bookid = $data['bookid'];
$userId = $data['userId'];
$books = $data['books'];
$dueDate = $data['dueDate'];

$sql = "INSERT INTO issue 
(book_id, member_id, no_of_books, issue_date)
VALUES (?, ?, ?, ?)";

$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param($stmt, "iiis",
    $bookid,
    $userId,
    $books,
    $dueDate
);

if(mysqli_stmt_execute($stmt)){
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => mysqli_error($conn)]);
}

mysqli_stmt_close($stmt);
?>
