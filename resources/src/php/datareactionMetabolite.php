<?php
$P_idBioSource=$_GET['idBioSource'];
$sql=$_GET['req'];
$P_Listid=$_GET['id'];
$side= json_decode($_GET['side']);
// retourne ordre du tableau pour lors de la recherche trouver la derniere annotation
//error_log($side);
//$side=[];
require_once 'database/connection.php';
require_once 'database/requete_sel.php';

$result=mysqli_query ($link,$$sql) or die (mysqli_error ($link));
 
$data = array();
while ($row=mysqli_fetch_object($result))
{
	$P_idReaction=$row->id;
	
	$row->name = html_entity_decode($row->name);
	
	//Ajout objet Metabolite
		
	$sqlL= "SELECT DISTINCT Metabolite.id AS idInBio, Metabolite.id AS id, Metabolite.name AS name, Metabolite.chemicalFormula AS chemicalFormula, Metabolite.dbIdentifier AS dbIdentifier, Metabolite.smiles AS smiles, Metabolite.caas AS caas, Metabolite.weight AS weight, Metabolite.generic AS generic, LeftParticipant.coeff AS coeff, LeftParticipant.cofactor AS cofactor, MetaboliteInBioSource.sideCompound AS sideCompound FROM Metabolite, MetaboliteInBioSource, LeftParticipant WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND LeftParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource AND LeftParticipant.idReaction = $P_idReaction";
			
	$resultleft= mysqli_query ($link,$sqlL) or die (mysqli_error ($link));
	$dataL = array();		
	while ($rowL=mysqli_fetch_object($resultleft))
	{
		$rowL->name = html_entity_decode($rowL->name);
		foreach($side as $element)
		{
    		if ($element[0]== $rowL->id) { 
    			if ($element[1]=='true') $rowL->sideCompound="1"; else $rowL->sideCompound="0";
    		}
		}
		
		$dataL[]= $rowL;
	}
	$row->substrates= $dataL;
	
			
	$sqlR= "SELECT DISTINCT Metabolite.id AS idInBio, Metabolite.id AS id, Metabolite.name AS name, Metabolite.chemicalFormula AS chemicalFormula, Metabolite.dbIdentifier AS dbIdentifier, Metabolite.smiles AS smiles, Metabolite.caas AS caas, Metabolite.weight AS weight, Metabolite.generic AS generic, RightParticipant.coeff AS coeff, RightParticipant.cofactor AS cofactor, MetaboliteInBioSource.sideCompound AS sideCompound FROM Metabolite, MetaboliteInBioSource, RightParticipant WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND RightParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource AND RightParticipant.idReaction = $P_idReaction";		
	
	$resultright= mysqli_query ($link,$sqlR) or die (mysqli_error ($link));
	$dataR = array();		
	while ($rowR=mysqli_fetch_object($resultright))
	{
		$rowR->name = html_entity_decode($rowR->name);
		foreach($side as $element)
		{
    		if ($element[0]== $rowR->id) { 
    			if ($element[1]=='true') $rowR->sideCompound="1"; else $rowR->sideCompound="0";
    		}
		}
		//$rowR->sideCompound= $i+10;
		//if (($i=array_search($rowR->id,$side))!=false) {
			//$rowR->sideCompound= "1";
			//print_r($i);
		//}
		
		$dataR[]= $rowR;
	}
		
	$row->products= $dataR;
	
	$data [] = $row;
}

//echo '({"total":"'.$totaldata.'","results":'.json_encode($data).'})';
echo json_encode($data);
/*
 * 
 *    $sqlL="SELECT DISTINCT GROUP_CONCAT(CONCAT(LeftParticipant.coeff,' ',Metabolite.name) SEPARATOR \" + \") AS leftR FROM Metabolite, LeftParticipant, Reaction WHERE Reaction.id= LeftParticipant.idReaction AND LeftParticipant.idMetabolite= Metabolite.id AND Reaction.id= $P_idReaction";		
	$resultleft=mysql_query ($sqlL, $con) or die (mysql_error ());
	if ($left= mysql_fetch_object($resultleft)) $row->leftR= $left->leftR; else $row->leftR="";
		
	$sqlR="SELECT DISTINCT GROUP_CONCAT(CONCAT(RightParticipant.coeff,' ',Metabolite.name) SEPARATOR \" + \") AS rightR FROM Metabolite, RightParticipant, Reaction WHERE Reaction.id= RightParticipant.idReaction AND RightParticipant.idMetabolite= Metabolite.id AND Reaction.id= $P_idReaction";
	$resultright=mysql_query ($sqlR, $con) or die (mysql_error ());
	if ($right= mysql_fetch_object($resultright)) $row->rightR= $right->rightR; else $row->rightR="";

	$row->formule= $left->leftR." -> ".$right->rightR;
	
	$row->formule = html_entity_decode($row->formule);
	
	$sql= "SELECT Status.status AS score, Status.name AS scoreName FROM ReactionHasStatus, Status WHERE ReactionHasStatus.idReaction=$P_idReaction AND ReactionHasStatus.idStatus=Status.idStatus AND Status.idStatusType=1";
	$resultscore= mysql_query ($sql, $con) or die (mysql_error ());
	if ($score= mysql_fetch_object($resultscore)) {
		$row->score= $score->score;
		$row->scoreName= $score->scoreName;
	} else {
		$row->score= 0;
		$row->scoreName= "Not evaluated";		
	}

	$sql= "SELECT Status.status AS status, Status.name AS statusName FROM ReactionHasStatus, Status WHERE ReactionHasStatus.idReaction=$P_idReaction AND ReactionHasStatus.idStatus=Status.idStatus AND Status.idStatusType=2";
	$resultstatus= mysql_query ($sql, $con) or die (mysql_error ());
	if ($status= mysql_fetch_object($resultstatus)) {
		$row->status= $status->status;
		$row->statusName= $status->statusName;
	} else {
		$row->status= 0;
		$row->statusName= "Raw";		
	}
				

 */
?>
