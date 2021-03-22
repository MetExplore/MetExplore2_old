<?php
/**
 * Get todo list for given user, and given project if given.
 */

require_once '../database/connection.php';
require_once '../user/userFunctions.php';


$P_user = getIdUser();
$P_updateList = json_decode($_POST['todoListUpdt'], true);
$action = $_POST["action"];

$response["message"] = "done";

//Update each item:
$nbItem = 0;
$success_items = array();
if ($action == "update")
{
	foreach ($P_updateList as $item)
	{
		//Escape special chars for items:
		foreach($item as $key => $value)
		{
			$item[$key] = mysqli_real_escape_string($link, $value);
		}
        $orig = json_decode($_POST['todoListOrig'], true);
		foreach($orig as $key => $value)
		{
			if (is_array($value)) {
				foreach($value as $value1) {
					$value1 = mysqli_real_escape_string($link, $value1);
				}
			}
			else {
				$item[$key] = mysqli_real_escape_string($link, $value);
			}
		}
		//Check if user can edit this todo:
		if ($orig[$nbItem]['idUser'] != $P_user) {
			$idProject = $orig[$nbItem]['idProject'];
			if ($idProject != "-1") { //Else it can't
				$sql = "SELECT status AS access FROM Status, UserInProject WHERE UserInProject.idUSer=$P_user AND UserInProject.idProject=$idProject AND UserInProject.idAccess = Status.idStatus";
				$result = mysqli_query ( $link, $sql ) or die ('{success: false, message:"Error in sql request n°1", error:"'. mysqli_error ($link) .'"}' );
				if ($row = mysqli_fetch_object ( $result ))
				{
					if ($row->access == "p") {
						$canDo = true;
					}
					else {
						$canDo = false;				
					}
				}
				else
				{
					die('{success: false, message: "Error while retrieving your access to the project associated to the TODO."}');
				}
			}
			else {
				$canDo = false;
			}
		}
		else {
			$canDo = true;
		}
		//If user can do it, do update:
		if ($canDo) {
			$sql = "UPDATE TodoList"
				   ." SET idUser = ". $item['idUser']. ","
				   ." limitDate = \"". $item['limitDate']. "\","
				   ." idProject = ". ($item['idProject'] != "-1" ? $item['idProject'] : "NULL") . ","
				   ." idStatus = (SELECT idStatus FROM Status, StatusType WHERE Status.name=\"". $item['status']. "\" AND Status.idStatusType = StatusType.idStatusType AND StatusType.name=\"todo_status\"),"
				   ." priority = (SELECT idStatus FROM Status, StatusType WHERE Status.name=\"". $item['priority']. "\" AND Status.idStatusType = StatusType.idStatusType AND StatusType.name=\"priority\"),"
				   ." todo = \"". $item['todo']. "\""
				   ." WHERE id=" . $item['id'];
			// error_log($sql);
			$result = mysqli_query ( $link, $sql ) or die ('{success: false, message:"Error in sql request n°2", error:"'. mysqli_error ($link) .'"}' );
			if ($item['idUser'] != $orig[$nbItem]['idUser'])
			{
				$sql = "SELECT name FROM UserMet WHERE id=" . $item['idUser'];
				$result = mysqli_query ( $link, $sql ) or die ('{success: false, message:"Error in sql request n°3", error:"'. mysqli_error ($link) .'"}' );
				if ($row = mysqli_fetch_object ( $result )) {
					$item['user'] = $row->name;
				}
				else {
					die('{success: false, message: "Error while retrieving user name."}');
				}
			}
			if ($item['idProject'] != $orig[$nbItem]['idProject'] && $item['idProject'] != "-1")
			{
				$sql = "SELECT name FROM Project WHERE id=" . $item['idProject'];
				$result = mysqli_query ( $link, $sql ) or die ('{success: false, message:"Error in sql request n°3", error:"'. mysqli_error ($link) .'"}' );
				if ($row = mysqli_fetch_object ( $result )) {
					$item['project'] = $row->name;
				}
				else {
					die('{success: false, message: "Error while retrieving project name."}');
				}
			}
			else if ($item['idProject'] == "-1") {
				$item['project'] = "None";
			}
			array_push($success_items, $item);
		}
		else {
			$response["message"] = "You can update only your actions, even if you are not the owner of the associated project!";
			array_push($success_items, null);
		}
		$nbItem++;
	}
}

