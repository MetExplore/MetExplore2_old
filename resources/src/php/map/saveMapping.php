<?php 
//

require_once '../database/connection.php';
$P_idBioSource=	$_POST['idBioSource'];
$P_idUser=	$_POST['idUser'];
$P_titleData= $_POST['titleData'];
$P_objectData = $_POST['objectData'];
$P_fieldData= $_POST['fieldData'];

$P_data=$_POST['data'];


$sql= "INSERT INTO UserData (idBioSource, idUser, typeData, titleData, objectData, fieldData, jsonData) VALUES ($P_idBioSource, $P_idUser, \"mapping\", \"$P_titleData\", \"$P_objectData\", \"$P_fieldData\",$P_data)";
//error_log($sql);
$result=mysqli_query ($link, $sql) or die ('{success: false, message: "ERROR in request n°2: '.mysqli_error ($link). '. Please contact an administrator."}');


if (! $result) {
	$response ["message"] = "Impossible to set the mapping in database";
	$response["success"] = false;
}
else {
    $response ["message"] = "ok the mapping in database";
	$response["success"] = true;
}
echo json_encode($response);
?>