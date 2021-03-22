<?php 
// 
$P_idBioSource=$_POST['idBioSource'];
$sql=$_POST['req'];
$P_Listid=$_POST['id'];
$P_id=0;

require_once '../database/connection.php';
require_once '../database/requete_GroupConcat.php';
require_once '../user/userFunctions.php';

$currentUser=getIdUser();

if(getBioSourceRights($currentUser, $P_idBioSource, $link) == "denied"){
	echo '{"success":false}';
	return;
}

$query = 'SET GLOBAL group_concat_max_len=20000';
mysqli_query($link, $query);

$dataL="";
if (strrpos($sql,"ListidMetabolite")>0) {
	$sqlL= str_replace("ListidMetabolite","ListidMetabLeft",$sql);
	$result= mysqli_query ($link, $$sqlL );
	
	if ($result) {    
	
		$dataL = "";
		while ($row=mysqli_fetch_object($result))
		{	
   			$dataL  = $row->StringId;
		}
		$sql= str_replace("ListidMetabolite","ListidMetabRight",$sql);
	}
}

$result= mysqli_query ($link, $$sql );

$data = "";
if ($result) {
	while ($row=mysqli_fetch_object($result))
	{
   		$data  = $row->StringId;
	}	
}

$res = array();
$res["ids"] = $data.",".$dataL;

$equations = array();

foreach (explode(",", $data) as $P_idReaction)
{
	if ($P_idReaction != "")
	{
		//get equation:
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
		array_push($equations, $equation);
	}
}

$res["equations"] = $equations;

echo json_encode($res);
?>