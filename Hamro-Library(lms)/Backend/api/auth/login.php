<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type:  application/json");

include __DIR__ ."/../../database/db.php";

if(isset($_POST['username'],$_POST['password'],$_POST['role'])){
$username=$_POST['username'];
$password=$_POST['password'];
$role=$_POST['role'];


    $stmt = $conn->prepare("SELECT * FROM users WHERE username=? AND role=?");
    $stmt->bind_param("ss", $username, $role);
    $stmt->execute();
    $result = $stmt->get_result();

    if($user = $result->fetch_assoc()){
        if(password_verify($password, $user['password'])){
            unset($user['password']); // remove password before sending back
            echo json_encode(["message" => "Login successful", "user" => $user]);
        } else {
            echo json_encode(["error" => "Invalid password"]);
        }
    } else {
        echo json_encode(["error" => "User not found"]);
    }
}else {
    echo json_encode(["error" => "Missing data"]);
}
?>
