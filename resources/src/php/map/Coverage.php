<?php
/*--------------------------------------------------------------------------------
 * recherche de la couverture :
 *  coverage : element sur lequel on cherche cherche la couverture
 *  typeId   : 
 *  
 *  exemple : qd je cherche coverage des pathways en ayant une liste id Metabolite 
 *  	coverage = Pathway
 *  	typeId = Metabolite Left
 *  	req reçue = R_Pathway_listLeftParticipant
 *  requete du fichier Coverage = 
 *  	in : liste de Metabolite
 *  	out : liste des pathways couvert avec StringId qui contient liste des idMetabolite contenus
 */

$P_idBioSource=$_GET['idBioSource'];
$sql=$_GET['req'];
$P_Listid=$_GET['id'];
$P_Listid_array = array_map('strval', explode(',', $P_Listid));

require_once '../database/connection.php';
require_once '../database/requete_Coverage.php';

$response["success"] = false;
$result=mysql_query ($$sql) or die (mysql_error ());

while ($row=mysql_fetch_object($result))
{
	$P_id=$row->id;
	$P_StringId_array = array_map('strval', explode(',', $row->StringId));
	
	$intersect = array_intersect($P_StringId_array, $P_Listid_array);
	$lengthintersect = sizeof($intersect);
	
	require_once '../database/requete_Count.php'; 
	$resultCount=mysql_query ($$sql) or die (mysql_error ());
	$rowCount=mysql_fetch_object($resultCount);
	if (rowCount) {
		$Coverage["nb"] = $rowCount->nb;
		$Coverage["coverage"] = round(($lengthintersect * 100) / $Coverage["nb"], 2); 
	} else {
		$Coverage["nb"] =0;
		$Coverage["coverage"]=0;
	}
	
	$Coverage["id"] = $P_id;
	$Coverage["nbMapped"] = $lengthintersect;
	
	$data[] = $pathwayCoverage;
}

$response["success"]=true;
$response["data"]=$data;
echo json_encode($response);
?>