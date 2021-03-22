<?php 

/**
 * Get users of given project.
 */

require_once '../database/connection.php';

$idProject = $_GET["idProject"];

if ($idProject != "-1"){

	$escapedIdProj=mysqli_real_escape_string ( $link , $idProject);

	$sql = "SELECT UserMet.id AS id, UserMet.name AS name, UserInProject.access AS access, UserInProject.active AS active"
		   ." FROM UserMet, UserInProject"
		   ." WHERE UserInProject.idProject = $escapedIdProj"
		   ." AND UserInProject.idUser = UserMet.id";
	
	$result = mysqli_query ( $link, $sql ) or die ( '{success: false, message: "dataUserProjects: Error in SQL request n°1"}' );
	while ($row = mysqli_fetch_object ( $result ))
	{
		$row->id = html_entity_decode ($row->id);
		$row->name = html_entity_decode ($row->name);
		$row->access = html_entity_decode ($row->access);
		$row->active = html_entity_decode ($row->active);
		$data [] = $row;
	}
	if ($data)
		$response["results"] = $data;
	else
		$response["results"] = [];
}
else
{
	$response["results"] = [];
}

$response["success"] = true;
echo json_encode($response);

?>