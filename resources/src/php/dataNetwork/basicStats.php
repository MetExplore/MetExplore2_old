<?php

require_once '../database/connection.php';

$sql1="SELECT count( DISTINCT BioSource.id ) AS total, count( DISTINCT UserBioSource.idBioSource ) AS private FROM BioSource, UserBioSource";

$sql2="SELECT count( DISTINCT `id` ) As nb_metab FROM Metabolite";

$sql3="SELECT count( DISTINCT `id` ) As nb_react FROM Reaction";

$sql4="SELECT count( DISTINCT `id` ) AS nb_user FROM UserMet";

$response["success"] = false;
$results = array();
$res= array();

//
$result=mysqli_query ($link,$sql1);
//error_log($sql1);

if(! $result) {
	$response["message"] = "Impossible to get statistics" ;
	mysqli_error($link);
	die(json_encode($response));
}
else{
	$tab=mysqli_fetch_assoc($result);
	$res["what"] = "Total biosource";
	$res["value"]=$tab["total"];
	array_push($results, $res);
	
	$res["what"] = "private";
	$res["value"]=$tab["private"];
	array_push($results, $res);
}
//
$result=mysqli_query ($link,$sql2);
//error_log($sql2);

if(! $result) {
	$response["message"] = "Impossible to get statistics" ;
	mysqli_error($link);
	die(json_encode($response));
}
else{
	$tab=mysqli_fetch_assoc($result);
	$res["what"] = "Number of Metabolites";
	$res["value"]=$tab["nb_metab"];
	array_push($results, $res);
}
//
$result=mysqli_query ($link,$sql3);
//error_log($sql3);

if(! $result) {
	$response["message"] = "Impossible to get statistics" ;
	mysqli_error($link);
	die(json_encode($response));
}
else{
	$tab=mysqli_fetch_assoc($result);
	$res["what"] = "Number of Reactions";
	$res["value"]=$tab["nb_react"];
	array_push($results, $res);
}
//
$result=mysqli_query ($link,$sql4);
//error_log($sql4);

if(! $result) {
	$response["message"] = "Impossible to get statistics" ;
	mysqli_error($link);
	die(json_encode($response));
}
else{
	$tab=mysqli_fetch_assoc($result);
	$res["what"] = "Number of Users";
	$res["value"] = $tab["nb_user"];
	array_push($results, $res);
}
//

$response["success"] = true;
$response["results"] = $results;

echo json_encode($response);

?>
