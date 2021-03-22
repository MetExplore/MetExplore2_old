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

$name=mysqli_real_escape_string ( $link , $name );
$geneId=mysqli_real_escape_string ( $link , $geneId );
$idDB=mysqli_real_escape_string ( $link , $idDB );
$idBiosource=mysqli_real_escape_string ( $link , $idBiosource );


// Check if the dbIdentifier already exists

$sqlCheck = "SELECT g.dbIdentifier ".
			"FROM Gene g INNER JOIN GeneInBioSource gib ON g.id=gib.idGene ".
			"WHERE g.dbIdentifier='$geneId' AND gib.idBioSource='$idBiosource'";

$res=mysqli_query($link, $sqlCheck) or die('{success: "false", message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

$num_result = $res->num_rows;

if($num_result > 0)
{
	die('{success: "false", message: "Gene can\'t be added. Gene with same id already exists."}');
} 


$sqlGene="INSERT INTO Gene (name, dbIdentifier, dbId) VALUES ('$name','$geneId','$idDB');";




$num_result=mysqli_query($link, $sqlGene) or die('{success: "false", message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
$idGene= mysqli_insert_id($link);


AddSQLtoBioSourceLog($idBiosource,$sqlGene,$iduser);

$idGene=mysqli_real_escape_string ( $link , $idGene );


$sqlGeneInBioSource="INSERT INTO GeneInBioSource (idGene, idBioSource) VALUES ('$idGene', '$idBiosource')";

$num_result=mysqli_query($link, $sqlGeneInBioSource) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
$idGeneInBioSource= mysqli_insert_id($link);

$action = array(
		"action" => "add gene form",
		"idGene" => $idGene,
		"dbIdentifier" => $geneId,
		"data" => $functionParam
);

AddSQLtoBioSourceLog($idBiosource,$sqlGeneInBioSource,$iduser, $action, $link);


/////
// Insert link between proteins and genes
if($prots != ""){
	
	$protsList = array();
	$idGeneInBioSource=mysqli_real_escape_string ( $link , $idGeneInBioSource );


	$SqlGenesCode="INSERT INTO GeneCodesForProtein (idGeneInBioSource, idProteinInBioSource) VALUES";
	
	foreach ($prots as $protId){
		$protIdc=mysqli_real_escape_string ( $link , $protId );

		$SqlGenesCode.=" ('$idGeneInBioSource',  '$protIdc'),";
		array_push($protsList, $protIdc);
	}
	$SqlGenesCode=substr($SqlGenesCode,0, strlen($SqlGenesCode)-1 );

	$num_result=mysqli_query($link, $SqlGenesCode) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
	
	$action = null;
	
	$action = array(
			"action" => "add gene to proteins",
			"dbIdentifier" => $geneId,
			"proteins" => $protsList,
			"idGene" => $idGene
	);
	
	AddSQLtoBioSourceLog($idBiosource,$SqlGenesCode,$iduser, $action, $link);
}

echo '{"success":"true"}';
	return;
?>