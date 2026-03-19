<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type:  application/json");

include __DIR__ ."/../../database/db.php";

if(isset($_POST['role'])&&
isset($_POST['fullname'])&&
isset($_POST['username'])&&
isset($_POST['email'])&&
isset($_POST['password'])
){

    $role=$_POST['role'];
    $name=$_POST['fullname'];
    $username=$_POST['username'];
    $email=$_POST['email'];
    $pass=password_hash($_POST['password'],PASSWORD_DEFAULT);

    $sql="INSERT INTO users(role,fullname,username,email,password)
    VALUES('$role','$name','$username','$email','$pass')";

    if(mysqli_query($conn,$sql)){
        echo json_encode(["message"=>"User registered successfully.."]);
        }else{
        echo json_encode(["error"=>"Registration failed.."]);
        
        }
        }else{
    echo json_encode(["error"=>"Missing data.."]);

}

?>