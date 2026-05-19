<?php
$server="127.0.0.1:3306";
$username ="root";
$password ="abc councor"; 
$dbName="lms";


$conn= mysqli_connect($server, $username,$password,$dbName); // Using Peocedure concept

   if(!$conn){
      die("Connection failed:  ".mysqli_connect_error());
   }
// echo "Connection sucessfull..";


?>
