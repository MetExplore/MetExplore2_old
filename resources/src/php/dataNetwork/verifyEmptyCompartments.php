<?php
require_once '../database/connection.php';

$compIDS=$_GET['ids'];

$compIDSArray=explode ( ", " , $compIDS);

$response = array();
$response["success"] = false;
$data = array();

foreach ($compIDSArray as $value){

	$singleCompData= array();

	$singleCompData['id']=$value;

    $sql="SELECT COUNT(DISTINCT idMetabolite) as nbMet FROM MetaboliteInCompartment WHERE idCompartmentInBioSource='$value';";
    $result=mysqli_query ($link, $sql);

    while ($row=mysqli_fetch_object($result)){
		$singleCompData ["nbMet"] = $row->nbMet;
    }

    $sql="SELECT COUNT(DISTINCT idProtein) as nbProt FROM ProteinInCompartment WHERE idCompartmentInBioSource='$value';";
    $result=mysqli_query ($link, $sql);

    while ($row=mysqli_fetch_object($result)){
		$singleCompData ["nbProt"] = $row->nbProt;
    }

    $sql="SELECT COUNT(DISTINCT idEnzyme) as nbEnz FROM EnzymeInCompartment WHERE idCompartmentInBioSource='$value';";
    $result=mysqli_query ($link, $sql);

    while ($row=mysqli_fetch_object($result)){
		$singleCompData ["nbEnz"] = $row->nbEnz;
    }

    $data[]=$singleCompData;

}

$response["success"] = true;
$response["results"] = $data;
echo json_encode($response);
?>