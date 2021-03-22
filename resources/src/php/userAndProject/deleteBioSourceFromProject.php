<?php

require_once '../database/connection.php';
require_once '../user/userFunctions.php';


$P_idUser = getIdUser();
$P_idBioSources = json_decode($_POST['idBioSources'], true);


$escapedIDBS=array();
//Check rights:
foreach ($P_idBioSources as $P_idBioSource) {
	$rights = getBioSourceRights($P_idUser, $P_idBioSource, $link);
	if ($rights != "p") {
		die('{success: false, message: "Error! You are not the owner of this BioSource!"}');
	}
	$idBiosource=mysqli_real_escape_string ( $link , $P_idBioSource );
	array_push($escapedIDBS, $idBiosource);
}
//Note: as rights are synchronised between biosources and project, we don't need to check also access to project

//Delete:
$sql = "DELETE FROM BioSourceInProject WHERE idBioSource IN (" . implode(", ", $escapedIDBS) . ")";
$result = mysqli_query ( $link, $sql ) or die ('{success: false, message: "error in mysql request n°1 in delete BioSource from project: '. mysql_error () .'"}' );

echo "{success: true}";

?>