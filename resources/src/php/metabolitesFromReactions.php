<?php
// Returns the metabolite ids corresponding to a list of reaction ids

require_once("database/connection.php");


extract($_POST,  EXTR_OVERWRITE);

$response["success"] = false;

if(! isset($ids) || $ids == "") {
	$response["message"] = "No reaction";
	die(json_encode($response));
}

$reqL = "SELECT DISTINCT m.id as idMetabolite FROM Metabolite m, LeftParticipant p, Reaction r ".
		"WHERE p.idMetabolite=m.id AND r.id=p.idReaction AND r.id IN($ids)";

$reqR = "SELECT DISTINCT m.id as idMetabolite FROM Metabolite m, RightParticipant p, Reaction r ".
		"WHERE p.idMetabolite=m.id AND r.id=p.idReaction AND r.id IN($ids)";

$req = $reqL." UNION ".$reqR;

$res = mysqli_query($link,$req);

if(! $res) {
	$response["message"] = "Problem in query ".$req;
	die(json_encode($response));
}

$metabolite_ids ="";

$n = 0;

while ($tab=mysqli_fetch_assoc($res))
{
	$idMetabolite = $tab["idMetabolite"];
	
	if($n == 0)
	{
		$metabolite_ids = $idMetabolite;
	}
	else 
	{
		$metabolite_ids = $metabolite_ids.",".$idMetabolite;
	}
	
	$n++;
}

$response["success"] = true;
$response["ids"] = $metabolite_ids;

print(json_encode($response));


?>
