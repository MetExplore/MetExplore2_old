<?php

/**
 * Save a project.
 */

require_once '../database/connection.php';
require_once '../user/userFunctions.php';


$P_idUser = mysqli_real_escape_string($link, getIdUser());
$P_desc = "";
$P_name = "";
$P_idProject = -1;
$P_users = array();
$P_deletedUsers = array();
$action = "";

if (isset($_POST['desc']))
	$P_desc = mysqli_real_escape_string($link, $_POST['desc']);
if (isset($_POST['name']))
	$P_name = mysqli_real_escape_string($link, $_POST['name']);
if (isset($_POST['idProject']))
	$P_idProject = mysqli_real_escape_string($link, $_POST['idProject']);
if (isset($_POST['users']))
	$P_users = json_decode($_POST['users'], true);
if (isset($_POST['deletedUsers']))
	$P_deletedUsers = json_decode($_POST['deletedUsers'], true);
if (isset($_POST['action']))
	$action = $_POST['action'];

$hasRights = true;
$isOwner = false;

if ($P_idProject != -1)
{
	$access = getProjectRights($P_idUser, $P_idProject, $link);
	if ($access != "p" && $access != "rw") {
		$hasRights = false;
	}
	elseif ($access == "p") {
		$isOwner = true;
	}
}
else {
	$isOwner = true;
}

if ($hasRights) {
	if ($action == "updateDescription") {
		if ($P_idProject != -1) {
			$sql = "UPDATE Project SET description=\"$P_desc\" WHERE id = $P_idProject";
			$result = mysqli_query ( $link, $sql ) or die('{success: false, message: "Error in SQL request n°0"}');
		}
		else
			die('{success: false, message: "You cannot update description of a null project (idProject=-1)!"}');
	}
	elseif ($action == "updateUsers") {
		if ($P_idProject != -1) {
			if ($isOwner)
				$response["access"] = updateUsers($link, $P_idUser, $P_users, $P_deletedUsers, $P_idProject);
			else
				die('{success: false, message: "Access denied!"}');
		}
		else
			die('{success: false, message: "You cannot update users of a null project (idProject=-1)!"}');
	}
	else {
		//Insert of update project:
		if ($action == "add") {
			$sql = "INSERT INTO Project (name, description) VALUES(\"$P_name\", \"$P_desc\")";
		}
		else
		{
			$sql = "UPDATE Project SET name=\"$P_name\", description=\"$P_desc\" WHERE id = $P_idProject";
		}
		$result = mysqli_query ( $link, $sql ) or die('{success: false, message: "Error in SQL request n°1"}');
		if ($action == "add") {
			$P_idProject = mysqli_insert_id($link);
		}
		
		if ($isOwner) {
			$response["access"] = updateUsers($link, $P_idUser, $P_users, $P_deletedUsers, $P_idProject);
		}
	}
	
	$response["success"] = true;
	$response["idProject"] = $P_idProject;
	$response["dateC"] = date('Y-m-d');
}
else {
	$response["success"] = false;
	$response["message"] = "access denied!";
}

echo json_encode($response);

function updateUsers($link, $P_idUser, $P_users, $P_deletedUsers, $P_idProject) {
	$access = "denied";
	//Delete deleted users:
	foreach ($P_deletedUsers as $idUser) {
		$idUser = mysqli_real_escape_string($link, $idUser);
		$sql = "DELETE FROM UserInProject WHERE idUser=$idUser";
		$result = mysqli_query ( $link, $sql ) or die('{success: false, message: "Error in SQL request n°2 for user '. $idUser .'"}');
	}
	
	//Insert or update users of project
	foreach ($P_users as $user) {
		$idUser = mysqli_real_escape_string($link, $user['id']);
		$accessUser = mysqli_real_escape_string($link, $user['access']);
		$validUser = mysqli_real_escape_string($link, $user['valid']);
		$sql = "INSERT INTO UserInProject (idUser, idProject, idAccess, active) VALUES "
			   ."($idUser, $P_idProject, (SELECT idStatus FROM Status WHERE name=\"$accessUser\" AND idStatusType = (SELECT idStatusType FROM StatusType WHERE name=\"access_rights\")), $validUser)"
			   ." ON DUPLICATE KEY UPDATE idAccess=(SELECT idStatus FROM Status WHERE name=\"$accessUser\" AND idStatusType = (SELECT idStatusType FROM StatusType WHERE name=\"access_rights\")), active=$validUser";
		$result = mysqli_query ( $link, $sql ) or die('{success: false, message: "Error in SQL request n°3 for user '. $idUser .'"}');
		if ($idUser == $P_idUser) {
			$access = $accessUser;
		}
	}
	
	return $access;
}

?>