<?php
require_once '../database/connection.php';

$functionParam= json_decode($_POST['functionParam'], $assoc=true);

extract ( $functionParam, EXTR_OVERWRITE );

$response["success"] = false;
$results = array();

$sqlL="SELECT *, 'Substrate' AS type FROM LeftParticipant WHERE LeftParticipant.idMetabolite IN (" . implode(',', array_map('intval', $idSubstrates)) . ") AND 
LeftParticipant.idReaction=$idReaction";

$sqlR="SELECT *, 'Product' AS type FROM RightParticipant WHERE RightParticipant.idMetabolite IN (" . implode(',', array_map('intval', $idProducts)) . ") AND 
RightParticipant.idReaction=$idReaction";

$sql;

if(! empty($idSubstrates) && ! empty($idProducts) ){
	$sql="($sqlL) UNION ($sqlR);";
}
elseif(! empty($idSubstrates)){
	$sql=$sqlL;
}
elseif(! empty($idProducts)){
	$sql=$sqlR;
}
else{
	$response["success"] = true;
	$response["results"] = $results;
	die(json_encode($response));
}

$result=mysqli_query ($link,$sql);

if(! $result) {
	$response["message"] = "Impossible to get the list of the Reactant from the database!" ;
	mysqli_error($link);
	die(json_encode($response));
}

while ($tab=mysqli_fetch_assoc($result))
{
	
	array_push($results, $tab);
}

$response["success"] = true;
$response["results"] = $results;
echo json_encode($response);

?>
