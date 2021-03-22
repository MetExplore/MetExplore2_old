<?php
$P_idBioSource=$_POST['idBioSource'];

require_once '../database/connection.php';
require_once ('../config/server_variables.php');


$sql= "SELECT DISTINCT Metabolite.id, Metabolite.name, Metabolite.dbIdentifier, Metabolite.chemicalFormula FROM Metabolite, MetaboliteInBioSource WHERE MetaboliteInBioSource.idMetabolite= Metabolite.id AND MetaboliteInBioSource.idBioSource= $P_idBioSource";

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
		$P_id= $row->id;
		$sqlId= "SELECT MetaboliteIdentifiers.extDBName, MetaboliteIdentifiers.extID, MetaboliteIdentifiers.origin, MetaboliteIdentifiers.score FROM MetaboliteIdentifiers WHERE MetaboliteIdentifiers.idMetabolite=$P_id AND MetaboliteIdentifiers.origin IN ('SBML','SBML File', 'UserInput', 'Import')";
			//error_log($sqlId);
		$resultId=mysqli_query ($link, $sqlId);
        $dataId= [];
		if ( $resultId ) {
			while ($rowId=mysqli_fetch_object($resultId))
			{
				$dataId[]= $rowId;
			}
		}
		$row->idin=$dataId;


//		$sqlId= "SELECT MetaboliteLipid.extDBName, MetaboliteLipid.extID, MetaboliteLipid.origin, MetaboliteLipid.score FROM MetaboliteLipid WHERE MetaboliteLipid.idMetabolite=$P_id";
//        //error_log($sqlId);
//        $resultId=mysqli_query ($link, $sqlId);
//        $dataId= [];
//        if ( $resultId ) {
//            while ($rowId=mysqli_fetch_object($resultId))
//            {
//                $dataId[]= $rowId;
//            }
//        }
//        $row->idlipid=$dataId;

		$data [] = $row;
	}
	$response["success"] = true;
	$response["results"] = $data;

}

$fp = fopen('/var/www/tmp/metabolites_'.$P_idBioSource.'_DB.json', 'w');
ftruncate($fp,0);
fwrite($fp, json_encode($response));
fclose($fp);

echo json_encode($response);
?>
