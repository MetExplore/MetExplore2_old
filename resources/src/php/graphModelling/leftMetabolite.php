<?php
$P_idBioSource=$_GET['idBioSource'];

require_once '../database/connection.php';
//require_once '../database/requete_sel.php';

$sqlLeft= 	"SELECT COUNT(DISTINCT LeftParticipant.idReaction) AS nb, LeftParticipant.idMetabolite AS idMetabolite
			FROM LeftParticipant, Metabolite, MetaboliteInBioSource 
			WHERE LeftParticipant.idMetabolite= Metabolite.id AND Metabolite.id= MetaboliteInBioSource.idMetabolite AND MetaboliteInBioSource.idBioSource=$P_idBioSource
			GROUP BY idMetabolite"; 

// error_log($sqlLeft);

$resultLeft=mysql_query ($sqlLeft) or die (mysql_error ());    

$data = array();

if (! $resultLeft) {
	$response ["message"] = "Impossible to get the list of the metabolites!";
	mysql_error ();
	die ( json_encode ( $response ) );
}

while ($rowLeft=mysql_fetch_object($resultLeft))
{
	$data[] = $rowLeft;
}
echo json_encode($data);


?>