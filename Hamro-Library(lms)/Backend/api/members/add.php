<?php

//  CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

//  Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . "/../../database/db.php";

//  Read JSON from React
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["error" => "No data received"]);
    exit();
}

//  Get values safely
$name = $data['name'] ?? '';
$address = $data['address'] ?? '';
$email = $data['email'] ?? '';
$phone = $data['phone'] ?? '';

if (!$name || !$address || !$email || !$phone) {
    echo json_encode(["error" => "Missing data"]);
    exit();
}

//  Prepared statement (SAFE)
$stmt = $conn->prepare(
    "INSERT INTO members (Mname, Memail, Maddress, Mphone)
     VALUES (?, ?, ?, ?)"
);

if (!$stmt) {
    echo json_encode(["error" => $conn->error]);
    exit();
}

$stmt->bind_param("ssss", $name, $email, $address, $phone);

if ($stmt->execute()) {
    echo json_encode(["message" => "User registered successfully"]);
} else {
    echo json_encode(["error" => $stmt->error]);
}

$stmt->close();
$conn->close();

?>
