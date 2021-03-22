<?php
//
$P_idBioSource = $_POST ['idBioSource'];
$sql = $_POST ['req'];
$P_Listid = $_POST ['id'];
$P_getVotes = $_POST ['getVotes'] == "true";

require_once '../database/connection.php';
require_once '../database/requete_sel.php';
require_once 'getVotesFunctions.php';
require_once '../user/userFunctions.php';

$currentUser=getIdUser();

if(getBioSourceRights($currentUser, $P_idBioSource, $link) == "denied"){
	echo '{"success":false}';
	return;
}

//$sql = $$sql . " ORDER BY name"; // .$order." ".$direction." LIMIT ".$start.",".$limit;//
$result = mysqli_query ($link, $$sql );
$response= array();
if (! $result) {
	$response ["message"] = "Impossible to get the list of the reactions!";
	$response["success"] = false;
}
else {

	$data = array();
	
	require_once 'dataDatabaseRef.php';
	
	while ( $row = mysqli_fetch_object ( $result ) ) {
	
		$row->name= html_entity_decode ( $row->name );	
		$P_idReaction = $row->id;
		
		//Get votes if necessary:
		if ($P_getVotes) {
			$votes = getVotesForObject($P_idReaction, "Reaction", $link);
			$row->votes = $votes["votes"];
			$row->hasVote = $votes["hasVote"] ? "yes" : "no";
			// error_log("hasVote:" . $row->hasVote);
		}
		
		/*$sqlL = "SELECT GROUP_CONCAT(CONCAT(LeftParticipant.coeff,' ',Metabolite.name) SEPARATOR \" + \") AS leftR FROM Metabolite, LeftParticipant, Reaction WHERE Reaction.id= LeftParticipant.idReaction AND LeftParticipant.idMetabolite= Metabolite.id AND Reaction.id= $P_idReaction";
		$resultleft = mysql_query ( $sqlL, $con ) or die ( mysql_error () );
		if ($left = mysql_fetch_object ( $resultleft ))
			$left->leftR = html_entity_decode ( $left->leftR );
		else
			$left->leftR = "";
		
		$sqlL = "SELECT LeftParticipant.idMetabolite AS id FROM LeftParticipant WHERE LeftParticipant.idReaction= $P_idReaction";
		$resultleft = mysqli_query ( $link, $sqlL);
		$idSubstrates= array();
		
		if ($resultleft) {
			while ( $rowL = mysqli_fetch_object ( $resultleft ) ) {
				$idSubstrates[]= $rowL->id;		
			}	
		}
		
		$sqlL = "SELECT GROUP_CONCAT(CONCAT(LeftParticipant.coeff,' ',Metabolite.name) SEPARATOR \" + \") AS leftR FROM Metabolite, LeftParticipant, Reaction WHERE Reaction.id= LeftParticipant.idReaction AND LeftParticipant.idMetabolite= Metabolite.id AND Reaction.id= $P_idReaction";
		$resultleft = mysql_query ( $sqlR, $con ) or die ( mysql_error () );
		if ($right = mysql_fetch_object ( $resultright ))
			$right->rightR = html_entity_decode ( $right->rightR );
		else
			$right->rightR = "";
		
		$sqlR = "SELECT GROUP_CONCAT(CONCAT(RightParticipant.coeff,' ',Metabolite.name) SEPARATOR \" + \") AS rightR FROM Metabolite, RightParticipant, Reaction WHERE Reaction.id= RightParticipant.idReaction AND RightParticipant.idMetabolite= Metabolite.id AND Reaction.id= $P_idReaction";
		$resultright = mysql_query ( $sqlR, $con ) or die ( mysql_error () );
		if ($right = mysql_fetch_object ( $resultright ))
			$right->rightR = html_entity_decode ( $right->rightR );
		else
			$right->rightR = "";
	
		$row->formule = html_entity_decode ($left->leftR . " -> " . $right->rightR) ;
		
		$sqlR = "SELECT RightParticipant.idMetabolite AS id FROM RightParticipant WHERE RightParticipant.idReaction= $P_idReaction";
		$resultright = mysqli_query ( $link, $sqlR ) ;
		$idProducts= array();
		
		if ($resultright) {
			while ( $rowR = mysqli_fetch_object ( $resultright ) ) {
				$idProducts[]= $rowR->id;		
			}	
		}
		
		$row->substrates = $idSubstrates;
		$row->products = $idProducts;*/
		
		//Link to database:
		if ($rowDB && ($rowDB->type=="biocyc" || $rowDB->type=="BioCyc" || $rowDB->type=="TrypanoCyc"))
		{
			if ($rowDB->url=="")
			{
				$row->linkToDB = "http://metacyc.org/META/NEW-IMAGE?type=REACTION&object=" . $row->dbIdentifier;
			}
			else
			{
				$row->linkToDB = $rowDB->url . '/' . $rowDB->name . "/NEW-IMAGE?type=REACTION&object=" . $row->dbIdentifier;
			}
		}
		else {
			$row->linkToDB = "NONE";
		}
		
		$data [] = $row;
	}
	$response["success"] = true;
	$response["results"] = $data;

}
echo json_encode($response);


?>
