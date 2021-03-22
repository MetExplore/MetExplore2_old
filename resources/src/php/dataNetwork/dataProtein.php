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

//error_log($$sql);
//$sql= $$sql." ORDER BY name";		//.$order." ".$direction." LIMIT ".$start.",".$limit;
$result=mysqli_query ($link, $$sql);
$response= array();
if (! $result) {
	$response ["message"] = "Impossible to get the list of the proteins!";
	$response["success"] = false;
}
else {

	$data = array();
	while ($row=mysqli_fetch_object($result))
	{
	   	$row->name= html_entity_decode($row->name);
	   	
	   	//Get votes if necessary:
	   	if ($P_getVotes) {
	   		$votes = getVotesForObject($row->id, "Protein", $link);
	   		$row->votes = $votes["votes"];
	   		$row->hasVote = $votes["hasVote"] ? "yes" : "no";
	   	}
	   	
		$data [] = $row;
	}
	$response["success"] = true;
	$response["results"] = $data;
	
}
echo json_encode($response);
?>