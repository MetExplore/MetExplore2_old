<?php
        
$P_idBioSource=$_GET['idBioSource'];

require_once '../database/connection.php';
//require_once '../database/requete_sel.php';

$sqlLeft= 	"SELECT COUNT(DISTINCT LeftParticipant.idReaction) AS nbLeft, LeftParticipant.idMetabolite AS idMetabolite
			FROM LeftParticipant, Metabolite, MetaboliteInBioSource 
			WHERE LeftParticipant.idMetabolite= Metabolite.id AND Metabolite.id= MetaboliteInBioSource.idMetabolite AND MetaboliteInBioSource.idBioSource=$P_idBioSource
			GROUP BY idMetabolite
			ORDER BY idMetabolite"; 

$sqlRight = "SELECT COUNT(DISTINCT RightParticipant.idReaction) AS nbRight, RightParticipant.idMetabolite AS idMetabolite
		 	FROM RightParticipant, Metabolite, MetaboliteInBioSource 
		 	WHERE RightParticipant.idMetabolite= Metabolite.id AND Metabolite.id= MetaboliteInBioSource.idMetabolite AND MetaboliteInBioSource.idBioSource=$P_idBioSource
		 	GROUP BY idMetabolite
		 	ORDER BY idMetabolite";


$resultLeft= $link->query($sqlLeft);
$resultRight= $link->query($sqlRight);

$data = array();
$right = array();
$left = array();

//$leftId = array();

if (! $resultLeft || ! $resultRight) {
	$response ["message"] = "Impossible to get the list of the metabolites!";
	mysql_error ();
	die ( json_encode ( $response ) );
}


while ($rowRight= mysqli_fetch_array($resultRight, MYSQLI_ASSOC))
{
	$right[]= $rowRight;
	$rightKey[]= $rowRight["idMetabolite"];
	$rightNb[]= $rowRight["nbRight"];
}
$rightCombi= array_combine($rightKey, $rightNb);
//print_r($rightCombi);


while ($rowLeft=mysqli_fetch_array($resultLeft, MYSQLI_ASSOC))
{
	$left[]= $rowLeft;
	$idMetabolite= $rowLeft["idMetabolite"];
	$nbLeft= $rowLeft["nbLeft"];
	
	$nbRight= $rightCombi[$idMetabolite];
	if ($nbRight) { 
		unset($rightCombi[$idMetabolite]);
	}
	else {
		$nbRight=0;
	}
	$topo=0;
	if ($nbLeft>1 && $nbRight>1) 		{$topo=1; } 
	elseif ($nbLeft ==0 && $nbRight > 1 ) 	{$topo=2; }
	elseif ($nbLeft > 1 && $nbRight ==0 ) 	{$topo=3; }
	elseif ($nbLeft > 1 && $nbRight ==1 ) 	{$topo=4; }
	elseif ($nbLeft ==1 && $nbRight > 1 ) 	{$topo=5; }
	elseif ($nbLeft ==1 && $nbRight ==0 ) 	{$topo=7; }
	elseif ($nbLeft ==0 && $nbRight ==1 ) 	{$topo=8; }
	elseif ($nbLeft ==1 && $nbRight ==1 ) {
		//$topo=69;
			$idR=0; $idL=0;
			$sqlLeftReaction= 	"SELECT LeftParticipant.idReaction AS idReaction FROM LeftParticipant 
								WHERE LeftParticipant.idMetabolite= $idMetabolite";
			//error_log($sqlLeftReaction);
			$reactionLeft=$link->query($sqlLeftReaction) or die (mysql_error ());
			$idLeftReaction= mysqli_fetch_object($reactionLeft);
			if ($idLeftReaction) {$idL= $idLeftReaction->idReaction;}
			
			$sqlRightReaction= 	"SELECT RightParticipant.idReaction AS idReaction, RightParticipant.idMetabolite AS idMetabolite
								FROM RightParticipant WHERE RightParticipant.idMetabolite= $idMetabolite";
			$reactionRight=$link->query($sqlRightReaction) or die (mysql_error ());
			$idRightReaction= mysqli_fetch_object($reactionRight);
			if ($idRightReaction) {$idR= $idRightReaction->idReaction;}
			$topo=0;
			if ($idR !=0 && $idL !=0) {
				if ($idR == $idL) {$topo=9;} 
				else {$topo=6;} 									
			}
	}

	$leftId[]= $idMetabolite;
	$topology["idMetabolite"]= $idMetabolite;	
	$topology["topo"]= $topo;

	$data[] = $topology;
}
//print_r($rightCombi);	
// parcourir tous ce qu'il reste dans rightCombi (unset a enlever ce qui est deja traite
$nbLeft= 0;

foreach ($rightCombi as $rowKey=>$rowValue) {
	
	//print_r($rowKey);
	if ($rowValue=1) {$topo=8;} elseif ($rowValue>1) {$topo=2;}
	$topology["idMetabolite"]= $rowKey;	
	$topology["topo"]= $topo;
	$data[] = $topology;
		
}

echo json_encode($data);


?>