<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
include __DIR__ . "/../../database/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['id'])) {
    echo json_encode(["success" => false, "error" => "Invalid data"]);
    exit();
}

$id = (int)$data['id'];
$name = $data['name'] ?? '';
$type = $data['type'] ?? '';
$author = $data['author'] ?? '';
$publisher = $data['publisher'] ?? '';
$language = $data['language'] ?? '';
$price = $data['price'] ?? 0;
$quantity = $data['quantity'] ?? 1;

// Get current issued count to calculate new available
$issuedQuery = $conn->query("
    SELECT COALESCE(SUM(no_of_books), 0) as issued 
    FROM issue 
    WHERE book_id = $id AND status != 'returned'
");
$issued = $issuedQuery->fetch_assoc()['issued'];
$available = max(0, $quantity - $issued);

$stmt = $conn->prepare(
    "UPDATE books 
     SET Bname=?, Btype=?, Bauthor=?, Bpublisher=?, Blanguage=?, Bprice=?, quantity=?, available=?
     WHERE id=?"
);

if (!$stmt) {
    echo json_encode(["success" => false, "error" => $conn->error]);
    exit();
}

$stmt->bind_param(
    "sssssdisi",
    $name,
    $type,
    $author,
    $publisher,
    $language,
    $price,
    $quantity,
    $available,
    $id
);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Book updated successfully"]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>