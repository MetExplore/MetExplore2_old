<?php
/**
 * Get information about rights on current BioSource for one user.
 */

require_once '../database/connection.php';
	
$P_BioSource=mysqli_real_escape_string ( $link , $_GET["idBioSource"]);
$P_User=mysqli_real_escape_string ( $link , $_GET["idUser"]);

$sql = "SELECT Status.status AS type"
		." FROM UserBioSource, Status"
		." WHERE UserBioSource.idUser = $P_User"
		." AND UserBioSource.idBioSource = $P_BioSource"
		." AND UserBioSource.Acces = Status.idStatus";

$result = mysqli_query ( $link, $sql ) or die ( mysql_error () );

if (! $result) {
	$response["hasRights"] = false;
} else {
	$row = mysqli_fetch_object ( $result );
	if ($row)
	{
		if ($row->type == "p" || $row->type == "rw")
		{
			$response["hasRights"] = true;
		}
		else
		{
			$response["hasRights"] = false;
		}
	}
	else
		$response["hasRights"] = false;
}

$response["success"] = true;

echo json_encode($response);
?>