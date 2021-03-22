<?php
$P_idBioSource=$_GET['idBioSource'];

require_once '../database/connection.php';
require_once '../user/userFunctions.php';

$currentUser=getIdUser();

if(getBioSourceRights($currentUser, $P_idBioSource, $link) == "denied"){
	echo '{"success":false}';
	return;
}

$sql= "SELECT DISTINCT MetaboliteIdentifiers.extDBName AS extDBName FROM MetaboliteIdentifiers, MetaboliteInBioSource WHERE MetaboliteInBioSource.idMetabolite= MetaboliteIdentifiers.idMetabolite AND MetaboliteInBioSource.idBioSource= $P_idBioSource AND  (MetaboliteIdentifiers.origin=\"SBML File\" OR MetaboliteIdentifiers.origin=\"SBML\" OR MetaboliteIdentifiers.origin=\"Import\" OR MetaboliteIdentifiers.origin=\"UserInput\") ";

//error_log($sql);
$result=mysqli_query ($link, $sql);
$data = array();
$dataId= array();

if (! $result) {
	$response ["message"] = "Impossible to get the list of the metabolites!";
	$response["success"] = false;
}
else {
	while ($row=mysqli_fetch_object($result))
	{
		$P_extDB= $row->extDBName;
		if ($P_extDB != "inchi") {
			$sqlId= "SELECT MetaboliteIdentifiers.idMetabolite AS idMetabolite, group_concat( extID SEPARATOR ' || ') AS DBids FROM MetaboliteIdentifiers, MetaboliteInBioSource WHERE MetaboliteIdentifiers.extDBName=\"$P_extDB\" AND MetaboliteInBioSource.idMetabolite= MetaboliteIdentifiers.idMetabolite AND MetaboliteInBioSource.idBioSource= $P_idBioSource AND  (MetaboliteIdentifiers.origin=\"SBML File\" OR MetaboliteIdentifiers.origin=\"SBML\" OR MetaboliteIdentifiers.origin=\"Import\" OR MetaboliteIdentifiers.origin=\"UserInput\") GROUP BY idMetabolite;";
			//error_log($sqlId);
			$resultId=mysqli_query ($link, $sqlId);
			
			if ( $resultId ) {
				while ($rowId=mysqli_fetch_object($resultId))
				{
					$rowId->DB=$P_extDB;
					$dataId[]= $rowId;
				}
			}
			//$row->Id=$dataId;

			$data [] = $row;
		}
		
		
	}
	$response["success"] = true;
	$response["results"]["DBName"] = $data;
	$response["results"]["Ids"] = $dataId;
	
}
echo json_encode($response);

?>
