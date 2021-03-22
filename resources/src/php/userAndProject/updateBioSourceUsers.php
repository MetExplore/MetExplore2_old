<?php

require_once '../database/connection.php';
require_once '../user/userFunctions.php';

$P_idUser = getIdUser();
$P_idBioSource = $_POST['idBioSource'];
$P_users = json_decode($_POST['users'], true);

$rights = getBioSourceRights($P_idUser, $P_idBioSource, $link);
if ($rights != "p") {
	die('{success: false, message: "Error! You are not the owner of this BioSource!"}');
}

//Check if BioSource is part of project:
$P_idBioSource=mysqli_real_escape_string ( $link , $P_idBioSource);

$sql = "SELECT * FROM BioSourceInProject WHERE idBioSource = $P_idBioSource";
$result = mysqli_query ( $link, $sql ) or die('{success: false, message: "Error in SQL request n°1"}');
if (mysqli_num_rows($result) > 0) {
	die('{success: false, message: "Error! You cannot share a BioSource that is in a project. Please add the person to the project instead."}');
}

//So, we can update users:

//First, delete all users of the BioSource:
$sql = "DELETE FROM UserBioSource WHERE idBioSource=$P_idBioSource";
$result = mysqli_query ( $link, $sql ) or die('{success: false, message: "Error in SQL request n°2"}');

//Then, add new users:
$sql = "INSERT INTO UserBioSource (idBioSource, idUser, Acces) VALUES ";
$entries = array();
foreach ($P_users as $idUser => $access) {
	array_push($entries, "($P_idBioSource, '".mysqli_real_escape_string ( $link , $idUser)."', (SELECT idStatus FROM Status WHERE name='".mysqli_real_escape_string ( $link , $access)."' AND idStatusType = (SELECT idStatusType FROM StatusType WHERE name=\"access_rights\")))");
}
$sql .= implode(", ", $entries);
$result = mysqli_query ( $link, $sql ) or die('{success: false, message: "Error in SQL request n°3"}');

echo "{success: true}";

?>