<?php

/**
 * Get there is new projects (invitations) that have not been notified
 */

require_once ('../database/connection.php');
require_once ('../utils/project.php');
require_once ('../user/userFunctions.php');

$idUser = getIdUser();

//Is there any new project (invitation)? :
$data = array();
$data["newProjects"] = getIsNewProjectsForUser($idUser, $link);
$data["success"] = true;

echo json_encode($data);

?>
