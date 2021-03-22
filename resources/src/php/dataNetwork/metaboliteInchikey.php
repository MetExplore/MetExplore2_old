<?php
$P_idBioSource=$_GET['idBioSource'];

require_once '../database/connection.php';
require_once '../user/userFunctions.php';


$currentUser=getIdUser();
if(getBioSourceRights($currentUser, $P_idBioSource, $link) == "denied"){
	echo '{"success":false}';
	return;
}


$sql= "SELECT DISTINCT MetaboliteIdentifiers.idMetabolite AS id, MetaboliteIdentifiers.extID AS inchikey, MetaboliteIdentifiers.score AS score FROM MetaboliteIdentifiers, MetaboliteInBioSource WHERE MetaboliteInBioSource.idMetabolite= MetaboliteIdentifiers.idMetabolite AND MetaboliteInBioSource.idBioSource= $P_idBioSource AND extDBName=\"inchikey\" AND  (MetaboliteIdentifiers.origin=\"SBML File\" OR MetaboliteIdentifiers.origin=\"SBML\" OR MetaboliteIdentifiers.origin=\"Import\" OR MetaboliteIdentifiers.origin=\"UserInput\")";

//error_log($sql);
$result=mysqli_query ($link, $sql);
$data = array();

$response = array();

if (! $result) {
	$response ["message"] = "Impossible to get the list of the metabolites!";
	$response["success"] = false;
	// error_log($result);
}
else {
	while ($row=mysqli_fetch_object($result))
	{
		$data [] = $row;
	}
    $response["success"] = true;
    $response["results"] = $data;
}
echo json_encode($response);

?>
