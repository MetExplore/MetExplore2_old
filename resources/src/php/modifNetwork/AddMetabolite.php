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

$mtbname=mysqli_real_escape_string ( $link , $mtbname );
$formula=mysqli_real_escape_string ( $link , $formula );
$weight=mysqli_real_escape_string ( $link , $weight );
$generic=mysqli_real_escape_string ( $link , $generic );
$idDB=mysqli_real_escape_string ( $link , $idDB );
$mtbId=mysqli_real_escape_string ( $link , $mtbId );
$charge=mysqli_real_escape_string ( $link , $charge );

if($charge == "")
{
	$charge = "0";
}

// Check if the dbIdentifier already exists

$sqlCheck = "SELECT m.dbIdentifier ".
"FROM Metabolite m INNER JOIN MetaboliteInBioSource mib ON m.id=mib.idMetabolite ".
"WHERE m.dbIdentifier='$mtbId' AND mib.idBioSource='$idBiosource'";

$res=mysqli_query($link, $sqlCheck) or die('{success: "false", message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

$num_result = $res->num_rows;

if($num_result > 0)
{
	die('{success: "false", message: "Metabolite can\'t be added. Metabolite with same id already exists."}');
} 


$sqlMetab="INSERT INTO Metabolite (name, chemicalFormula, weight, generic, idDB, dbIdentifier, charge) VALUES ('$mtbname','$formula','$weight','$generic','$idDB','$mtbId','$charge');";

$num_result=mysqli_query($link, $sqlMetab) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
$idMetabolite= mysqli_insert_id($link);

AddSQLtoBioSourceLog($idBiosource,$sqlMetab,$iduser);

$idMetabolite=mysqli_real_escape_string ( $link , $idMetabolite );
$idCmpInBS=mysqli_real_escape_string ( $link , $idCmpInBS );

$sqlMetabInCompart="INSERT INTO MetaboliteInCompartment (idMetabolite, idCompartmentInBioSource) VALUES ('$idMetabolite', '$idCmpInBS');";

$num_result=mysqli_query($link, $sqlMetabInCompart) or die('{success: false, message: "Error in Mysql Query when adding metabolite in compartment: '.mysqli_error ($link).'"}');

$action = array(
	"action" => "add metabolite",
	"dbIdentifier" => $mtbId,
	"idCompartment" => $idCmpInBS,
	"data" => $functionParam,
	"idMetabolite" => $idMetabolite
);

AddSQLtoBioSourceLog($idBiosource,$sqlMetabInCompart,$iduser, $action, $link);

$initialQuantity=null;

if($qty != null){
	$initialQuantity=$ivalue+'-'+$qty;
}

$idBiosource=mysqli_real_escape_string ( $link , $idBiosource );
$boundaryCondition=mysqli_real_escape_string ( $link , $boundaryCondition );
$sideCoumpound=mysqli_real_escape_string ( $link , $sideCoumpound );
$constant=mysqli_real_escape_string ( $link , $constant );
$hasOnlySubstanceUnit=mysqli_real_escape_string ( $link , $hasOnlySubstanceUnit );
$substanceUnit=mysqli_real_escape_string ( $link , $substanceUnit );
$initialQuantity=mysqli_real_escape_string ( $link , $initialQuantity );

$sqlMetabInBioSource="INSERT INTO MetaboliteInBioSource (idBioSource, idMetabolite, boundaryCondition, sideCompound, constant, hasOnlySubstanceUnit, substanceUnit, initialQuantity) VALUES ('$idBiosource', '$idMetabolite', '$boundaryCondition', '$sideCoumpound', '$constant', '$hasOnlySubstanceUnit', '$substanceUnit', '$initialQuantity');";

$num_result=mysqli_query($link, $sqlMetabInBioSource) or die('{success: false, message: "Error in Mysql Query when adding metabolite in BioSource: '.mysqli_error ($link).'"}');
$idMetabInBioSource= mysqli_insert_id($link);

AddSQLtoBioSourceLog($idBiosource,$sqlMetabInBioSource,$iduser);

$sqlMetaboliteRef="INSERT INTO  MetaboliteIdentifiers (idMetabolite, extDBName, extID, origin, score) VALUES";

$changes = 0;
foreach ($DBref as  $x=>$x_value){
	
	if($x_value != ''){
		
		$changes ++;

		$db=mysqli_real_escape_string ( $link , $x );
		$id=mysqli_real_escape_string ( $link , $x_value );
		
		$sqlMetaboliteRef.=" ('$idMetabolite', '$db', '$id', 'UserInput', '1'),";
	}
}

if($changes > 0 )
{
	$sqlMetaboliteRef=substr($sqlMetaboliteRef,0, strlen($sqlMetaboliteRef)-1);

	$num_result=mysqli_query($link, $sqlMetaboliteRef) or die('{success: false, message: "Error in Mysql Query when adding external refs: '.$sqlMetaboliteRef.' : '.mysqli_error ($link).'"}');

	AddSQLtoBioSourceLog($idBiosource,$sqlMetaboliteRef,$iduser);
}

echo '{"success":"true"}';
return;

?>
