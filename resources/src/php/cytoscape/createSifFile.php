<?php
// Creates a sif file from a list of reactionBioSource ids

require_once("../utils/file_functions.php");
require_once("../config/server_variables.php");
require_once("../database/connection.php");


extract($_POST,  EXTR_OVERWRITE);

$response["success"] = false;

if(! isset($ids) || $ids === "") {
	$response["message"] = "Cart empty";
	die(json_encode($response));
}

$sif_path = createRandomFileName(TMP_DIR, "network", "sif");

$fw = fopen($sif_path, 'w') or die(json_encode($response));


$req = "SELECT r.id as id, rbs.idBioSource as idBioSource FROM Reaction as r, ReactionInBioSource as rbs ".
			"WHERE rbs.idReaction=r.id AND rbs.id IN($ids)";
$res = mysqli_query($link, $req);

if(! $res) {
	$response["message"] = "Problem in query ".$req;
	die(json_encode($response));
}

$idBioSource = -1;

while ($tab=mysqli_fetch_assoc($res))
{
   	$id_reaction = $tab["id"];
   	
   	$idBioSource = $tab["idBioSource"];
   	
   	$req_left = "SELECT m.id as id, mbs.sideCompound as sideCompound ".
   	"FROM Metabolite as m, MetaboliteInBioSource as mbs, LeftParticipant as l ".
   	"WHERE l.idReaction='".$id_reaction."' AND m.id=l.idMetabolite AND mbs.idBioSource='$idBioSource' AND mbs.idMetabolite=m.id";
   	
   	$res_left = mysqli_query($link, $req_left);
   	
   	if(! $res_left) {
   		$response["message"] = "Problem in query ".$req_left;
   		die(json_encode($response));
   	}
   	
   	while ($tab_left=mysqli_fetch_assoc($res_left))
   	{
   		$id_metabolite = $tab_left["id"];
   		
   		fwrite($fw, "M_".$id_metabolite."\treaction-reactant\tR_".$id_reaction."\n");
   		
   	}
   	
   	$req_right = "SELECT m.id as id, mbs.sideCompound as sideCompound ".
   			"FROM Metabolite as m, MetaboliteInBioSource as mbs, RightParticipant as r ".
   			"WHERE r.idReaction='".$id_reaction."' AND m.id=r.idMetabolite  AND mbs.idBioSource='$idBioSource' AND mbs.idMetabolite=m.id";
   	
   	$res_right = mysqli_query($link, $req_right);
   	
   	if(! $res_right) {
   		$response["message"] = "Problem in query ".$req_right;
   		die(json_encode($response));
   	}
   	
   	while ($tab_right=mysqli_fetch_assoc($res_right))
   	{
   		$id_metabolite = $tab_right["id"];
   		 
   		fwrite($fw, "R_".$id_reaction."\treaction-product\t"."M_".$id_metabolite."\n");
   		 
   	}
}

fclose($fw);

$response["success"]=true;
$response["path"]=$sif_path;

print(json_encode($response));


?>