elseif ($action == "add")
{

    $nameUser = $_POST["nameUser"];
	foreach ($P_updateList as $item)
	{
		foreach($item as $key => $value)
		{
			$item[$key] = mysqli_real_escape_string($link, $value);
		}
		//Check user is part of the project:
		$idProject = $item['idProject'];
		if ($idProject != "-1") {
			$sql = "SELECT idProject FROM UserInProject WHERE idUser = $P_user AND idProject=$idProject";
			$result = mysqli_query ( $link, $sql ) or die ('{success: false, message:"Error in sql request n°4", error:"'. mysqli_error ($link) .'"}' );
			if (!mysqli_fetch_object ( $result ))
			{
				die("{success: false, message: \"You can't add a TODO for a project you are not in!\"}");
			}
		}
		$sql = "INSERT INTO TodoList (idProject, idStatus, idUser, todo, limitDate, priority) VALUES(" . ($idProject != "-1" ? $idProject : "NULL") . ", (SELECT idStatus FROM Status WHERE name = \"" . $item['status'] . "\"), "
			   . $item['idUser'] . ", \"" . $item['todo'] . "\", \"" . $item['limitDate'] . "\", (SELECT idStatus FROM Status, StatusType WHERE Status.name=\"". $item['priority']. "\" AND Status.idStatusType = StatusType.idStatusType AND StatusType.name=\"priority\"))";
		$result = mysqli_query ( $link, $sql ) or die ('{success: false, message:"Error in sql request n°5", error:"'. mysqli_error ($link) .'"}' );
		$item['id'] = mysqli_insert_id($link);		
		
		//Retrieving data:
		$sql = "SELECT name FROM UserMet WHERE id=" . $item['idUser'];
		$result = mysqli_query ( $link, $sql ) or die ('{success: false, message:"Error in sql request n°6", error:"'. mysqli_error ($link) .'"}' );
		if ($row = mysqli_fetch_object ( $result )) {
			$item['user'] = $row->name;
		}
		else {
			die('{success: false, message: "Error while retrieving user name."}');
		}
		if ($item['idProject'] != "-1") {
			$sql = "SELECT name FROM Project WHERE id=" . $item['idProject'];
			$result = mysqli_query ( $link, $sql ) or die ('{success: false, message:"Error in sql request n°7", error:"'. mysqli_error ($link) .'"}' );
			if ($row = mysqli_fetch_object ( $result )) {
				$item['project'] = $row->name;
			}
			else {
				die('{success: false, message: "Error while retrieving project name."}');
			}
		}
		else {
			$item['project'] = "None";
		}
		$item['dateAjout'] = date("Y-m-d");
		array_push($success_items, $item);
		
		//Send mail to user if user assign TODO to another user:
		/*if ($item['idUser'] != $P_user)
		{
			//Get email of user:
			$sql = "SELECT email, name FROM UserMet WHERE id=" . $item['idUser'];
			$result = mysqli_query ( $link, $sql ) or die ('{success: false, message:"Error in sql request n°8", error:"'. mysql_error () .'"}' );
			if ($row = mysqli_fetch_object ( $result ))
			{
				$mail = $row->email;
				$name = $row->name;
				$sql = "SELECT name FROM Project WHERE id=" . $item['idProject'];
				$result = mysqli_query ( $link, $sql ) or die ('{success: false, message:"Error in sql request n°9", error:"'. mysql_error () .'"}' );
				if ($row = mysqli_fetch_object ( $result ))
				{
					$project = $row->name;
					$sujet = "[MetExplore] $nameUser has add a TODO for you";
					$message = "Dear $name,<br/> $nameUser has added a TODO for you for the project <b>$project</b> in MetExplore."
							   ."<br/><br/><b>Description: </b>" . $item['todo'] . "<br/><br/><b>Status: </b>" . $item['status'];
					
					$expediteur="From: MetExplore <metexplore@toulouse.inra.fr>";
					$entete = "MIME-Version: 1.0\r\n";
					$entete .= "Content-type: text/html; charset=UTF-8\r\n";
					$entete .= "From: MetExplore <metexplore@toulouse.inra.fr>\r\n";
					
					error_log("ENTETE: ".$entete);
					error_log("MAIL: ".$mail);
					error_log("MESSAGE: ".$message);
					error_log("SUJET: ".$sujet);
					
					if(mail($mail, $sujet, $message, $entete)){
						
					}
					else {
						$error = error_get_last();
						$errorType = $error["type"];
						$errorMessage = $error["message"];
						error_log("ERROR sending mail to user ". $item['idUser'] . " in an update of TODOLIST. Error message ($errorType): $errorMessage");
					}
				}
				else {
					error_log("ERROR while retrieving name of project ". $item['idUser'] . " in an update of TODOLIST.");
				}
			}
			else {
				error_log("ERROR while retrieving mail of user ". $item['idUser'] . " in an update of TODOLIST.");
			}
		}*/
	}
}

elseif ($action == "delete")
{
	foreach ($P_updateList as $item)
	{
		foreach($item as $key => $value)
		{
			$item[$key] = mysqli_real_escape_string($link, $value);
		}
		$canDo = true;
		if ($P_user != $item['idUser'])
		{
			//Check if user have rights
			$idProject = $item['idProject'];
			$sql = "SELECT status AS access FROM Status, UserInProject WHERE UserInProject.idUSer=$P_user AND UserInProject.idProject=$idProject AND UserInProject.idAccess = Status.idStatus";
			$result = mysqli_query ( $link, $sql ) or die ('{success: false, message:"Error in sql request n°9", error:"'. mysqli_error ($link) .'"}' );
			if ($row = mysqli_fetch_object ( $result ))
			{
				if ($row->access == "p") {
					$canDo = true;
				}
				else {
					$canDo = false;
				}
			}
			else
			{
				die('{success: false, message: "Error while retrieving your access to the project associated to the TODO."}');
			}
		}
		if ($canDo)
		{
			$sql = "DELETE FROM TodoList WHERE id=" . $item['id'];
			$result = mysqli_query ( $link, $sql ) or die ('{success: false, message:"Error in sql request n°10", error:"'. mysqli_error ($link) .'"}' );
			$success_items[$item['id']] = $item['idProject'];
		}
		else {
			$response["message"] = "You can delete only your actions, even if you are not the owner of the associated project!";
			//array_push($success_items, null);
		}
	}
}

$response["itemsUpdt"] = $success_items;
$response["success"] = true;

echo json_encode($response);

?>