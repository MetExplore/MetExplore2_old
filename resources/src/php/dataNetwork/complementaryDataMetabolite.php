<?php
require_once("../database/connection.php");

$functionParam= json_decode($_POST['functionParam'], $assoc=true);

extract ( $functionParam, EXTR_OVERWRITE );

$response["success"] = false;

$sql="SELECT Metabolite.charge, Metabolite.generic, MetaboliteInBioSource.constant, MetaboliteInBioSource.boundaryCondition , MetaboliteInBioSource.hasOnlySubstanceUnit , MetaboliteInBioSource.substanceUnit , MetaboliteInBioSource.initialQuantity FROM Metabolite, MetaboliteInBioSource WHERE Metabolite.id=MetaboliteInBioSource.idMetabolite AND Metabolite.id=$idMetabolite AND MetaboliteInBioSource.idBioSource=$idBiosource;";


$result=mysqli_query ($link,$sql);

if(! $result) {
    $response["message"] = "Unable to get complementary data on the metabolite" ;
    mysqli_error($link);
    die(json_encode($response));
}

$results = array();

while ($tab=mysqli_fetch_assoc($result))
{

    $results=$tab;
    /* retiré pour version paper metexplore2
    attention le explode car on a des valeurs dans la base de type 5.5E-4-Concentration (le explode va couper apres E !)
    $tmp=explode("-",$tab["initialQuantity"]);
    $results["iValue"]=$tmp[0];
    $results["qty"]=$tmp[1];*/
}

$response["success"] = true;
$response["results"] = $results;
echo json_encode($response);
?>
