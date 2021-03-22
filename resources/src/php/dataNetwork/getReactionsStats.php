<?php

/***
 * Get curation statistics on reactions
 */

require_once '../database/connection.php';

$idBioSource = $_POST['idBioSource'];
require_once '../user/userFunctions.php';

$currentUser=getIdUser();

if(getBioSourceRights($currentUser, $idBioSource, $link) == "denied"){
	echo '{"success":false}';
	return;
}

//Initialize values:
$nbReact = 0;
$nbReactCatalysed = 0;
$pctCatalyzedReact = 0;

//Get number of all reactions:
$sql1 = "SELECT COUNT(*) AS nb FROM ReactionInBioSource WHERE idBioSource=$idBioSource";
$result1 = mysqli_query($link, $sql1) or die('{success: false, message: "Error while retireving reactions stats (1). Please contact an administrator."}');
if ($row1 = mysqli_fetch_object($result1)) {
	$nbReact = $row1->nb;
}

//Get number of catalyzed reactions:
$sql2 = "SELECT COUNT(*) AS nb FROM ReactionInBioSource WHERE idBioSource=$idBioSource AND id IN (SELECT idReactionInBioSource FROM Catalyses)";
$result2 = mysqli_query($link, $sql2) or die('{success: false, message: "Error while retireving reactions stats (2). Please contact an administrator."}');
if ($row2 = mysqli_fetch_object($result2)) {
	$nbReactCatalysed = $row2->nb;
}

if ($nbReact != 0) {
	$pctCatalyzedReact = round(($nbReactCatalysed / $nbReact) * 100.0);
}

//Get number of reactions in pathway;
$sql2 = "SELECT COUNT(*) AS nb FROM ReactionInBioSource WHERE idBioSource=$idBioSource AND id IN (SELECT idReactionBioSource FROM ReactionInPathway)";
$result2 = mysqli_query($link, $sql2) or die('{success: false, message: "Error while retireving reactions stats (2). Please contact an administrator."}');
if ($row2 = mysqli_fetch_object($result2)) {
	$nbReactInPathway = $row2->nb;
}

if ($nbReact != 0) {
	$pctCatalyzedReact = round(($nbReactCatalysed / $nbReact) * 100.0);
	$pctReactInPath = round(($nbReactInPathway / $nbReact) * 100.0);
}

$result = array(
	"success" => true,
	"nbReact" => $nbReact,
	"nbReactCatalyzed" => $nbReactCatalysed,
	"pctCatalyzedReact" => $pctCatalyzedReact,
	"nbReactInPathway" => $nbReactInPathway,
	"pctReactInPath" => $pctReactInPath
);

echo json_encode($result);

?>