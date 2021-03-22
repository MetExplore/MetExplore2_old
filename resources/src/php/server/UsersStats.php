<?php

require_once '../database/connection.php';

//launch query
$sql="SELECT count( DISTINCT `id` ) as newUsers, DATE_FORMAT( `registerDate` , '%Y %m' ) AS Date
FROM `UserMet`
GROUP BY Date
ORDER BY Date";

// error_log($sql);

$response["success"] = false;

$result=mysqli_query ($link,$sql);

if(! $result) {
	$response["message"] = "Impossible to get the list of the Users" ;
	mysqli_error($link);
	die(json_encode($response));
}

$results = array();

while ($tab=mysqli_fetch_assoc($result))
{
	$res = array();
	
	$res["newUsers"] = $tab["newUsers"];
	$res["Date"] = $tab["Date"];
	array_push($results, $res);
}

$response["success"] = true;
$response["results"] = $results;
echo json_encode($response);

?>
