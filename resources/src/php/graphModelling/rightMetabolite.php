<?php
$P_idBioSource=$_POST['idBioSource'];

require_once '../database/connection.php';
//require_once '../database/requete_sel.php';
$sqlRight = "SELECT COUNT(DISTINCT RightParticipant.idReaction) AS nb, RightParticipant.idMetabolite AS idMetabolite
		 	FROM RightParticipant, Metabolite, MetaboliteInBioSource 
		 	WHERE RightParticipant.idMetabolite= Metabolite.id AND Metabolite.id= MetaboliteInBioSource.idMetabolite AND MetaboliteInBioSource.idBioSource=$P_idBioSource
		 	GROUP BY idMetabolite";
// error_log($sqlRight);
  
$resultRight=mysql_query ($sqlLeft) or die (mysql_error ()); 

$data = array();

if (! $resultRight) {
	$response ["message"] = "Impossible to get the list of the metabolites!";
	mysql_error ();
	die ( json_encode ( $response ) );
}

while ($rowRight=mysql_fetch_object($resultRight))
{

	$data[] = $rowRight;
}
echo json_encode($data);


?>