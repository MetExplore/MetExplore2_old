<?php
/**
 * Get all Reactions details of each reaction that compose the pathway.
 */

require_once '../database/connection.php';

$Pathway = $_GET['idPathway'];

//Get informations about BioSource:
$sql = "SELECT DatabaseRef.name AS nameDB, DatabaseRef.url AS urlDB, DatabaseRef.type AS typeDB"
	   ." FROM Pathway, DatabaseRef"
	   ." WHERE Pathway.id = $Pathway"
	   ." AND Pathway.idDB = DatabaseRef.id";

$result = mysqli_query ( $link, $sql ) or die ( mysql_error () );
if ($row = mysqli_fetch_object ( $result ))
{
	$nameDB = $row->nameDB;
	$urlDB = $row->urlDB;
	$typeDB = $row->typeDB;
}
else 
{
	die("ERROR: can't get informations on DatabaseRef.");
}

//Get informations about all Reactions that compose Pathway:
$sql = "SELECT DISTINCT ReactionInBioSource.idReaction AS idReaction"
	   ." FROM ReactionInPathway, ReactionInBioSource"
	   ." WHERE ReactionInPathway.idPathway=$Pathway"
	   ." AND ReactionInPathway.idReactionBioSource = ReactionInBioSource.id";

$result = mysqli_query ( $link, $sql ) or die ( mysql_error () );

$results = array();

while($row = mysqli_fetch_object ( $result ))
{
	$P_idReaction=$row->idReaction;
	$res = array();
	
	//Get name and dbIdentifier of reaction:
	$sql = "SELECT name, dbIdentifier"
		   ." FROM Reaction"
		   ." WHERE id=$P_idReaction";
	$resultR = mysqli_query ( $link, $sql ) or die ( mysql_error () );
	if($rowR = mysqli_fetch_object ( $resultR ))
	{
		$res["name"] = html_entity_decode ( $rowR->name );
		$res["dbIdentifier"] = html_entity_decode ( $rowR->dbIdentifier );
	}
	else 
	{
		die("ERROR: can't get name and dbIdentifier for at least one reaction : $P_idReaction");
	}
	
	//Make url if Biosource type is biocyc or TrypanoCyc:
	if ($typeDB=="biocyc" || $typeDB=="BioCyc" || $typeDB=="TrypanoCyc")
	{
		if ($urlDB=="")
		{
			$res["url"] = "http://metacyc.org/META/NEW-IMAGE?type=REACTION&object=" . $res["dbIdentifier"];
		}
		else
		{
			$res["url"] = $urlDB. "/" . $nameDB . "/NEW-IMAGE?type=REACTION&object=" . $res["dbIdentifier"];
		}
	}
	else {
		$res["url"] = "NONE";
	}
	
	//Reaction equation with metabolite names:
	
	//Metabolites at left side:
	$sqlL = "SELECT GROUP_CONCAT(CONCAT(LeftParticipant.coeff,' ',Metabolite.name) SEPARATOR ' + ') AS leftR, GROUP_CONCAT(CONCAT(LeftParticipant.coeff,' ',Metabolite.dbIdentifier) SEPARATOR ' + ') AS leftDbR, GROUP_CONCAT(CONCAT(LeftParticipant.coeff,' ',if(Metabolite.chemicalFormula='','NA', Metabolite.chemicalFormula)) SEPARATOR ' + ') AS leftCR FROM Metabolite, LeftParticipant, Reaction WHERE Reaction.id= LeftParticipant.idReaction AND LeftParticipant.idMetabolite= Metabolite.id AND Reaction.id= $P_idReaction";
	$resultleft = mysqli_query ( $link, $sqlL ) or die ( mysql_error () );
	if ($left = mysqli_fetch_object ( $resultleft ))
	{
		$left->leftR = html_entity_decode ( $left->leftR );
		$left->leftCR = html_entity_decode ( $left->leftCR );
		$left->leftDbR = html_entity_decode ( $left->leftDbR );
	}
	else
	{
		$left->leftR = "";
		$left->leftCR = "";
		$left->leftDbR = "";
	}
	
	//Metabolites at right side:
	$sqlR = "SELECT GROUP_CONCAT(CONCAT(RightParticipant.coeff,' ',Metabolite.name) SEPARATOR ' + ') AS rightR, GROUP_CONCAT(CONCAT(RightParticipant.coeff,' ',Metabolite.dbIdentifier) SEPARATOR ' + ') AS rightDbR, GROUP_CONCAT(CONCAT(RightParticipant.coeff,' ',if(Metabolite.chemicalFormula='','NA', Metabolite.chemicalFormula)) SEPARATOR ' + ') AS rightCR FROM Metabolite, RightParticipant, Reaction WHERE Reaction.id= RightParticipant.idReaction AND RightParticipant.idMetabolite= Metabolite.id AND Reaction.id= $P_idReaction";
	$resultright = mysqli_query ( $link, $sqlR ) or die ( mysql_error () );
	if ($right = mysqli_fetch_object ( $resultright ))
	{
		$right->rightR = html_entity_decode ( $right->rightR );
		$right->rightCR = html_entity_decode ( $right->rightCR );
		$right->rightDbR = html_entity_decode ( $right->rightDbR );
	}
	else
	{
		$right->rightR = "";
		$right->rightCR = "";
		$right->rightDbR = "";
	}
	
	//Equation:
	$equation = html_entity_decode ($left->leftR . " -> " . $right->rightR) ;
	
	$res["equation"] = $equation;
	
	array_push($results, $res);
}

	$response["success"] = true;
	$response["results"] = $results;
	echo json_encode($response);

?>