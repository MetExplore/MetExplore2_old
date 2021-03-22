<?php
$name = isset($_POST["loginUsername"]) ? $_POST["loginUsername"] : "";
$pwd = isset($_POST["loginPassword"]) ? $_POST["loginPassword"] : "";

	$result["success"]= true;
	$result["idUser"]=119;

echo json_encode($result);
?>