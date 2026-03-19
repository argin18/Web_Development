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

if (!$data || !isset($data['id'])) {
    echo json_encode(["error" => "ID required"]);
    exit();
}

$id = $data['id'];

// Check if user exists and is not the last admin
$check = mysqli_query($conn, "SELECT role FROM users WHERE id=$id");
$user = mysqli_fetch_assoc($check);

if ($user && $user['role'] == 'admin') {
    $adminCount = mysqli_query($conn, "SELECT COUNT(*) as count FROM users WHERE role='admin'");
    $count = mysqli_fetch_assoc($adminCount);
    if ($count['count'] <= 1) {
        echo json_encode(["error" => "Cannot delete the last admin"]);
        exit();
    }
}

$stmt = mysqli_prepare($conn, "DELETE FROM users WHERE id=?");
mysqli_stmt_bind_param($stmt, "i", $id);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(["success" => true, "message" => "User deleted successfully"]);
} else {
    echo json_encode(["error" => mysqli_error($conn)]);
}

mysqli_stmt_close($stmt);
?>