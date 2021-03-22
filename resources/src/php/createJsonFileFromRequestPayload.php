<?php 

require_once("config/server_variables.php");


$response["success"] = false;

extract($_POST,  EXTR_OVERWRITE);
extract($_GET,  EXTR_OVERWRITE);

if(! isset($path)) {
	$response["message"] = "Lacks the path argument";
	die(json_encode($response));
}

$path = TMP_DIR."/".$path;

$request_body = file_get_contents('php://input');
$fw = fopen($path, 'w') or die(json_encode($response));

fwrite($fw, $request_body);

fclose($fw);





?>