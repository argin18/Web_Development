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
    echo json_encode(["success" => false, "error" => "Invalid data"]);
    exit();
}

$id = (int)$data['id'];
$username = mysqli_real_escape_string($conn, $data['username'] ?? '');
$fullname = mysqli_real_escape_string($conn, $data['fullname'] ?? '');
$email = mysqli_real_escape_string($conn, $data['email'] ?? '');
$role = mysqli_real_escape_string($conn, $data['role'] ?? 'librarian');

if (!$username || !$fullname || !$email) {
    echo json_encode(["success" => false, "error" => "Missing required fields"]);
    exit();
}

// Check if username already exists (excluding current user)
$checkUsername = mysqli_query($conn, "SELECT id FROM users WHERE username='$username' AND id != $id");
if (mysqli_num_rows($checkUsername) > 0) {
    echo json_encode(["success" => false, "error" => "Username already exists"]);
    exit();
}

// Check if email already exists (excluding current user)
$checkEmail = mysqli_query($conn, "SELECT id FROM users WHERE email='$email' AND id != $id");
if (mysqli_num_rows($checkEmail) > 0) {
    echo json_encode(["success" => false, "error" => "Email already exists"]);
    exit();
}

// If password is provided, update it too
if (isset($data['password']) && !empty($data['password'])) {
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
    $stmt = mysqli_prepare($conn, 
        "UPDATE users SET username=?, fullname=?, email=?, role=?, password=? WHERE id=?"
    );
    mysqli_stmt_bind_param($stmt, "sssssi", $username, $fullname, $email, $role, $hashedPassword, $id);
} else {
    $stmt = mysqli_prepare($conn, 
        "UPDATE users SET username=?, fullname=?, email=?, role=? WHERE id=?"
    );
    mysqli_stmt_bind_param($stmt, "ssssi", $username, $fullname, $email, $role, $id);
}

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(["success" => true, "message" => "User updated successfully"]);
} else {
    echo json_encode(["success" => false, "error" => mysqli_error($conn)]);
}

mysqli_stmt_close($stmt);
?>