<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . "/../../database/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['id'])) {
    echo json_encode(["error" => "Invalid ID"]);
    exit();
}

$id = $data['id'];

$stmt = $conn->prepare("DELETE FROM members WHERE id=?");

if (!$stmt) {
    echo json_encode(["error" => $conn->error]);
    exit();
}

$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Member deleted"]);
} else {
    echo json_encode(["error" => $stmt->error]);
}

$stmt->close();
$conn->close();

?>
