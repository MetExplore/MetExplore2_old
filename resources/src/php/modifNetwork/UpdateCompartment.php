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
$idCompartment=mysqli_real_escape_string ( $link , $idCompartment );

// Check if the compartment id already exists

$sqlCheck = "SELECT cib.identifier ".
"FROM CompartmentInBioSource cib  ".
"WHERE cib.identifier='$cmptId' AND cib.idBioSource='$idBiosource'";

$res=mysqli_query($link, $sqlCheck) or die('{success: "false", message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

$num_result = $res->num_rows;

# If the metabolite id does not change, the number of metabolites with the 
# same id must equal to 1, otherwise to 0
$num_to_test = $cmptId == $initialValues['cmptId'] ? 1 : 0;

if($num_result > $num_to_test)
{
	die('{success: "false", message: "Compartment can\'t be updated. Compartment with same id already exists. Compartment ids must be unique."}');
} 



$sqlCompart="UPDATE Compartment SET name='$name', `default`='$default' WHERE idCompartment='$idCompartment';";
	
$num_result=mysqli_query($link, $sqlCompart) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

AddSQLtoBioSourceLog($idBiosource,$sql,$iduser);

$spatialDimensions=mysqli_real_escape_string ( $link , $spatialDimensions );
$units=mysqli_real_escape_string ( $link , $units );
$constant=mysqli_real_escape_string ( $link , $constant );
$size=mysqli_real_escape_string ( $link , $size );
$cmptId=mysqli_real_escape_string ( $link , $cmptId );
$idCmptInBS=mysqli_real_escape_string ( $link , $idCmptInBS );


$sqlCompartInBioSource="UPDATE CompartmentInBioSource SET spatialDimensions='$spatialDimensions', units='$units', constant='$constant', size='$size', identifier= '$cmptId' WHERE idCompartmentInBioSource='$idCmptInBS' ;";

$num_result=mysqli_query($link, $sqlCompartInBioSource) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

AddSQLtoBioSourceLog($idBiosource,$sqlCompartInBioSource,$iduser);

///////////////////////
//Delete old upper Compartment then add the new ones if defined

$sqlDelCmpt="DELETE FROM CompartmentInCompartment WHERE idCompartmentInBioSource='$idCmptInBS';";
$num_result=mysqli_query($link, $sqlDelCmpt) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

AddSQLtoBioSourceLog($idBiosource,$sqlDelCmpt,$iduser);

if ($outCmp!=""){

$outCmp=mysqli_real_escape_string ( $link , $outCmp );
	
	$sqlCompartInCompart="INSERT INTO CompartmentInCompartment (idCompartmentInBioSource, idCompartmentOutside) VALUES ('$idCmptInBS', '$outCmp');";
	
	$num_result=mysqli_query($link, $sqlCompartInCompart) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
	
	AddSQLtoBioSourceLog($idBiosource,$sqlCompartInCompart,$iduser);
}

echo '{"success":"true"}';
	return;

?>
