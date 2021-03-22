<?php
// Returns the pathways corresponding to metabolite mysql ids in a BioSource

extract($_POST,  EXTR_OVERWRITE);
if(! isset($ids) || $ids == "") {
	$response["message"] = "No reaction";
	die(json_encode($response));
}

if(! isset($idBioSource)) {
	$response["message"] = "No BioSource specified";
	die(json_encode($response));
}

require_once 'database/connection.php';

$a_ids = explode(",", $ids);

$l = count($a_ids);

$results = array();

$response ["success"] = false;

for($i = 0; $i<$l; $i++) 
{
	
	
	$reactionId = $a_ids[$i];
	
	$results[$reactionId] = array();
	$req = "SELECT DISTINCT Pathway.id AS idInBio, Pathway.id AS id, Pathway.name AS name, Pathway.dbIdentifier AS dbIdentifier FROM Pathway, ReactionInPathway, ReactionInBioSource WHERE Pathway.id=ReactionInPathway.idPathway  AND ReactionInPathway.idReactionBioSource = ReactionInBioSource.id AND ReactionInBioSource.idReaction=$reactionId AND ReactionInBioSource.idBioSource = $idBioSource";
	
	$resReq = mysqli_query ($link, $req); 
	
	if(! $resReq) {
		$response["message"] = "Impossible to  get pathways of the reaction ".$reactionId;
		die(json_encode($response));
	}
	
	while ($tab=mysqli_fetch_assoc($resReq))
	{
		$resPathway = array();
		
		$resPathway["id"] = $tab["id"];
		$resPathway["idInBio"] = $tab["idInBio"];
		$resPathway["name"] = $tab["name"];
		$resPathway["dbIdentifier"] = $tab["name"];
		
		array_push($results[$reactionId], $resPathway);
	}
	
	//array_push($results, $res);
}

$response["success"] = true;
$response["results"] = $results;
echo json_encode($response);

?>
