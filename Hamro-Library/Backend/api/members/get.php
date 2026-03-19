<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include __DIR__ . "/../../database/db.php";

$sql = "SELECT * FROM members ORDER BY id DESC";
$result = $conn->query($sql);

$members = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $members[] = $row;
    }
}

echo json_encode($members);

$conn->close();

?>
