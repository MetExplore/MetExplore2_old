<?php

/**
 * Get history for a given user, associed to only one project if idProject given and not equals to -1.
 */
session_start ();

require_once '../database/connection.php';
require_once '../user/userFunctions.php';

$response ["success"] = false;

$P_idUser = mysqli_real_escape_string ( $link , getIdUser ());
$P_idProject = mysqli_real_escape_string ( $link , $_GET ["idProject"]);
$from = "";
$to = "";
if (isset ( $_GET ["from"] ) && isset ( $_GET ["to"] )) {
	$withDate = true;
	$from = $_GET ["from"] . " 00:00:00";
	$to = $_GET ["to"] . " 23:59:59";
	$autoDate = false;
} elseif (isset ( $_SESSION ['historyFrom'] ) && isset ( $_SESSION ['historyTo'] )) {
	if (! isset ( $_GET ['autoDate'] ) || (isset ( $_GET ['autoDate'] ) && $_GET ['autoDate'] == false)) {
		$withDate = true;
		$from = $_SESSION ['historyFrom'];
		$to = $_SESSION ['historyTo'];
		$autoDate = false;
	} else {
		$withDate = true;
		$autoDate = true;
		unset ( $_SESSION ['historyFrom'] );
		unset ( $_SESSION ['historyTo'] );
	}
} elseif (isset ( $_GET ['autoDate'] ) && $_GET ['autoDate'] == true) {
	$withDate = true;
	$autoDate = true;
} else {
	$withDate = false;
	$autoDate = false;
}


if ($autoDate) {
	$sql = "SELECT MAX(History.dateA) AS dateA FROM History, UserBioSource" . " WHERE History.idBioSource = UserBioSource.idBioSource" .
	 " AND UserBioSource.idUser = $P_idUser" . " AND UserBioSource.idBioSource = History.idBioSource";
	
	$result = mysqli_query ( $link, $sql );
	if ($result == null) {
		$response ["message"] = 'error in getting history: (err 0 : ' . mysql_error () . ')';
		die ( json_encode ( $response ) );
	}
	
	if ($row = mysqli_fetch_object ( $result )) {
		if ($row->dateA != NULL) {
			$to = preg_split ( "/\s/", $row->dateA );
			$to = $to [0];
			$from = date ( 'Y-m-d', strtotime ( $to . ' - 15 days' ) );
			$from .= " 00:00:00";
			$to .= " 23:59:59";
		} else {
			$to = date ( 'Y-m-d' );
			$from = date ( 'Y-m-d', strtotime ( $to . ' - 15 days' ) );
			$from .= " 00:00:00";
			$to .= " 23:59:59";
		}
	} else {
		$response ["message"] = 'error in getting history: (no data while retreiving auto last modification date)';
		die ( json_encode ( $response ) );
	}
}

$escapedfrom = mysqli_real_escape_string ( $link , $from);
$escapedto = mysqli_real_escape_string ( $link , $to);

if ($P_idProject == "-1") {
	// History of the user
	
	// Get data for all projects the user is in
	$sql1 = "SELECT History.id AS id, History.idUser AS idUser, UserMet.name AS user, History.dateA AS date, History.idBioSource AS idBioSource,".
			" History.fileDetails AS fileDetails, BioSource.nameBioSource AS bioSource, Project.id AS idProject, Project.name AS project,".
			" History.action AS action" . 
			" FROM History, UserMet, BioSource, BioSourceInProject, Project, UserInProject" . 
			" WHERE UserInProject.idUser = $P_idUser" . " AND History.idUser = UserMet.id" . " AND History.idBioSource = BioSource.id" .
	 		" AND BioSource.id = BioSourceInProject.idBioSource" . " AND BioSourceInProject.idProject = Project.id" .
			  " AND UserInProject.idProject = Project.id";
			  
	if ($withDate) {
		$sql1 .= " AND History.dateA BETWEEN \"$escapedfrom\" AND \"$escapedto\"";
	}
	// Get data for all biosources the user is in, for biosources that are not in a project
	$sql2 = "SELECT History.id AS id, History.idUser AS idUser, UserMet.name AS user, History.dateA AS date, History.idBioSource AS idBioSource,".
			" History.fileDetails AS fileDetails, BioSource.nameBioSource AS bioSource, -1 AS idProject, \"Aucun\" AS project, History.action AS action" .
	 		" FROM History, UserMet, BioSource, UserBioSource" . " WHERE UserBioSource.idUser = $P_idUser" .
	  		" AND UserBioSource.idBioSource = History.idBioSource" . " AND History.idUser = UserMet.id" . " AND History.idBioSource = BioSource.id" .
	   		" AND History.idBioSource NOT IN (SELECT idBioSource FROM BioSourceInProject)";
	if ($withDate) {
		$sql2 .= " AND History.dateA BETWEEN \"$escapedfrom\" AND \"$escapedto\"";
	}
	$sql = $sql1 . " UNION " . $sql2;
} else {
	$sql = "SELECT History.id AS id, History.idUser AS idUser, UserMet.name AS user, History.dateA AS date, History.idBioSource AS idBioSource,".
			" History.fileDetails AS fileDetails, BioSource.nameBioSource AS bioSource, Project.name AS project, History.action AS action" .
	 		" FROM History, UserMet, BioSource, BioSourceInProject, Project" . " WHERE History.idUser = UserMet.id" . 
	 		" AND History.idBioSource = BioSource.id" . " AND BioSource.id = BioSourceInProject.idBioSource" . 
	 		" AND BioSourceInProject.idProject = Project.id" . " AND Project.id = $P_idProject";
	if ($withDate) {
		$sql .= " AND History.dateA BETWEEN \"$escapedfrom\" AND \"$escapedto\"";
	}
}

$result = mysqli_query ( $link, $sql ); 

if ($result == null) {
	$response ["message"] = 'error in getting history: (err 1 : ' . mysql_error () . ')';
	die ( json_encode ( $response ) );
}

$data = array ();
while ( $row = mysqli_fetch_object ( $result ) ) {
	$row->id = html_entity_decode ( $row->id );
	$row->idUser = html_entity_decode ( $row->idUser );
	$row->user = html_entity_decode ( $row->user );
	$row->project = html_entity_decode ( $row->project );
	$row->bioSource = html_entity_decode ( $row->bioSource );
	$row->idBioSource = html_entity_decode ( $row->idBioSource );
	$row->action = html_entity_decode ( $row->action );
	$row->fileDetails = html_entity_decode ( $row->fileDetails );
	// Get date without hour:
	$date = html_entity_decode ( $row->date );
	/*
	 * $date = split(' ', $date);
	 * $row->date = $date[0];
	 */
	$data [] = $row;
}

$response ["success"] = true;
$response ["results"] = $data;
$response ["to"] = $to;
$response ["from"] = $from;

$_SESSION ['historyFrom'] = $from;
$_SESSION ['historyTo'] = $to;

echo json_encode ( $response );

?>