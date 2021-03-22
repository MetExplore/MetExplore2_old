<?php
//error_log("test");

$file= "/var/www/atomMapping/".$_POST["file"];
$response= array();

if (file_exists($file)) $response["results"]= true;
else $response["results"]= false;

$response["success"] = true;
//$response["results"] = $data;

echo json_encode($response);

?>