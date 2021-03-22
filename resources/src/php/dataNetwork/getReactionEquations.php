<?php

/**
 * Get equations of given reaction.
 **/

require_once '../database/connection.php';

$P_idReaction=$_POST['idReaction'];
$P_idBioSource=$_POST['idBioSource'];

require_once '../user/userFunctions.php';

$currentUser=getIdUser();

if(getBioSourceRights($currentUser, $P_idBioSource, $link) == "denied"){
	echo '{"success":false}';
	return;
}

$response = array();

//First item: reaction equation with metabolite names:

//Metabolites at left side and reversibility:
$sqlL = "SELECT GROUP_CONCAT(CONCAT(LeftParticipant.coeff,' ',Metabolite.name) SEPARATOR ' + ') AS leftR, GROUP_CONCAT(CONCAT(LeftParticipant.coeff,' ',Metabolite.dbIdentifier) SEPARATOR ' + ') AS leftDbR, GROUP_CONCAT(CONCAT(LeftParticipant.coeff,' ',if(Metabolite.chemicalFormula='','NA', Metabolite.chemicalFormula)) SEPARATOR ' + ') AS leftCR, ReactionInBioSource.reversible AS reversible FROM Metabolite, LeftParticipant, Reaction, ReactionInBioSource WHERE Reaction.id= LeftParticipant.idReaction AND LeftParticipant.idMetabolite= Metabolite.id AND Reaction.id= $P_idReaction AND Reaction.id = ReactionInBioSource.idReaction AND ReactionInBioSource.idBioSource = $P_idBioSource";
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

if ($left->reversible == 0) {
	$arrow = " <span class='arrowEq'>&#10142;</span> ";
}
else {
	$arrow = " <span class='arrowEq'>&#8652;</span> ";
}

$equation = html_entity_decode ($left->leftR . $arrow . $right->rightR) ;

$response["eqName"] =  $equation;

//Equation with identifiers
$equationDb = html_entity_decode ($left->leftDbR . $arrow . $right->rightDbR) ;

$response["eqDB"] = $equationDb;

//Equation with chemical formula:


//Check if left and right are not empty:
$chemEquation = "NA";
if ($left->leftCR != "" && $right->rightCR != "")
{
	$chemEquation = html_entity_decode ($left->leftCR . $arrow . $right->rightCR);
}

//Put chemical formula:
$response["eqForm"] = $chemEquation;

$response["success"] = true;

echo json_encode($response);

?>