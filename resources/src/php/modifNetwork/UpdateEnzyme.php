<?php
require_once("../database/connection.php");
require_once("../LogBioSourceUpdate.php");

$functionParam= json_decode($_POST['functionParam'], $assoc=true);
$initialValues = json_decode($_POST['initialValues'], $assoc=true);

extract ( $functionParam, EXTR_OVERWRITE );

require_once '../user/userFunctions.php';

$currentUser=getIdUser();

if(getBioSourceRights($currentUser, $idBiosource, $link) == "denied"){
	echo '{"success":false}';
	return;
}

$EnzymeMySQLId=mysqli_real_escape_string ( $link , $EnzymeMySQLId );

// Check if the dbIdentifier already exists

$sqlCheck = "SELECT e.dbIdentifier ".
			"FROM Enzyme e INNER JOIN EnzymeInBioSource eib ON e.id=eib.idEnzyme ".
			"WHERE e.dbIdentifier='$enzId' AND eib.idBioSource='$idBiosource'";

$res=mysqli_query($link, $sqlCheck) or die('{success: "false", message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

$num_result = $res->num_rows;

# If the gene id does not change, the number of enzymes with the 
# same id must equal to 1, otherwise to 0
$num_to_test = $enzId == $initialValues['enzId'] ? 1 : 0;


if($num_result > $num_to_test)
{
	die('{success: "false", message: "Enzyme can\'t be updated. Enzyme with same id already exists. Enzyme ids must be unique."}');
} 




$sqlUpEnzyme="UPDATE Enzyme SET name='$name', dbIdentifier='$enzId' WHERE Enzyme.id='$EnzymeMySQLId' ;";

$num_result=mysqli_query($link, $sqlUpEnzyme) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

AddSQLtoBioSourceLog($idBiosource,$sqlUpEnzyme,$iduser);

$idCmpInBS=mysqli_real_escape_string ( $link , $idCmpInBS );

$sqlUpEnzInCmpt="UPDATE EnzymeInCompartment SET idCompartmentInBioSource='$idCmpInBS' WHERE idEnzyme='$EnzymeMySQLId';";
$num_result=mysqli_query($link, $sqlUpEnzInCmpt) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

$action = array(
		"action" => "update enzyme form",
		"idEnzyme" => $idEnzyme,
		"dbIdentifier" => $initialValues['enzId'],
		"dataNew" => $functionParam,
		"dataOld" => $initialValues,
		"idCompartment" => $idCmpInBS
);

AddSQLtoBioSourceLog($idBiosource,$sqlUpEnzInCmpt,$iduser, $action, $link);

//////////
// Delete old links then create the new ones
$EnzymeMySQLIdinBioSource=mysqli_real_escape_string ( $link , $EnzymeMySQLIdinBioSource );

$sqlDelProtsInEnz="DELETE FROM ProteinInEnzyme WHERE idEnzymeInBioSource='$EnzymeMySQLIdinBioSource';";
$num_result=mysqli_query($link, $sqlDelProtsInEnz) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

AddSQLtoBioSourceLog($idBiosource,$sqlDelProtsInEnz,$iduser);

$oldProteins = $initialValues['prots'];
if ($oldProteins == "") {
	$oldProteins = array();
}
if($prots != ""){
	
	$addedProteins = array();

	$SqlProtInEnz="INSERT INTO ProteinInEnzyme (idProteinInBioSource, idEnzymeInBioSource) VALUES";
	
	foreach ($prots as $protId){
		$protIdc=mysqli_real_escape_string ( $link , $protId );

		$SqlProtInEnz.=" ('$protIdc',  '$EnzymeMySQLIdinBioSource'),";
		if (!in_array($protId, $oldProteins) && !in_array($protId, $addedProteins)) {
			array_push($addedProteins, $protId);
		}
	}
	$SqlProtInEnz=substr($SqlProtInEnz,0, strlen($SqlProtInEnz)-1 );
	$num_result=mysqli_query($link, $SqlProtInEnz) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}'); 
	
	$action = null;
	
	if (count($addedProteins) > 0) {
		$action = array(
				"action" => "add proteins to enzyme",
				"dbIdentifier" => $enzId,
				"proteins" => $addedProteins,
				"idEnzyme" => $EnzymeMySQLId
		);
	}
	
	AddSQLtoBioSourceLog($idBiosource,$SqlProtInEnz,$iduser, $action, $link);
}
else {
	$prots = array(); //Must be an array for next foreach
}

//Log deleted proteins:
$removedProteins = array();

foreach ($oldProteins as $protId) {
	if (!in_array($protId, $prots) && !in_array($protId, $removedProteins)) {
		array_push($removedProteins, $protId);
	}
}

if (count($removedProteins) > 0) {
	$action = array(
			"action" => "delete proteins from enzyme",
			"dbIdentifier" => $enzId,
			"proteins" => $removedProteins,
			"idEnzyme" => $EnzymeMySQLId
	);

	addHistoryItem($idBiosource, $iduser, $action, $link);
}

//////////
// Delete old links then create the new ones

$sqlDelCatalyse="DELETE FROM Catalyses WHERE idEnzymeInBioSource='$EnzymeMySQLIdinBioSource';";
$num_result=mysqli_query($link, $sqlDelCatalyse) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

AddSQLtoBioSourceLog($idBiosource,$sqlDelCatalyse,$iduser);

$oldReactions = $initialValues['rxns'];
if ($oldReactions == "") {
	$oldReactions = array();
}
if($rxns != ""){
	
	$addedReactions = array();
	
	$sqlCatalyse="INSERT INTO Catalyses (idReactionInBioSource, idEnzymeInBioSource) VALUES";
	
	foreach ($rxns as $rxnId){
		$rxnIdc=mysqli_real_escape_string ( $link , $rxnId );

		$sqlCatalyse.=" ('$rxnIdc',  '$EnzymeMySQLIdinBioSource'),";
		if (!in_array($rxnId, $oldReactions) && !in_array($rxnId, $addedReactions)) {
			array_push($addedReactions, $rxnId);
		}
	}
	$sqlCatalyse=substr($sqlCatalyse,0, strlen($sqlCatalyse)-1 );
	$num_result=mysqli_query($link, $sqlCatalyse) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
	
	$action = null;
	
	if (count($addedReactions) > 0) {
		$action = array(
				"action" => "add enzyme to reactions",
				"dbIdentifier" => $enzId,
				"reactions" => $addedReactions,
				"idEnzyme" => $EnzymeMySQLId
		);
	}
	
	AddSQLtoBioSourceLog($idBiosource,$sqlCatalyse,$iduser, $action, $link);
}
else {
	$rxns = array(); //Must be an array for next foreach
}

//Log deleted proteins:
$removedReactions = array();

foreach ($oldReactions as $rxnId) {
	if (!in_array($rxnId, $rxns) && !in_array($rxnId, $removedReactions)) {
		array_push($removedReactions, $rxnId);
	}
}

if (count($removedReactions) > 0) {
	$action = array(
			"action" => "delete enzyme from reactions",
			"dbIdentifier" => $enzId,
			"reactions" => $removedReactions,
			"idEnzyme" => $EnzymeMySQLId
	);

	addHistoryItem($idBiosource, $iduser, $action, $link);
}

echo '{"success":"true"}';
	return;

?>
