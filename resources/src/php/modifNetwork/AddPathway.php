<?php
require_once("../database/connection.php");
require_once("../LogBioSourceUpdate.php");

$functionParam= json_decode($_POST['functionParam'], $assoc=true);

extract ( $functionParam, EXTR_OVERWRITE );

require_once '../user/userFunctions.php';

$currentUser=getIdUser();

if(getBioSourceRights($currentUser, $idBiosource, $link) == "denied"){
	echo '{"success":false}';
	return;
}

$pthwname=mysqli_real_escape_string ( $link , $pthwname );
$pthwId=mysqli_real_escape_string ( $link , $pthwId );
$idDB=mysqli_real_escape_string ( $link , $idDB );

// Check if the dbIdentifier already exists

$sqlCheck = "SELECT p.dbIdentifier ".
"FROM Pathway p ".
"WHERE p.dbIdentifier='$pthwId' AND p.idDB='$idDB'";

$res=mysqli_query($link, $sqlCheck) or die('{success: "false", message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

$num_result = $res->num_rows;

if($num_result > 0)
{
	die('{success: "false", message: "Pathway can\'t be added. Pathway with same id already exists."}');
} 


$sqlPathway="INSERT INTO Pathway (name, dbIdentifier, idDB) VALUES ('$pthwname','$pthwId','$idDB');";

$num_result=mysqli_query($link, $sqlPathway) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
$idPathway= mysqli_insert_id($link);



$action = array(
	"action" => "add pathway",
	"dbIdentifier" => $pthwId,
	"data" => $functionParam,
	"idPathway" => $idPathway
);

AddSQLtoBioSourceLog($idBiosource,$sqlPathway,$iduser,$action,$link);

$idPathway=mysqli_real_escape_string ( $link , $idPathway );
$idBiosource=mysqli_real_escape_string ( $link , $idBiosource );

$sqlPathInBioSource="INSERT INTO PathwayInBioSource (idPathway, idBioSource) VALUES ('$idPathway', '$idBiosource')";
$num_result=mysqli_query($link, $sqlPathInBioSource) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

AddSQLtoBioSourceLog($idBiosource,$sqlPathInBioSource,$iduser);

if($rxnInpthw != ""){

	$SqlRxnInPath="INSERT INTO ReactionInPathway (idPathway, idReactionBioSource) VALUES";
	
	$nbReactions = 0;
	
	$reactionInBs = array();
	
	foreach ($rxnInpthw as $rxnInBs){
		
		$rxnInBsc=mysqli_real_escape_string ( $link , $rxnInBs );

		$SqlRxnInPath.=" ('$idPathway',  '$rxnInBsc'),";
		$nbReactions++;
		array_push($reactionInBs, $rxnInBsc);
	}
	$SqlRxnInPath=substr($SqlRxnInPath,0, strlen($SqlRxnInPath)-1 );
	
	$num_result=mysqli_query($link, $SqlRxnInPath) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}'); 
	
	$action = array(
		"action" => "add reactions to pathway",
		"dbIdentifier" => $pthwId,
		"reactionsInBs" => $reactionInBs,
		"idPathway" => $idPathway
	);
	
	AddSQLtoBioSourceLog($idBiosource,$SqlRxnInPath,$iduser, $action, $link);
}

if($superpthw != ""){
	$SqlPathInPath="INSERT INTO SuperPathway (idSup, idSub) VALUES";
	
	$superpthw_list = array();
	
	foreach ($superpthw as $idSup){
		$idSupc=mysqli_real_escape_string ( $link , $idSup );

		$SqlPathInPath.=" ('$idSupc',  '$idPathway'),";
		array_push($superpthw_list, $idSupc);
	}
	$SqlPathInPath=substr($SqlPathInPath,0, strlen($SqlPathInPath)-1 );

	$num_result=mysqli_query($link, $SqlPathInPath) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}'); 
	
	$action = array(
		"action" => "add pathway to superPathways",
		"dbIdentifier" => $pthwId,
		"superPathways" => $superpthw_list,
		"idPathway" => $idPathway
	);
	
	AddSQLtoBioSourceLog($idBiosource,$SqlPathInPath,$iduser, $action, $link);
}

echo '{"success":"true"}';
return;

?>
