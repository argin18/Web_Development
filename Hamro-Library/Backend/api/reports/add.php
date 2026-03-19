<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
include __DIR__ . "/../../database/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (
    isset($data['report_type']) &&
    isset($data['description']) &&
    isset($data['report_date'])
) {

    $stmt = $conn->prepare("
        INSERT INTO reports (report_type, description, report_date)
        VALUES (?, ?, ?)
    ");

    $stmt->bind_param(
        "sss",
        $data['report_type'],
        $data['description'],
        $data['report_date']
    );

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }

} else {
    echo json_encode(["error" => "Invalid input"]);
}
?>