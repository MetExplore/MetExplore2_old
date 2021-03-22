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

$name=mysqli_real_escape_string ( $link , $name );
$protId=mysqli_real_escape_string ( $link , $protId );
$ProteinMySQLId=mysqli_real_escape_string ( $link , $ProteinMySQLId );

// Check if the dbIdentifier already exists

$sqlCheck = "SELECT p.dbIdentifier ".
			"FROM Protein p INNER JOIN ProteinInBioSource pib ON p.id=pib.idProtein ".
			"WHERE p.dbIdentifier='$protId' AND pib.idBioSource='$idBiosource'";

$res=mysqli_query($link, $sqlCheck) or die('{success: "false", message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

$num_result = $res->num_rows;

# If the gene id does not change, the number of proteins with the 
# same id must equal to 1, otherwise to 0
$num_to_test = $protId == $initialValues['protId'] ? 1 : 0;


if($num_result > $num_to_test)
{
	die('{success: "false", message: "Protein can\'t be updated. Protein with same id already exists. Protein ids must be unique."}');
} 



$sqlProtein="UPDATE Protein SET name='$name', dbIdentifier='$protId' WHERE Protein.id='$ProteinMySQLId';";
$num_result=mysqli_query($link,$sqlProtein) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

AddSQLtoBioSourceLog($idBiosource,$sqlProtein,$iduser);

$idCmpInBS=mysqli_real_escape_string ( $link , $idCmpInBS );

$sqlProtInCmpt="UPDATE ProteinInCompartment SET idCompartmentInBioSource='$idCmpInBS' WHERE idProtein='$ProteinMySQLId';";
$num_result=mysqli_query($link, $sqlProtInCmpt) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

$action = array(
		"action" => "update protein form",
		"idProtein" => $ProteinMySQLId,
		"dbIdentifier" => $initialValues['protId'],
		"dataNew" => $functionParam,
		"dataOld" => $initialValues,
		"idCompartment" => $idCmpInBS
);

AddSQLtoBioSourceLog($idBiosource,$sqlProtInCmpt,$iduser,$action,$link);


/////
// Del old Ref to insert the new one
$ProteinMySQLIdinBioSource=mysqli_real_escape_string ( $link , $ProteinMySQLIdinBioSource );

$sqlDelEnzyme="DELETE FROM ProteinInEnzyme WHERE idProteinInBioSource='$ProteinMySQLIdinBioSource';";
$num_result=mysqli_query($link,$sqlDelEnzyme) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

AddSQLtoBioSourceLog($idBiosource,$sqlDelEnzyme,$iduser);

$oldEnzymes = $initialValues['enzymes'];
if ($oldEnzymes == "") {
	$oldEnzymes = array();
}
if($enzymes != ""){

	$addedEnzymes = array();
	
	$SqlProtInEnz="INSERT INTO ProteinInEnzyme (idProteinInBioSource, idEnzymeInBioSource) VALUES";
	
	foreach ($enzymes as $enzId){
		$enzIdc=mysqli_real_escape_string ( $link , $enzId );

		$SqlProtInEnz.=" ('$ProteinMySQLIdinBioSource',  '$enzIdc'),";
		if (!in_array($enzId, $oldEnzymes) && !in_array($enzId, $addedEnzymes)) {
			array_push($addedEnzymes, $enzId);
		}
	}
	$SqlProtInEnz=substr($SqlProtInEnz,0, strlen($SqlProtInEnz)-1 );
	$num_result=mysqli_query($link, $SqlProtInEnz) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
	
	$action = null;
	
	if (count($addedEnzymes) > 0) {
		$action = array(
				"action" => "add protein to enzymes",
				"dbIdentifier" => $protId,
				"enzymes" => $addedEnzymes,
				"idProtein" => $ProteinMySQLId
		);
	}
	
	AddSQLtoBioSourceLog($idBiosource,$SqlProtInEnz,$iduser, $action, $link);
}
else {
	$enzymes = array(); //Must be an array for next foreach
}

//Log deleted proteins:
$removedEnzymes = array();

foreach ($oldEnzymes as $enzId) {
	if (!in_array($enzId, $enzymes) && !in_array($enzId, $removedEnzymes)) {
		array_push($removedEnzymes, $enzId);
	}
}

if (count($removedEnzymes) > 0) {
	$action = array(
			"action" => "delete enzymes for protein",
			"dbIdentifier" => $protId,
			"enzymes" => $removedEnzymes,
			"idProtein" => $ProteinMySQLId
	);

	addHistoryItem($idBiosource, $iduser, $action, $link);
}


/////
// IDel old Ref to insert the new one
$sqlDelGenes="DELETE FROM GeneCodesForProtein WHERE idProteinInBioSource='$ProteinMySQLIdinBioSource';";
$num_result=mysqli_query($link, $sqlDelGenes) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

AddSQLtoBioSourceLog($idBiosource,$sqlDelGenes,$iduser);

$oldGenes = $initialValues['genes'];
if ($oldGenes == "") {
	$oldGenes = array();
}
if($genes != ""){

	$addedGenes = array();
	
	$SqlGenesCode="INSERT INTO GeneCodesForProtein (idGeneInBioSource, idProteinInBioSource) VALUES";
	
	foreach ($genes as $geneId){
		$geneIdc=mysqli_real_escape_string ( $link , $geneId );

		$SqlGenesCode.=" ('$geneIdc',  '$ProteinMySQLIdinBioSource'),";
		if (!in_array($geneId, $oldGenes) && !in_array($geneId, $addedGenes)) {
			array_push($addedGenes, $geneId);
		}
	}
	$SqlGenesCode=substr($SqlGenesCode,0, strlen($SqlGenesCode)-1 );
	$num_result=mysqli_query($link,$SqlGenesCode) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
	
	$action = null;
	
	if (count($addedGenes) > 0) {
		$action = array(
				"action" => "add genes to protein",
				"dbIdentifier" => $protId,
				"genes" => $addedGenes,
				"idProtein" => $ProteinMySQLId
		);
	}
	
	AddSQLtoBioSourceLog($idBiosource,$SqlGenesCode,$iduser, $action, $link); 
}
else {
	$genes = array(); //Must be an array for next foreach
}

//Log deleted proteins:
$removedGenes = array();

foreach ($oldGenes as $geneId) {
	if (!in_array($geneId, $enzymes) && !in_array($geneId, $removedGenes)) {
		array_push($removedGenes, $geneId);
	}
}

if (count($removedGenes) > 0) {
	$action = array(
			"action" => "delete genes from protein",
			"dbIdentifier" => $protId,
			"genes" => $removedGenes,
			"idProtein" => $ProteinMySQLId
	);

	addHistoryItem($idBiosource, $iduser, $action, $link);
}

echo '{"success":"true"}';
	return;


?>
