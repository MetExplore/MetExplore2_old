<?php

require_once '../database/connection.php';
require_once '../user/userFunctions.php';

$P_idUser = mysqli_real_escape_string ( $link , getIdUser());
$items = json_decode($_POST['items']);

$escapedIDBS=array();
foreach ($items as $item) {
	array_push($escapedIDBS, mysqli_real_escape_string ( $link , $item));
}
$ids = implode(",", $escapedIDBS);

//Check rights:
$sql = "SELECT DISTINCT Status.name AS access FROM History, UserBioSource, Status"
	   ." WHERE History.id IN ($ids)"
	   ." AND History.idBioSource = UserBioSource.idBioSource"
	   ." AND UserBioSource.idUser = '$P_idUser'"
	   ." AND UserBioSource.Acces = Status.idStatus";
$result = mysqli_query ( $link, $sql ) or die ('{success: false, message: "error in mysql request n°1 in delete history items: '. mysql_error () .'"}' );
$row = mysqli_fetch_object ( $result );
if (mysqli_num_rows($result) > 1 || $row->access != "owner") {
	die('{success: false, message:"You cannot delete items if you are not an owner of the linked BioSource!"}');
}

//Do deletion:
$sql = "DELETE FROM History WHERE id IN ($ids)";
$result = mysqli_query ( $link, $sql ) or die ('{success: false, message: "error in mysql request n°2 in delete history items: '. mysql_error () .'"}' );

echo "{success: true}";

?>