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

if (!$data) {
    echo json_encode(["success" => false, "error" => "No data received"]);
    exit();
}

$name = $data['name'] ?? '';
$type = $data['type'] ?? '';
$author = $data['author'] ?? '';
$publisher = $data['publisher'] ?? '';
$language = $data['language'] ?? '';
$price = $data['price'] ?? 0;
$quantity = $data['quantity'] ?? 1;

if (!$name || !$type || !$author || !$publisher || !$language || !$price) {
    echo json_encode(["success" => false, "error" => "Missing required fields"]);
    exit();
}

$stmt = $conn->prepare(
    "INSERT INTO books (Bname, Btype, Bauthor, Bpublisher, Blanguage, Bprice, quantity, available) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
);

if (!$stmt) {
    echo json_encode(["success" => false, "error" => $conn->error]);
    exit();
}

$available = $quantity; // Initially available equals quantity

$stmt->bind_param(
    "sssssdis",
    $name,
    $type,
    $author,
    $publisher,
    $language,
    $price,
    $quantity,
    $available
);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Book added successfully"]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>