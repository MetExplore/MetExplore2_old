<?php
require_once("../database/connection.php");
require_once("../LogBioSourceUpdate.php");
require_once ("../userAndProject/addHistoryItem.php");

$functionParam= json_decode($_POST['functionParam'], $assoc=true);
$initialValues= json_decode($_POST['initialValues'], $assoc=true);

extract ( $functionParam, EXTR_OVERWRITE );

require_once '../user/userFunctions.php';

$currentUser=getIdUser();

if(getBioSourceRights($currentUser, $idBiosource, $link) == "denied"){
	echo '{"success":false}';
	return;
}

$pthwname=mysqli_real_escape_string ( $link , $pthwname );
$pthwId=mysqli_real_escape_string ( $link , $pthwId );
$idPathway=mysqli_real_escape_string ( $link , $idPathway );

// Check if the dbIdentifier already exists

$sqlCheck = "SELECT p.dbIdentifier ".
"FROM Pathway p ".
"WHERE p.dbIdentifier='$pthwId' AND p.idDB='$idDB'";

$res=mysqli_query($link, $sqlCheck) or die('{success: "false", message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

$num_result = $res->num_rows;

# If the pathway id does not change, the number of pathways with the 
# same id must equal to 1, otherwise to 0
$num_to_test = $pthwId == $initialValues['pthwId'] ? 1 : 0;

if($num_result > $num_to_test)
{
	die('{success: "false", message: "Pathway can\'t be updated. Pathway with same id already exists. Pathway ids must be unique"}');
} 



$sqlPathway="UPDATE Pathway SET name='$pthwname', dbIdentifier='$pthwId' WHERE Pathway.id='$idPathway';";

$num_result=mysqli_query($link,$sqlPathway) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

$action = array(
		"action" => "update pathway form",
		"dbIdentifier" => $initialValues['pthwId'],
		"dataOld" => $initialValues,
		"dataNew" => $functionParam,
		"idPathway" => $idPathway
);

AddSQLtoBioSourceLog($idBiosource,$sqlPathway,$iduser, $action, $link);

//////////////////////////////////////
// We delete all the old reaction, and add the new ones

$sqlDelReaction="DELETE FROM ReactionInPathway WHERE idPathway='$idPathway';";

$num_result=mysqli_query($link, $sqlDelReaction) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

AddSQLtoBioSourceLog($idBiosource,$sqlDelReaction,$iduser);

$oldRxn = $initialValues['rxnInpthw'];
if ($oldRxn == "") {
	$oldRxn = array();
}

if($rxnInpthw != ""){

	$SqlRxnInPath="INSERT INTO ReactionInPathway (idPathway, idReactionBioSource) VALUES";
	
	$addedReactions = array();
	
	foreach ($rxnInpthw as $rxnInBs){
$rxnInBsc=mysqli_real_escape_string ( $link , $rxnInBs );

		$SqlRxnInPath.=" ('$idPathway',  '$rxnInBsc'),";
		if (!in_array($rxnInBs, $oldRxn) && !in_array($rxnInBs, $addedReactions)) {
			array_push($addedReactions, $rxnInBs);
		}
	}
	$SqlRxnInPath=substr($SqlRxnInPath,0, strlen($SqlRxnInPath)-1 );
	
	$num_result=mysqli_query($link, $SqlRxnInPath) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
	
	//Get added pathways for history:
	
	$action = null;
	
	if (count($addedReactions) > 0) {
		$action = array(
			"action" => "add reactions to pathway",
			"dbIdentifier" => $pthwId,
			"reactionsInBs" => $addedReactions,
			"idPathway" => $idPathway
		);
	}
	
	//log:
	AddSQLtoBioSourceLog($idBiosource,$SqlRxnInPath,$iduser, $action, $link); 
	
}
else {
	$rxnInpthw = array(); //Must be an array for next foreach
}

//Log deleted reactions:
$removedReactions = array();

foreach ($oldRxn as $rxnInBs) {
	if (!in_array($rxnInBs, $rxnInpthw) && !in_array($rxnInBs, $removedReactions)) {
		array_push($removedReactions, $rxnInBs);
	}
}

if (count($removedReactions) > 0) {
	$action = array(
			"action" => "delete reactions from pathway",
			"dbIdentifier" => $pthwId,
			"reactionsInBs" => $removedReactions,
			"idPathway" => $idPathway
	);

	addHistoryItem($idBiosource, $iduser, $action, $link);
}

//////////////////////////////////////
//We delete all the old super Pathways, and add the new ones

$sqlDelSupPath="DELETE FROM SuperPathway WHERE idSub='$idPathway';";
$num_result=mysqli_query($link, $sqlDelSupPath) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

AddSQLtoBioSourceLog($idBiosource,$sqlDelSupPath,$iduser);

$oldSuperpthw = $initialValues['superpthw'];
if ($oldSuperpthw == "") {
	$oldSuperpthw = array();
}

if($superpthw != ""){
	$SqlPathInPath="INSERT INTO SuperPathway (idSup, idSub) VALUES";
	
	$addedSuperPathways = array();
		
	foreach ($superpthw as $idSup){
$idSupc=mysqli_real_escape_string ( $link , $idSup );

		$SqlPathInPath.=" ('$idSupc',  '$idPathway'),";
		if (!in_array($idSup, $oldSuperpthw) && !in_array($idSup, $addedSuperPathways)) {
			array_push($addedSuperPathways, $idSup);
		}
	}
	$SqlPathInPath=substr($SqlPathInPath,0, strlen($SqlPathInPath)-1 );
	
	$num_result=mysqli_query($link, $SqlPathInPath) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
	
	$action = null;
	
	//Get added superPathways:
	
	if (count($addedSuperPathways) > 0) {
		$action = array(
			"action" => "add pathway to superPathways",
			"dbIdentifier" => $pthwId,
			"superPathways" => $addedSuperPathways,
			"idPathway" => $idPathway
		);
	}
	
	AddSQLtoBioSourceLog($idBiosource,$SqlPathInPath,$iduser, $action, $link);
	
}
else {
	$superpthw = array(); //Must be an array for next foreach
}

//Log deleted superPathways:
$removedSuperPathways = array();

foreach ($oldSuperpthw as $idSup) {
	if (!in_array($idSup, $superpthw) && !in_array($idSup, $removedSuperPathways)) {
		array_push($removedSuperPathways, $idSup);
	}
}

if (count($removedSuperPathways) > 0) {
	$action = array(
			"action" => "delete pathway from superPathways",
			"dbIdentifier" => $pthwId,
			"superPathways" => $removedSuperPathways,
			"idPathway" => $idPathway
	);

	addHistoryItem($idBiosource, $iduser, $action, $link);
}

echo '{"success":"true"}';
	return;

?>
