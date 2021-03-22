<?php
//
require_once '../database/connection.php';
$P_idBioSource=$_GET['idBioSource'];
$P_idUser=$_GET['idUser'];
//$P_object=$_GET['object'];

$sql= "SELECT * FROM biosource_data WHERE idBioSource=$P_idBioSource ORDER BY date ASC ";
//error_log($sql);
$result=mysqli_query ($link, $sql);
$response= array();
$data= array();

if (! $result) {
	$response ["message"] = "Impossible to get the list of data";
	$response["success"] = false;
}
else {
	
	while ($row=mysqli_fetch_object($result))
	{
        $tabuser=  explode(",", $row->listidUser);
        if (in_array('all', $tabuser) OR in_array($P_idUser, $tabuser)) {
            $data [] = $row;
		}

	}
	$response["success"] = true;
	$response["results"] = $data;
	
}
echo json_encode($response);
	
?>
