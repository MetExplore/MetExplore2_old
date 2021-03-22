<?php

//require_once ("login.common.php");
require_once '../database/adminJoomla.php';

$name = isset($_POST["loginUsername"]) ? $_POST["loginUsername"] : "";
$pwd = isset($_POST["loginPassword"]) ? $_POST["loginPassword"] : "";

$idUser= crypt_joomla_psw($pwd,'',$name);
	

if ($idUser!='0') {
	$result["success"]= true;
	$result["idUser"]=$idUser;	
} else 	{
	$result["success"]= false;
	$result["idUser"]=$idUser;		
}
echo json_encode($result);
?>
