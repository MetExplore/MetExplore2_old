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
$geneId=mysqli_real_escape_string ( $link , $geneId );
$GeneMySQLId=mysqli_real_escape_string ( $link , $GeneMySQLId );


// Check if the dbIdentifier already exists

$sqlCheck = "SELECT g.dbIdentifier ".
			"FROM Gene g INNER JOIN GeneInBioSource gib ON g.id=gib.idGene ".
			"WHERE g.dbIdentifier='$geneId' AND gib.idBioSource='$idBiosource'";

$res=mysqli_query($link, $sqlCheck) or die('{success: "false", message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

$num_result = $res->num_rows;

# If the gene id does not change, the number of genes with the 
# same id must equal to 1, otherwise to 0
$num_to_test = $geneId == $initialValues['geneId'] ? 1 : 0;

if($num_result > $num_to_test)
{
	die('{success: "false", message: "Gene can\'t be updated. Gene with same id already exists. Gene ids must be unique."}');
} 

$sqlGene="UPDATE Gene SET name='$name', dbIdentifier='$geneId' WHERE Gene.id='$GeneMySQLId' ;";

$num_result=mysqli_query($link, $sqlGene) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

$action = array(
		"action" => "update gene form",
		"idGene" => $GeneMySQLId,
		"dbIdentifier" => $initialValues['geneId'],
		"dataNew" => $functionParam,
		"dataOld" => $initialValues
);

AddSQLtoBioSourceLog($idBiosource,$sqlGene,$iduser, $action, $link);

/////
// Insert link between proteins and genes
$GeneMySQLIdinBioSource=mysqli_real_escape_string ( $link , $GeneMySQLIdinBioSource );

$sqlDelGenesCodeFor="DELETE FROM GeneCodesForProtein WHERE idGeneInBioSource='$GeneMySQLIdinBioSource';";
$num_result=mysqli_query($link, $sqlDelGenesCodeFor) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

AddSQLtoBioSourceLog($idBiosource,$sqlDelGenesCodeFor,$iduser);


$oldProteins = $initialValues['prots'];
if ($oldProteins == "") {
	$oldProteins = array();
}
if($prots != ""){
	
	$addedProteins = array();

	$SqlGenesCode="INSERT INTO GeneCodesForProtein (idGeneInBioSource, idProteinInBioSource) VALUES";
	
	foreach ($prots as $protId){
		$protIdc=mysqli_real_escape_string ( $link , $protId );

		$SqlGenesCode.=" ('$GeneMySQLIdinBioSource',  '$protIdc'),";
		if (!in_array($protId, $oldProteins) && !in_array($protId, $addedProteins)) {
			array_push($addedProteins, $protId);
		}
	}
	$SqlGenesCode=substr($SqlGenesCode,0, strlen($SqlGenesCode)-1 );
	$num_result=mysqli_query($link, $SqlGenesCode) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}'); 
	
	$action = null;
	
	if (count($addedProteins) > 0) {
		$action = array(
				"action" => "add gene to proteins",
				"dbIdentifier" => $geneId,
				"proteins" => $addedProteins,
				"idGene" => $GeneMySQLId
		);
	}
	
	AddSQLtoBioSourceLog($idBiosource,$SqlGenesCode,$iduser, $action, $link);
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
			"action" => "delete gene from proteins",
			"dbIdentifier" => $geneId,
			"proteins" => $removedProteins,
			"idEnzyme" => $GeneMySQLId
	);

	addHistoryItem($idBiosource, $iduser, $action, $link);
}

echo '{"success":"true"}';
	return;


?>
