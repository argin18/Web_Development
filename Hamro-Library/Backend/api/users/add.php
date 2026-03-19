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

if (!$data) {
    echo json_encode(["success" => false, "error" => "No data received"]);
    exit();
}

$username = mysqli_real_escape_string($conn, $data['username'] ?? '');
$fullname = mysqli_real_escape_string($conn, $data['fullname'] ?? '');
$email = mysqli_real_escape_string($conn, $data['email'] ?? '');
$password = $data['password'] ?? '';
$role = mysqli_real_escape_string($conn, $data['role'] ?? 'librarian');

if (!$username || !$fullname || !$email || !$password) {
    echo json_encode(["success" => false, "error" => "Missing required fields"]);
    exit();
}

// Check if username already exists
$checkUsername = mysqli_query($conn, "SELECT id FROM users WHERE username='$username'");
if (mysqli_num_rows($checkUsername) > 0) {
    echo json_encode(["success" => false, "error" => "Username already exists"]);
    exit();
}

// Check if email already exists
$checkEmail = mysqli_query($conn, "SELECT id FROM users WHERE email='$email'");
if (mysqli_num_rows($checkEmail) > 0) {
    echo json_encode(["success" => false, "error" => "Email already exists"]);
    exit();
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = mysqli_prepare($conn, 
    "INSERT INTO users (username, fullname, email, password, role) VALUES (?, ?, ?, ?, ?)"
);

mysqli_stmt_bind_param($stmt, "sssss", $username, $fullname, $email, $hashedPassword, $role);

if (mysqli_stmt_execute($stmt)) {
    $newId = mysqli_insert_id($conn);
    echo json_encode([
        "success" => true, 
        "message" => "User created successfully",
        "id" => $newId
    ]);
} else {
    echo json_encode(["success" => false, "error" => mysqli_error($conn)]);
}

mysqli_stmt_close($stmt);
?>