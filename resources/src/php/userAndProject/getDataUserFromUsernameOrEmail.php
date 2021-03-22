<?php

require_once '../database/connection.php';

$identifiant = mysqli_real_escape_string($link, $_POST['identifiant']);

if (strpos($identifiant, '@') !== false) {
	$search = "`email`=\"$identifiant\"";
	$response['type'] = 'mail';
}
else {
	$search = "`username`=\"$identifiant\"";
	$response['type'] = 'username';
}

$sql = "SELECT id, name FROM UserMet WHERE $search";

$result = mysqli_query ( $link, $sql ) or die ('{success: false, message:"Error in sql request n°1", error:"'. mysql_error () .'"}' );
if ($row = mysqli_fetch_object ( $result )) {
	$row->id = html_entity_decode ( $row->id );
	$row->name = html_entity_decode ( $row->name );
	$response['success'] = true;
	$response['results'] = $row;
}
else {
	$response['success'] = false;
	$response['message'] = "Unknown user!";
}

echo json_encode($response);

?>