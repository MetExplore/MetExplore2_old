<?php
require_once("../database/connection.php");

$functionParam= json_decode($_POST['functionParam'], $assoc=true);

extract ( $functionParam, EXTR_OVERWRITE );

$response["success"] = false;

$sql ="SELECT Reaction.id AS id, Reaction.generic AS generic, Reaction.go AS go, Reaction.goName AS goName, ReactionInBioSource.fast AS fast, ReactionInBioSource.kineticFormula AS klaw, 
ReactionHasStatus.idStatus AS idStatus, 
GROUP_CONCAT(Biblio.idBiblio,'|',Biblio.pubmedId SEPARATOR ',' ) AS biblio FROM ReactionInBioSource, Reaction 
LEFT OUTER JOIN ReactionHasReference ON (Reaction.id=ReactionHasReference.idReaction) 
LEFT OUTER JOIN Biblio ON (ReactionHasReference.idBiblio=Biblio.idBiblio) 
LEFT OUTER JOIN ReactionHasStatus ON (Reaction.id=ReactionHasStatus.idReaction) 
WHERE  Reaction.id = ReactionInBioSource.idReaction AND ReactionInBioSource.idReaction=$idReaction AND ReactionInBioSource.idBioSource = $idBiosource 
GROUP BY Reaction.id";

$result=mysqli_query ($link,$sql);

if(! $result) {
	$response["message"] = "Unable to get complementary data on the reaction" ;
	mysqli_error($link);
	die(json_encode($response));
}

$results = array();

while ($tab=mysqli_fetch_assoc($result))
{
	$results=$tab;
}

$response["success"] = true;
$response["results"] = $results;
echo json_encode($response);

?>
