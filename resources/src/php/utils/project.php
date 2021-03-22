<?php

/**
 * Get there is new projects (invitations) that have not been notified
 * @param unknown $idUser
 * @param unknown $link : mysql link
 * @return boolean
 */
function getIsNewProjectsForUser($idUser, $link) {

	$idUser=mysqli_real_escape_string ( $link , $idUser );
	
	$sql = "SELECT idProject FROM UserInProject WHERE idUser=$idUser AND active=0 AND notified=0";
	$result=mysqli_query ($link, $sql);
	if (!$result) {
		return false;
	}
	if (mysqli_num_rows($result) > 0) {
		$idProjects = array();
		while ($row=mysqli_fetch_object($result))
		{
			array_push($idProjects, mysqli_real_escape_string ($link , $row->idProject) );
		}
		$sql = "UPDATE UserInProject SET notified=1 WHERE idUser=$idUser AND idProject IN (". implode(", ", $idProjects) .") AND active=0 AND notified=0";
		$result=mysqli_query ($link, $sql);
		return true;
	}
	else {
		return false;
	}
	
}

?>