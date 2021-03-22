<?php 
// 
$P_idBioSource=$_POST['idBioSource'];
$sql=$_POST['req'];
$P_Listid=$_POST['id'];
$P_getVotes = $_POST ['getVotes'] == "true";

require_once '../database/connection.php';
require_once '../database/requete_sel.php';
require_once 'getVotesFunctions.php';
require_once '../user/userFunctions.php';

$currentUser=getIdUser();

if(getBioSourceRights($currentUser, $P_idBioSource, $link) == "denied"){
	echo '{"success":false}';
	return;
}


$result=mysqli_query ($link, $$sql);
$response= array();
if (! $result) {
	$response ["message"] = "Impossible to get the list of the genes!";
	$response["success"] = false;
}
else {
	
	require_once 'dataDatabaseRef.php';
	
	$data = array();
	 while ($row=mysqli_fetch_object($result))
	{
	   	$row->name= html_entity_decode($row->name);
	   	
	   	$P_idGene=$row->id;
	   	
	   	//Get votes if necessary:
	   	if ($P_getVotes) {
	   		$votes = getVotesForObject($P_idGene, "Gene", $link);
	   		$row->votes = $votes["votes"];
	   		$row->hasVote = $votes["hasVote"] ? "yes" : "no";
	   	}
	   	
	   	//Link to database:
   		if ($rowDB && ($rowDB->type=="biocyc" || $rowDB->type=="BioCyc" || $rowDB->type=="TrypanoCyc"))
   		{
   			if ($rowDB->url=="")
   			{
   				$row->linkToDB = "http://metacyc.org/META/NEW-IMAGE?type=GENE&object=" . $row->dbIdentifier;
   			}
   			else
   			{
   				$row->linkToDB = $rowDB->url . "/" . $rowDB->name . "/NEW-IMAGE?type=GENE&object=" . $row->dbIdentifier;
   			}
   		}
   		else {
   			$row->linkToDB = "NONE";
   		}
	   	
		$data [] = $row;
	}
	$response["success"] = true;
	$response["results"] = $data;
	
}
echo json_encode($response);
?>