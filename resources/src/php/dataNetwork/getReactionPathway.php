<?php
//
$P_idBioSource = $_GET ['idBioSource'];


require_once '../database/connection.php';
require_once '../user/userFunctions.php';

$currentUser=getIdUser();


if(getBioSourceRights($currentUser, $P_idBioSource, $link) == "denied"){
	echo '{"success":false}';
	return;
}

/*
$response ["success"] = false;

$sql = "SELECT Reaction.id AS idReaction, ReactionInBioSource.reversible AS reversible FROM Reaction, ReactionInBioSource WHERE ReactionInBioSource.idReaction= Reaction.id AND ReactionInBioSource.idBioSource= $P_idBioSource"; 
$result=mysqli_query($link,$sql) ;

if (! $result) {
	$response ["message"] = "Impossible to get the list of the pathways!";
	$response["success"] = false;
}
else {

	$data = array();
	//$IdMetabolite = array();
	
	while ( $row = mysqli_fetch_object ( $result ) ) {
	
		$P_idReaction = $row->idReaction;

		$P_reversible = $row->reversible;
*/		
		$data = array();
		$sql = "SELECT ReactionInBioSource.idReaction AS idReaction, ReactionInPathway.idPathway AS idPathway FROM ReactionInBioSource, ReactionInPathway WHERE ReactionInBioSource.id=ReactionInPathway.idReactionBioSource AND ReactionInBioSource.idBioSource=$P_idBioSource";
		$result = mysqli_query ($link, $sql);

		
		if ($result) {
			while ( $row = mysqli_fetch_object ( $result ) ) {
				$data [] = $row;	
			}	
		}
		
	//}
	
	$response["success"] = true;
	$response["results"] = $data;
	
//}

echo json_encode($response);


?>