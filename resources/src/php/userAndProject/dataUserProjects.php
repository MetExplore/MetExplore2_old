<?php
/**
 * Get projects of given user.
 */

require_once '../database/connection.php';
require_once '../user/userFunctions.php';


$P_user = mysqli_real_escape_string ( $link , getIdUser());

//SQL request to get all projects of a user:
$sql = "SELECT Project.id AS idProject, Project.name AS name, Project.description AS description,"
	   ." Project.dateC AS dateC, UserInProject.active AS active, UserInProject.lastvisitDate AS lastVisit, Status.status AS idAccess, Status.name AS access"
	   ." FROM Project, Status, UserInProject"
	   ." WHERE UserInProject.idUser=$P_user"
	   ." AND Project.id = UserInProject.idProject"
	   ." AND UserInProject.idAccess = Status.idStatus";


$result = mysqli_query ( $link, $sql ) or die ( '{success: false, message: "dataUserProjects: Error in SQL request n°1"}' );

$data = array();
while ($row = mysqli_fetch_object ( $result ))
{
	$row->idProject = html_entity_decode ($row->idProject);
	$row->name = html_entity_decode ($row->name);
	$row->description = html_entity_decode ($row->description);
	//Get date without hour:
	$dateC= html_entity_decode ( $row->dateC );
	//$dateC = split(' ', $dateC);
	$dateC = explode(' ', $dateC);
	$row->dateC = $dateC[0];
	$row->idAccess = html_entity_decode ($row->idAccess);
	$row->access = html_entity_decode ($row->access);
	$row->lastVisit = html_entity_decode ($row->lastVisit);
	$row->neverOpened = true;
	
	//Get last modification date:
	$sqlD = "SELECT MAX(BioSource.dateLastModif) AS lastModification, BioSource.dateAdd as dateAdd".
			" FROM BioSource, BioSourceInProject WHERE BioSourceInProject.idProject = " . $row->idProject.
			" AND BioSourceInProject.idBioSource = BioSource.id GROUP BY dateAdd";

			$resultD = mysqli_query ( $link, $sqlD ) or die ( '{success: false, message: "dataUserProjects: Error in SQL request n°2"}' );
	if ($rowD = mysqli_fetch_object ( $resultD )) {
		$row->lastModification = $rowD->lastModification != "0000-00-00 00:00:00" ? $rowD->lastModification : $rowD->dateAdd ;
	}
	else {
		$row->lastModification = "unknown";
	}
	
	//Get users of this project:
	$sqlU = "SELECT UserInProject.idUser AS idUser, UserMet.name AS name, UserMet.username AS username, UserInProject.active AS valid, Status.name AS access"
			." FROM UserInProject, UserMet, Status"
			." WHERE UserInProject.idProject=". $row->idProject
			." AND UserInProject.idUser = UserMet.id"
			." AND UserInProject.idAccess = Status.idStatus";
	$resultU = mysqli_query ( $link, $sqlU ) or die ( '{success: false, message: "dataUserProjects: Error in SQL request n°3"}' );
	$listUsers = array();
	while ($rowU = mysqli_fetch_object ( $resultU ))
	{
		$user['id'] = html_entity_decode ($rowU->idUser);
		$user['name'] = html_entity_decode ($rowU->name);
		$user['username'] = html_entity_decode ($rowU->username);
		$user['valid'] = html_entity_decode ($rowU->valid);
		$user['access'] = html_entity_decode ($rowU->access);
		array_push($listUsers, $user);
	}
	$row->users = $listUsers;
	$data [] = $row;
}

$response["success"] = true;
$response["results"] = $data;

echo json_encode($response);

?>