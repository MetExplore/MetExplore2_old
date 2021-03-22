<?php
require_once("../database/connection.php");

$functionParam= json_decode($_POST['functionParam'], $assoc=true);

extract ( $functionParam, EXTR_OVERWRITE );

$response["success"] = false;

$sql ="SELECT C.default, CbS.spatialDimensions, CbS.units, CbS.constant, CbS.size, CiC.idCompartmentOutside AS outCmp 
FROM Compartment C, CompartmentInBioSource CbS 
LEFT OUTER JOIN  `CompartmentInCompartment` CiC ON ( CiC.`idCompartmentInBioSource` = CbS.`idCompartmentInBioSource` ) 
WHERE C.idCompartment = CbS.idCompartment 
AND CbS.`idCompartmentInBioSource` = '$idCmptInBS' ";

// error_log($sql);
$result=mysqli_query ($link,$sql);

if(! $result) {
	$response["message"] = "Unable to get complementary data on the Compartment" ;
	mysqli_error($link);
	die(json_encode($response));
}

$results = array();

while ($tab=mysqli_fetch_assoc($result))
{
	$results=$tab;
}

$response["success"] = true;
$response["results"] = $results;
echo json_encode($response);

?>
