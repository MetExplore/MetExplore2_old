<?php
/**
 * Get formulas for all reactions of the BioSource:
 */

require_once '../database/connection.php';

//$idReactions = json_decode($_POST['idReactions'], true);
$P_idBioSource = $_GET['idBioSource'];
/*
require_once '../user/userFunctions.php';

$currentUser=getIdUser();

if(getBioSourceRights($currentUser, $P_idBioSource, $link) == "denied"){
	echo '{"success":false}';
	return;
}


$response = array("data" => array());
*/

$sqlReaction= "SELECT DISTINCT idReaction, reversible FROM ReactionInBioSource WHERE ReactionInBioSource.idBioSource=$P_idBioSource";
$resultReaction= mysqli_query ( $link, $sqlReaction );
$data= array();
$response = array();

if (! $resultReaction) {
    $response ["message"] = "Impossible to get equations";
    $response["success"] = false;
}
else {
    $response["success"] = true;
    $data = array();

    while ($rowR=mysqli_fetch_object($resultReaction)) {

        $P_idReaction = $rowR->idReaction;

        $response["data"][$P_idReaction] = array();

        $sqlL = "SELECT GROUP_CONCAT(CONCAT(LeftParticipant.coeff,' ',Metabolite.name) SEPARATOR ' + ') AS leftR, GROUP_CONCAT(CONCAT(LeftParticipant.coeff,' ',Metabolite.dbIdentifier) SEPARATOR ' + ') AS leftDbR, GROUP_CONCAT(CONCAT(LeftParticipant.coeff,' ',if(Metabolite.chemicalFormula='','NA', Metabolite.chemicalFormula)) SEPARATOR ' + ') AS leftCR  FROM Metabolite, LeftParticipant WHERE LeftParticipant.idMetabolite= Metabolite.id AND LeftParticipant.idReaction= $P_idReaction ";
/*

*/
        $resultleft = mysqli_query($link, $sqlL);
        //error_log($sqlL);
        //error_log($resultleft);
        if (! $resultleft) {
            //error_log('pas left');
            $left = new stdClass();
            $left->leftR = "";
            $left->leftCR = "";
            $left->leftDbR = "";

        } else {
            $left = mysqli_fetch_object($resultleft);
            $left->leftR = html_entity_decode($left->leftR);
            $left->leftCR = html_entity_decode($left->leftCR);
            $left->leftDbR = html_entity_decode($left->leftDbR);

        }
        //error_log($left->leftR);
/*
        if ($left = mysqli_fetch_object($resultleft)) {
            $left->leftR = html_entity_decode($left->leftR);
            $left->leftCR = html_entity_decode($left->leftCR);
            $left->leftDbR = html_entity_decode($left->leftDbR);
        } else {
            $left->leftR = "";
            $left->leftCR = "";
            $left->leftDbR = "";
        }
*/
        //Metabolites at right side:
       $sqlR = "SELECT GROUP_CONCAT(CONCAT(RightParticipant.coeff,' ',Metabolite.name) SEPARATOR ' + ') AS rightR, GROUP_CONCAT(CONCAT(RightParticipant.coeff,' ',Metabolite.dbIdentifier) SEPARATOR ' + ') AS rightDbR, GROUP_CONCAT(CONCAT(RightParticipant.coeff,' ',if(Metabolite.chemicalFormula='','NA', Metabolite.chemicalFormula)) SEPARATOR ' + ') AS rightCR FROM Metabolite, RightParticipant WHERE  RightParticipant.idMetabolite= Metabolite.id AND RightParticipant.idReaction= $P_idReaction";

        $resultright = mysqli_query($link, $sqlR);
        if (! $resultright) {
            $right = new stdClass();
            $right->rightR = "";
            $right->rightCR = "";
            $right->rightDbR = "";
        } else
            $right = mysqli_fetch_object($resultright);
            $right->rightR = html_entity_decode($right->rightR);
            $right->rightCR = html_entity_decode($right->rightCR);
            $right->rightDbR = html_entity_decode($right->rightDbR);


        //Equation:

        if ($rowR->reversible == 0) {
            $arrow = " -> ";
            //$arrow = " <span class='arrowEq'>&#10142;</span> ";
        } else {
            //$arrow = " <span class='arrowEq'>&#8652;</span> ";
            $arrow = " <-> ";
        }

        $equation = html_entity_decode($left->leftR . $arrow . $right->rightR);

        //$response["data"][$P_idReaction]["eqName"] = $equation;

        //Equation with identifiers
        $equationDb = html_entity_decode($left->leftDbR . $arrow . $right->rightDbR);

        //$response["data"][$P_idReaction]["eqDB"] = $equationDb;

        //Equation with chemical formula:


        //Check if left and right are not empty:
        $chemEquation = "NA";
        if ($left->leftCR != "" && $right->rightCR != "") {
            $chemEquation = html_entity_decode($left->leftCR . $arrow . $right->rightCR);
        }
        //Put chemical formula:
        //$response["data"][$P_idReaction]["eqForm"] = $chemEquation;
        //$response["data"][$P_idReaction]["idReaction"] = $P_idReaction;

        $res= array();
        $res["idReaction"]= $P_idReaction;
        $res["eqName"]= $equation;
        $res["eqDB"]= $equationDb;
        $res["eqForm"]= $chemEquation;
        array_push($data, $res);

        $response["success"] = true;
        $response["results"] = $data;
    }


}



echo json_encode($response);

?>