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
$enzId=mysqli_real_escape_string ( $link , $enzId );
$idDB=mysqli_real_escape_string ( $link , $idDB );

// Check if the dbIdentifier already exists

$sqlCheck = "SELECT e.dbIdentifier ".
			"FROM Enzyme e INNER JOIN EnzymeInBioSource eib ON e.id=eib.idEnzyme ".
			"WHERE e.dbIdentifier='$enzId' AND eib.idBioSource='$idBiosource'";

$res=mysqli_query($link, $sqlCheck) or die('{success: "false", message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

$num_result = $res->num_rows;

if($num_result > 0)
{
	die('{success: "false", message: "Enzyme can\'t be added. Enzyme with same id already exists."}');
} 



$sqlEnzyme="INSERT INTO Enzyme (name, dbIdentifier, dbId) VALUES ('$name','$enzId','$idDB');";

$num_result=mysqli_query($link, $sqlEnzyme) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
$idEnzyme= mysqli_insert_id($link);

AddSQLtoBioSourceLog($idBiosource,$sqlEnzyme,$iduser);

$idEnzyme=mysqli_real_escape_string ( $link , $idEnzyme );
$idBiosource=mysqli_real_escape_string ( $link , $idBiosource );


$sqlEnzInBioSource="INSERT INTO EnzymeInBioSource (idEnzyme, idBioSource) VALUES ('$idEnzyme', '$idBiosource');";

$num_result=mysqli_query($link, $sqlEnzInBioSource) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
$idEnzymeInBioSource= mysqli_insert_id($link);


AddSQLtoBioSourceLog($idBiosource,$sqlEnzInBioSource,$iduser);

$idCmpInBS=mysqli_real_escape_string ( $link , $idCmpInBS );

$sqlEnzInCmpt="INSERT INTO EnzymeInCompartment (idEnzyme, idCompartmentInBioSource) VALUES ('$idEnzyme', '$idCmpInBS');";

$num_result=mysqli_query($link, $sqlEnzInCmpt) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

$action = array(
		"action" => "add enzyme form",
		"idEnzyme" => $idEnzyme,
		"dbIdentifier" => $enzId,
		"data" => $functionParam,
		"idCompartment" => $idCmpInBS
);

AddSQLtoBioSourceLog($idBiosource,$sqlEnzInCmpt,$iduser, $action, $link);

if($prots != ""){

	$idEnzymeInBioSource=mysqli_real_escape_string ( $link , $idEnzymeInBioSource );

	$SqlProtInEnz="INSERT INTO ProteinInEnzyme (idProteinInBioSource, idEnzymeInBioSource) VALUES";
	
	$proteinsList = array();
	
	foreach ($prots as $protId){
		
		$protIdc=mysqli_real_escape_string ( $link , $protId );

		$SqlProtInEnz.=" ('$protIdc',  '$idEnzymeInBioSource'),";
		array_push($proteinsList, $protIdc);
	}

	$SqlProtInEnz=substr($SqlProtInEnz,0, strlen($SqlProtInEnz)-1 );
	$num_result=mysqli_query($link, $SqlProtInEnz) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
	
	$action = null;
	
	$action = array(
		"action" => "add proteins to enzyme",
		"dbIdentifier" => $enzId,
		"proteins" => $proteinsList,
		"idEnzyme" => $idEnzyme
	);
	
	AddSQLtoBioSourceLog($idBiosource,$SqlProtInEnz,$iduser, $action, $link);
}

if($rxns != ""){
	
	$reactionsList = array();
	
	$sqlCatalyse="INSERT INTO Catalyses (idReactionInBioSource, idEnzymeInBioSource) VALUES";
	
	foreach ($rxns as $rxnId){

		$rxnIdc=mysqli_real_escape_string ( $link , $rxnId );

		$sqlCatalyse.=" ('$rxnIdc',  '$idEnzymeInBioSource'),";
		array_push($reactionsList, $rxnIdc);
	}
	$sqlCatalyse=substr($sqlCatalyse,0, strlen($sqlCatalyse)-1 );
	$num_result=mysqli_query($link, $sqlCatalyse) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
	
	$action = null;
	
	$action = array(
			"action" => "add enzyme to reactions",
			"dbIdentifier" => $enzId,
			"reactions" => $reactionsList,
			"idEnzyme" => $idEnzyme
	);
	
	AddSQLtoBioSourceLog($idBiosource,$sqlCatalyse,$iduser, $action, $link);
}

echo '{"success":"true"}';
	return;
?>
