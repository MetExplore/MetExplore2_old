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
		$sqlL = "SELECT  LeftParticipant.idMetabolite AS idMetabolite, LeftParticipant.idReaction AS idReaction FROM Metabolite, MetaboliteInBioSource, LeftParticipant WHERE MetaboliteInBioSource.idMetabolite=Metabolite.id AND Metabolite.id=LeftParticipant.idMetabolite AND MetaboliteInBioSource.idBioSource=$P_idBioSource";
		$resultleft = mysqli_query ($link, $sqlL);

		
		if ($resultleft) {
			while ( $rowL = mysqli_fetch_object ( $resultleft ) ) {
		
				//$rowL->idReaction = $P_idReaction;
				//$rowL->reversible = $P_reversible;		
				//$rowL->edgeId= $rowL->idMetabolite.' -- '.$P_idReaction;
				$rowL->interaction= 'in';
				$data [] = $rowL;	
			}	
		}
		
		$sqlR = "SELECT RightParticipant.idMetabolite AS idMetabolite, RightParticipant.idReaction AS idReaction FROM Metabolite, MetaboliteInBioSource, RightParticipant WHERE MetaboliteInBioSource.idMetabolite=Metabolite.id AND Metabolite.id=RightParticipant.idMetabolite AND MetaboliteInBioSource.idBioSource=$P_idBioSource";
		$resultright = mysqli_query ($link, $sqlR);
		//$idProducts= array();
		
		if ($resultright) {
			while ( $rowR = mysqli_fetch_object ( $resultright ) ) {
		
				//$rowR->idReaction= $P_idReaction;
				//$rowR->reversible = $P_reversible;		
				//$rowR->edgeId= $P_idReaction.' -- '.$rowR->idMetabolite;
				$rowR->interaction= 'out';
				$data [] = $rowR;	
			}	
		}
	//}
	
	$response["success"] = true;
	$response["results"] = $data;
	
//}

echo json_encode($response);


?>