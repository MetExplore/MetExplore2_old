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
$protId=mysqli_real_escape_string ( $link , $protId );
$idDB=mysqli_real_escape_string ( $link , $idDB );
$idBiosource=mysqli_real_escape_string ( $link , $idBiosource );

// Check if the dbIdentifier already exists

$sqlCheck = "SELECT p.dbIdentifier ".
			"FROM Protein p INNER JOIN ProteinInBioSource pib ON p.id=pib.idProtein ".
			"WHERE p.dbIdentifier='$protId' AND pib.idBioSource='$idBiosource'";

$res=mysqli_query($link, $sqlCheck) or die('{success: "false", message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

$num_result = $res->num_rows;

if($num_result > 0)
{
	die('{success: "false", message: "Protein can\'t be added. Protein with same id already exists."}');
} 

$sqlProtein="INSERT INTO Protein (name, dbIdentifier, dbId) VALUES ('$name','$protId','$idDB');";

$num_result=mysqli_query($link, $sqlProtein) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
$idProtein= mysqli_insert_id($link);

AddSQLtoBioSourceLog($idBiosource,$sqlProtein,$iduser);

		$idProtein=mysqli_real_escape_string ( $link , $idProtein );
		$idBiosource=mysqli_real_escape_string ( $link , $idBiosource );

$sqlProtInBioSource="INSERT INTO ProteinInBioSource (idProtein, idBioSource) VALUES ('$idProtein', '$idBiosource');";

$num_result=mysqli_query($link, $sqlProtInBioSource) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
$idProteinInBioSource= mysqli_insert_id($link);

AddSQLtoBioSourceLog($idBiosource,$sqlProtInBioSource,$iduser);

		$idCmpInBS=mysqli_real_escape_string ( $link , $idCmpInBS );

$sqlProtInCmpt="INSERT INTO ProteinInCompartment (idProtein, idCompartmentInBioSource) VALUES ('$idProtein', '$idCmpInBS');";

$num_result=mysqli_query($link, $sqlProtInCmpt) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

$action = array(
		"action" => "add protein form",
		"idProtein" => $idProtein,
		"dbIdentifier" => $protId,
		"data" => $functionParam,
		"idCompartment" => $idCmpInBS
);

AddSQLtoBioSourceLog($idBiosource,$sqlProtInCmpt,$iduser, $action, $link);

		$idProteinInBioSource=mysqli_real_escape_string ( $link , $idProteinInBioSource );

/////
// Insert link between proteins and enzymes
if($enzymes != ""){

	$enzymesList = array();
	
	$SqlProtInEnz="INSERT INTO ProteinInEnzyme (idProteinInBioSource, idEnzymeInBioSource) VALUES";
	
	foreach ($enzymes as $enzId){
		$enzIdc=mysqli_real_escape_string ( $link , $enzId );

		$SqlProtInEnz.=" ('$idProteinInBioSource',  '$enzIdc'),";
		array_push($enzymesList, $enzIdc);
	}
	$SqlProtInEnz=substr($SqlProtInEnz,0, strlen($SqlProtInEnz)-1 );
	$num_result=mysqli_query($link, $SqlProtInEnz) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
	
	$action = array(
			"action" => "add protein to enzymes",
			"dbIdentifier" => $protId,
			"enzymes" => $enzymesList,
			"idProtein" => $idProtein
	);
	
		AddSQLtoBioSourceLog($idBiosource,$SqlProtInEnz,$iduser, $action, $link);
}


/////
// Insert link between proteins and genes
if($genes != ""){
	
	$genesList = array();

	$SqlGenesCode="INSERT INTO GeneCodesForProtein (idGeneInBioSource, idProteinInBioSource) VALUES";
	
	foreach ($genes as $geneId){
		$geneIdc=mysqli_real_escape_string ( $link , $geneId );

		$SqlGenesCode.=" ('$geneIdc',  '$idProteinInBioSource'),";
		array_push($genesList, $geneIdc);
	}
	$SqlGenesCode=substr($SqlGenesCode,0, strlen($SqlGenesCode)-1 );

	$num_result=mysqli_query($link, $SqlGenesCode) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}'); 
	
	$action = array(
			"action" => "add genes to protein",
			"dbIdentifier" => $protId,
			"genes" => $genesList,
			"idProtein" => $idProtein
	);
	
		AddSQLtoBioSourceLog($idBiosource,$SqlGenesCode,$iduser, $action, $link);
}

echo '{"success":"true"}';
	return;
?>
