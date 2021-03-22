<?php
/**
 * Get todo list for given user, and given project if given.
 */

require_once '../database/connection.php';
require_once '../user/userFunctions.php';

$P_user = mysqli_real_escape_string ( $link , getIdUser());

$P_project = $_GET["idProject"];

if ($P_project == "-1")
{
 	$sql1 = "SELECT UserMet.name AS user, Project.id AS idProject, Project.name AS project, TodoList.id AS id, TodoList.todo AS todo,"
						." TodoList.limitDate AS limitDate,"
						." TodoList.dateA AS dateAjout,"
						." TodoList.idUser AS idUser,"
						." Status1.name AS status,"
						." Status2.name AS priority"
						." FROM TodoList, UserMet, Project, Status AS Status1, Status AS Status2"
						." WHERE TodoList.idProject in (SELECT idProject FROM UserInProject where idUser=$P_user)"
						." AND TodoList.idProject = Project.id"
						." AND TodoList.idUser = UserMet.id"
						." AND TodoList.idStatus = Status1.idStatus"
						." AND TodoList.priority = Status2.idStatus";
$sql2 = "SELECT UserMet.name AS user, -1 AS idProject, \"None\" AS project, TodoList.id AS id, TodoList.todo AS todo,"
					." TodoList.limitDate AS limitDate,"
					." TodoList.dateA AS dateAjout,"
					." TodoList.idUser AS idUser,"
					." Status1.name AS status,"
					." Status2.name AS priority"
					." FROM TodoList, UserMet, Status AS Status1, Status AS Status2"
					." WHERE TodoList.idUser = $P_user"
					." AND TodoList.idProject IS NULL"
					." AND TodoList.idUser = UserMet.id"
					." AND TodoList.idStatus = Status1.idStatus"
					." AND TodoList.priority = Status2.idStatus"; 

	$sql = "$sql1 UNION $sql2;";

}
else
{
	$sql = "SELECT UserMet.name AS user, UserMet.id AS idUser, Project.id AS idProject, Project.name AS project, TodoList.id AS id, TodoList.todo AS todo, TodoList.limitDate AS limitDate, TodoList.dateA AS dateAjout, Status.name AS status"
					." FROM TodoList, UserMet, Project, Status"
					." WHERE TodoList.idProject = $P_project"
					." AND TodoList.idProject = Project.id"
					." AND TodoList.idUser = UserMet.id"
					." AND TodoList.idStatus = Status.idStatus;";
}

$result = mysqli_query ( $link, $sql );

if (! $result) {
	$response ["message"] = "Impossible to get TODO list!";
	$response["success"] = false;
	//error_log("ERROR IN SQL REQUEST ON GET TODO LIST ITEMS: " . $sql);
}
else {
	$data = array();
	while ( $row = mysqli_fetch_object ( $result ) ) {
		$row->idUser = html_entity_decode ( $row->idUser );
		$row->user= html_entity_decode ( $row->user );
		$row->project= html_entity_decode ($row->project);
		$row->idProject= html_entity_decode ($row->idProject);
		$row->todo = html_entity_decode ($row->todo);
		//Get date without hour:
 		$dateAjout= html_entity_decode ( $row->dateAjout );
 		$dateAjout = explode(' ', $dateAjout);
 		$row->dateAjout = $dateAjout[0];
 		$row->limitDate= html_entity_decode ( $row->limitDate );
		$row->status= html_entity_decode ( $row->status );
		$data [] = $row;
	}
	$response["success"] = true;
	$response["results"] = $data;
}


echo json_encode($response);

?>