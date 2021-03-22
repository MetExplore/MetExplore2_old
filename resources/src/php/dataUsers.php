<?php 
// 
require_once 'database/connection.php';


$sql="SELECT DISTINCT UserMet.id AS id , UserMet.username AS username , UserMet.name AS name, UserMet.email AS email FROM UserMet ORDER BY username;";

// error_log($sql);

$response["success"] = false;


$result=mysqli_query ($link,$sql);

if(! $result) {
	$response["message"] = "Impossible to get the list of the Users!" ;
	mysqli_error($link);
	die(json_encode($response));
}


$results = array();

while ($row=mysqli_fetch_object($result))
{
	$results [] = $row;
}

$response["success"] = true;
$response["results"] = $results;
echo json_encode($response);
?>
