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

// Check if the compartment id already exists

$sqlCheck = "SELECT cib.identifier ".
"FROM CompartmentInBioSource cib  ".
"WHERE cib.identifier='$cmptId' AND cib.idBioSource='$idBiosource'";

$res=mysqli_query($link, $sqlCheck) or die('{success: "false", message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

$num_result = $res->num_rows;

if($num_result > 0)
{
	die('{success: "false", message: "Compartment can\'t be added. Compartment with same id already exists."}');
} 



$name=mysqli_real_escape_string ( $link , $name );

$sqlCompartCheck="SELECT idCompartment AS id FROM Compartment WHERE name='$name';";
$result=mysqli_query ($link,$sqlCompartCheck) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

$tab=mysqli_fetch_assoc($result);

if($tab=="") {

	$default=mysqli_real_escape_string ( $link , $default );

	$sqlCompart="INSERT INTO Compartment (`name`, `default`) VALUES ('$name', '$default')";
	
	$num_result=mysqli_query($link, $sqlCompart) or die('{success: false, message: "Error in Mysql Query"}');
	$idCompartment= mysqli_insert_id($link);
	
}else{
		
	$idCompartment=$tab["id"];
}

$idCompartment=mysqli_real_escape_string ( $link , $idCompartment );
$idBiosource=mysqli_real_escape_string ( $link , $idBiosource );
$spatialDimensions=mysqli_real_escape_string ( $link , $spatialDimensions );



$sqlCompartInBioSource="INSERT INTO CompartmentInBioSource (idCompartment, idBioSource, spatialDimensions, units, constant, size, identifier) VALUES ('$idCompartment', '$idBiosource', '$spatialDimensions', ";

if(isset ($units)){
	$units=mysqli_real_escape_string ( $link , $units );

	$sqlCompartInBioSource.="'$units', ";
}else{
	$sqlCompartInBioSource.="NULL, ";
}

$constant=mysqli_real_escape_string ( $link , $constant );
$sqlCompartInBioSource.="'$constant', ";

if(isset ($size)){
	$size=mysqli_real_escape_string ( $link , $size );

	$sqlCompartInBioSource.="'$size', ";
}else{
	$sqlCompartInBioSource.="NULL, ";
}

$cmptId=mysqli_real_escape_string ( $link , $cmptId );

$sqlCompartInBioSource.="'$cmptId');";

$num_result=mysqli_query($link, $sqlCompartInBioSource) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
$idCompartInBioSource= mysqli_insert_id($link);


$action = array(
		"action" => "add compartment form",
		"idCompartment" => $idCompartment,
		"name" => $name,
		"data" => $functionParam
);

AddSQLtoBioSourceLog($idBiosource,$sqlCompartInBioSource,$iduser, $action, $link);



if ($outCmp!=""){

	$outCmp=mysqli_real_escape_string ( $link , $outCmp );


	$sqlCompartInCompart="INSERT INTO CompartmentInCompartment (idCompartmentInBioSource, idCompartmentOutside) VALUES ('$idCompartInBioSource', '$outCmp');";
	
	$num_result=mysqli_query($link, $sqlCompartInCompart) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
	
	AddSQLtoBioSourceLog($idBiosource,$sqlCompartInCompart,$iduser);
}

echo '{"success":"true"}';
return;

?>
