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

if (!$data || !isset($data['userId']) || !isset($data['currentPassword']) || !isset($data['newPassword'])) {
    echo json_encode(["success" => false, "error" => "Missing required fields"]);
    exit();
}

$userId = $data['userId'];
$currentPassword = $data['currentPassword'];
$newPassword = $data['newPassword'];

// Get user's current password hash
$stmt = mysqli_prepare($conn, "SELECT password FROM users WHERE id=?");
mysqli_stmt_bind_param($stmt, "i", $userId);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$user = mysqli_fetch_assoc($result);

if (!$user) {
    echo json_encode(["success" => false, "error" => "User not found"]);
    exit();
}

// Verify current password
if (!password_verify($currentPassword, $user['password'])) {
    echo json_encode(["success" => false, "error" => "Current password is incorrect"]);
    exit();
}

// Hash new password
$hashedNewPassword = password_hash($newPassword, PASSWORD_DEFAULT);

// Update password
$updateStmt = mysqli_prepare($conn, "UPDATE users SET password=? WHERE id=?");
mysqli_stmt_bind_param($updateStmt, "si", $hashedNewPassword, $userId);

if (mysqli_stmt_execute($updateStmt)) {
    echo json_encode(["success" => true, "message" => "Password changed successfully"]);
} else {
    echo json_encode(["success" => false, "error" => mysqli_error($conn)]);
}

mysqli_stmt_close($stmt);
mysqli_stmt_close($updateStmt);
?>