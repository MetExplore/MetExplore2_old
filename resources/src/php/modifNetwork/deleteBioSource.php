<?php

require_once('../database/connection.php');

$functionParam= json_decode($_POST['functionParam'], $assoc=true);
extract ( $functionParam, EXTR_OVERWRITE );

require_once '../user/userFunctions.php';

$currentUser=getIdUser();

if(getBioSourceRights($currentUser, $idBiosource, $link) == "denied"){
	echo '{"success":false}';
	return;
}

$databaseRef=mysqli_real_escape_string ( $link , $databaseRef );


$sql="DELETE FROM `DatabaseRef`  WHERE  `DatabaseRef`.`id`='$databaseRef'";

// error_log($sql);

$response["success"] = false;


$result=mysqli_query ($link, $sql);

if(! $result) {
	$response["message"] = "Impossible to delete this bioSources/databaseref!" ;
	mysqli_error($link);
	die(json_encode($response));
}

$response["success"] = true;
echo json_encode($response);

?>
