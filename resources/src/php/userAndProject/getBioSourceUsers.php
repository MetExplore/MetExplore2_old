<?php

require_once '../database/connection.php';
require_once '../user/userFunctions.php';

$P_idUser = getIdUser();
$P_idBioSource = $_POST['idBioSource'];

$rights = getBioSourceRights($P_idUser, $P_idBioSource, $link);
if ($rights != "p") {
	die('{success: false, message: "Error! You are not the owner of this BioSource!"}');
}

$P_idBioSource=mysqli_real_escape_string ( $link , $P_idBioSource );

$sql = "SELECT UserMet.id AS id, UserMet.name AS name, 1 AS valid, Status.name AS access FROM UserBioSource, UserMet, Status "
	   ."WHERE UserBioSource.idBioSource = $P_idBioSource AND UserBioSource.idUser = UserMet.id "
	   ."AND UserBioSource.Acces = Status.idStatus";

$result = mysqli_query ( $link, $sql ) or die('{success: false, message: "Error in SQL request n°1"}');

$users = array();
$access = "denied";

while ($row = mysqli_fetch_object ( $result )) {
	$user = array(
		"id" => html_entity_decode ( $row->id ),
		"name" => html_entity_decode ( $row->name ),
		"access" => html_entity_decode ( $row->access ),
		"valid" => $row->valid
	);
	
	array_push($users, $user);
	
	if ($row->id == $P_idUser) {
		$access = $row->access;
	}
}

$response = array(
	"success" => true,
	"users" => $users,
	"access" => $access
);

echo json_encode($response);

?>