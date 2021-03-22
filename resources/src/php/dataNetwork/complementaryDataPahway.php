<?php
require_once("../database/connection.php");

$functionParam= json_decode($_POST['functionParam'], $assoc=true);

extract ( $functionParam, EXTR_OVERWRITE );

$response["success"] = false;

$sql="SELECT SuperPathway.idSup as Super FROM SuperPathway WHERE SuperPathway.idSub='$idPathway';";

// error_log($sql);

$result=mysqli_query ($link,$sql);

if(! $result) {
	$response["message"] = "Unable to get complementary data on the pathway" ;
	mysqli_error($link);
	die(json_encode($response));
}

$results = array();

while ($tab=mysqli_fetch_assoc($result))
{
	array_push($results,$tab);
}

$response["success"] = true;
$response["results"] = $results;
echo json_encode($response);
?>
