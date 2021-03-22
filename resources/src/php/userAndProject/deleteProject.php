<?php

require_once '../database/connection.php';
require_once '../user/userFunctions.php';

$P_idUser = getIdUser();
$P_idProject = $_POST['idProject'];
$action = $_POST['action'];

$hasRights = true;

if ($action == 'delete') {

	if ($P_idProject != -1)
	{
		$access = getProjectRights($P_idUser, $P_idProject, $link);
		if ($access != "p") {
			$hasRights = false;
		}
	}
	
	if ($hasRights) {
		$P_idProject = mysqli_real_escape_string ( $link , $P_idProject);

		$sql = "DELETE FROM Project WHERE id=$P_idProject";
		$result = mysqli_query ( $link, $sql ) or die('{success: false, message: "Error in SQL request n°1"}');
		$response["success"] = true;
	}
	
	else {
		$response["success"] = false;
		$response["message"] = "access denied!";
	}
}

elseif ($action == 'quit') {
	if ($P_idProject != -1){

		$P_idProject = mysqli_real_escape_string ( $link , $P_idProject);
		$P_idUser = mysqli_real_escape_string ( $link , $P_idUser);
		
		$sql = "DELETE FROM UserInProject WHERE idUser=$P_idUser AND idProject=$P_idProject";
		$result = mysqli_query ( $link, $sql ) or die('{success: false, message: "Error in SQL request n°2"}');
	}
	$response["success"] = true;
}

echo json_encode($response);

?>