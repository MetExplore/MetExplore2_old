<?php

/**
 * Check User can add BioSource to current project, and if yes give list of other users that must be added to the project (if any)
 */

require_once '../database/connection.php';
require_once '../user/userFunctions.php';


$P_idUser = getIdUser();
$P_idProject = getIdProject();
$P_idBioSources = json_decode($_POST['idBioSources'], true);

//Check user is the owner of the project:
$accessProject =  getProjectRights($P_idUser, $P_idProject, $link);
if ($accessProject != "p") {
	die('{success: false, message:"Access denied: you are not an owner of the project!"}');
}

//Check user is the owner of the BioSources:
foreach($P_idBioSources as $P_idBioSource) {
	$accessBioSource = getBioSourceRights($P_idUser, $P_idBioSource, $link);
	if ($accessBioSource != "p") {
		die('{success: false, message:"Access denied: the biosource belongs to a project where you don\'t have owner rights!"}');
	}
}

$escapedIDBS=array();
//Check if BioSources are already in another project:
foreach($P_idBioSources as $P_idBioSource) {

	$idBiosource=mysqli_real_escape_string ( $link , $P_idBioSource );

	$sql = "SELECT idProject FROM BioSourceInProject WHERE idBioSource = '$idBiosource';";
	$result = mysqli_query ( $link, $sql ) or die ('{success: false, message: "error in mysql request n°1 in check add BioSource to project: '. mysqli_error ($link) .'"}' );
	$hasRows = mysqli_num_rows($result) > 0;
	if ($hasRows) {
		die('{success: false, message:"Impossible to add selected BioSource to current project: at least one selected BioSource is already in another project"}');
	}
	array_push($escapedIDBS, $idBiosource);
}

//Check if BioSource is shared with other users:
$sql = "SELECT UserMet.id AS idUser, UserMet.name AS nameUser, Status.name AS access "
	   ."FROM UserMet, UserBioSource, Status "
	   ."WHERE UserBioSource.idBioSource IN (" . implode(",", $escapedIDBS) . ") "
	   ."AND UserBioSource.idUser != $P_idUser AND UserBioSource.idUser = UserMet.id "
	   ."AND UserBioSource.Acces = Status.idStatus "
	   ."AND UserBioSource.idUser NOT IN (SELECT idUser FROM UserInProject WHERE idProject = $P_idProject)";

$result = mysqli_query ( $link, $sql ) or die ('{success: false, message: "error in mysql request n°2 in check add BioSource to project: '. mysqli_error ($link) .'"}' );
$otherUsers = array();
while ($row = mysqli_fetch_object ( $result )) {
	$user = array();
	$user['id'] = html_entity_decode ($row->idUser);
	$user['name'] = html_entity_decode ($row->nameUser);
	$user['access'] = html_entity_decode ($row->access);
	$user['valid'] = 1; //User is set as valid user without any confirmation
	array_push($otherUsers, $user);
}

$response["success"] = true;
if (count($otherUsers) > 0) {
	$response["hasOtherUsers"] = true;
	$response["otherUsers"] = $otherUsers;
}
else {
	$response["hasOtherUsers"] = false;
}

echo json_encode($response);

?>