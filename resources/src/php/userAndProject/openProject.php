<?php

session_start();

require_once '../user/userFunctions.php';
require_once '../database/connection.php';

$P_idProject = $_POST['idProject'];
$P_idUser=getIdUser();

$access = getProjectRights($P_idUser, $P_idProject, $link);

$response = array();

if ($access == "denied") {
	$response["success"] = false;
	$response["message"] = "Access denied!";
}

else {
	$escapedIdProject=mysqli_real_escape_string ( $link , $P_idProject );
	$P_idUser=mysqli_real_escape_string ( $link , $P_idUser );

	//update the last visit date of the project:
	$sql = "UPDATE UserInProject SET lastvisitDate=\"" . date("Y-m-d H:i:s") . "\" WHERE idProject=$escapedIdProject AND idUser=$P_idUser";
	$result=mysqli_query($link, $sql) or $response["dateUpdated"] = "failed";
	
	$_SESSION['idProject'] = $P_idProject;
	$response["success"] = true;
}

echo json_encode($response);

?>