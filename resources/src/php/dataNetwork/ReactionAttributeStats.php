<?php

require_once '../database/connection.php';


$sql="SELECT count( distinct `id`) as total, count(CASE WHEN `name` IS NULL OR `name` = 'NA' OR `name` = 'na' THEN 1 END ) AS withoutName,
count(CASE WHEN `ec` IS NULL OR `ec` = 'NA' OR `ec` = 'na' THEN 1 END ) AS withoutEC,
count(CASE WHEN `go` IS NULL OR `go` = 'NA' OR `go` = 'na' THEN 1 END ) AS withoutGO,
count(CASE WHEN `sbo` IS NULL OR `sbo` = 'NA' OR `sbo` = 'na' THEN 1 END ) AS withoutSBO
FROM Reaction";

$response["success"] = false;
$results = array();
$res= array();
$total;

$result=mysqli_query ($link,$sql);

if(! $result) {
	$response["message"] = "Impossible to get statistics on Reaction" ;
	mysqli_error($link);
	die(json_encode($response));
}
else{
	$tab=mysqli_fetch_assoc($result);
	
	$total=$tab["total"];
	
	$res["attributeName"] = "Reaction Name";
	$res["with"]=$total-$tab["withoutName"];	
	$res["without"]=$tab["withoutName"];
	array_push($results, $res);
	
	$res["attributeName"] = "EC Number";
	$res["with"]=$total-$tab["withoutEC"];	
	$res["without"]=$tab["withoutEC"];
	array_push($results, $res);
	
	$res["attributeName"] = "GO Term";
	$res["with"]=$total-$tab["withoutGO"];	
	$res["without"]=$tab["withoutGO"];
	array_push($results, $res);
	
	$res["attributeName"] = "SBO";
	$res["with"]=$total-$tab["withoutSBO"];	
	$res["without"]=$tab["withoutSBO"];
	array_push($results, $res);
}

$sql="SELECT count(distinct `idReaction`) as withStatus
FROM ReactionHasStatus;";

$result=mysqli_query ($link,$sql);

if(! $result) {
	$response["message"] = "Impossible to get statistics on Reaction" ;
	mysqli_error($link);
	die(json_encode($response));
}
else{
	$tab=mysqli_fetch_assoc($result);
	
	$res["attributeName"] = "Reaction Status";
	$res["with"]=$tab["withStatus"];	
	$res["without"]=$total-$tab["withStatus"];
	array_push($results, $res);
}

$sql="SELECT count(distinct `idReaction`) as withRef
FROM ReactionHasReference;";

$result=mysqli_query ($link,$sql);

if(! $result) {
	$response["message"] = "Impossible to get statistics on Reaction" ;
	mysqli_error($link);
	die(json_encode($response));
}
else{
	$tab=mysqli_fetch_assoc($result);
	
	$res["attributeName"] = "References";
	$res["with"]=$tab["withRef"];	
	$res["without"]=$total-$tab["withRef"];
	array_push($results, $res);
}


$response["success"] = true;
$response["results"] = $results;

echo json_encode($response);

?>
