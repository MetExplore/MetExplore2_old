<?php

/**
 * Accept an invitation to a project
 */

require_once '../database/connection.php';
require_once '../user/userFunctions.php';

$P_idUser = getIdUser();
$P_idProject = mysqli_real_escape_string ( $link , $_POST['idProject']);

$sql = "UPDATE UserInProject SET active=1 WHERE idProject='$P_idProject' AND idUser='$P_idUser';";

$result = mysqli_query ( $link, $sql ) or die ( '{success: false, message: "acceptInvitationProject: Error in SQL request n°1"}' );

echo "{success: true}";

?>