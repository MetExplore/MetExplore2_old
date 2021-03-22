<?php

/* Add a BioSource to current project: */

require_once '../database/connection.php';
require_once '../user/userFunctions.php';


$P_idUser = getIdUser();
$P_idProject = getIdProject();
$P_idBioSources = json_decode($_POST['idBioSources'], true);
$P_usersToAdd = json_decode($_POST['usersToAdd'], true);

//We do checks again, to counteract pirates!!

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

//Check if BioSources are always in another project:
foreach($P_idBioSources as $P_idBioSource) {

	$idBiosource=mysqli_real_escape_string ( $link , $P_idBioSource );

	$sql = "SELECT idProject FROM BioSourceInProject WHERE idBioSource = $idBiosource";
	$result = mysqli_query ( $link, $sql ) or die ('{success: false, message: "error in mysql request n°1 in check add BioSource to project: '. mysqli_error ($link) .'"}' );
	$hasRows = mysqli_num_rows($result) > 0;
	if ($hasRows) {
		die('{success: false, message:"Impossible to add selected BioSource to current project: at least one selected BioSource is already in another project"}');
	}
}

$P_idProject=mysqli_real_escape_string ( $link , $P_idProject);

//We add users to project with given access, if needed:
if (count($P_usersToAdd) > 0) {
	$values = array();
	foreach($P_usersToAdd as $user) {
		array_push($values, "(" . mysqli_real_escape_string ( $link , $user["id"]) . ", $P_idProject, " . "(SELECT idStatus FROM Status, StatusType WHERE Status.name = '" . mysqli_real_escape_string ( $link , $user["access"]) . "' AND Status.idStatusType = StatusType.idStatusType AND StatusType.name=\"access_rights\")" . ", 1)");
	}
	$values = join(", ", $values);
	$sql = "INSERT INTO UserInProject (idUser, idProject, idAccess, active) VALUES $values";
	$result = mysqli_query ( $link, $sql ) or die ('{success: false, message: "error in mysql request n°2 in add BioSource to project: '. mysqli_error ($link) .'"}' );
}

//We add the BioSource to the project:
$sql = "INSERT INTO BioSourceInProject (idBioSource, idProject) VALUES ";
$values = array();
foreach($P_idBioSources as $P_idBioSource) {
	$idBiosource=mysqli_real_escape_string ( $link , $P_idBioSource );
	
	array_push($values, "($idBiosource, $P_idProject)");
}
$sql .= implode(", ", $values);

$result = mysqli_query ( $link, $sql ) or die ('{success: false, message: "error in mysql request n°3 ('.$sql.') in add BioSource to project: '. mysqli_error ($link) .'"}' );

//Done:
echo "{success: true}";

?>