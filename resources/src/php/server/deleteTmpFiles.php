<?php

require_once("../config/server_variables.php");

$time=$_GET['time'];

$response["success"] = false;

$ArrayOfCmd=array();

if (isset($time)){

	$cmd="find ".TMP_DIR."* -mtime +$time -exec rm {} \; ";
	array_push($ArrayOfCmd, $cmd);
	
	$cmd="find /var/www/metexplore2/tmp/* -mtime +$time -exec rm {} \; ";
	array_push($ArrayOfCmd, $cmd);
	
}else{

	$cmd="find ".TMP_DIR."* -exec rm {} \; ";
	array_push($ArrayOfCmd, $cmd);
	
	$cmd="find /var/www/metexplore2/tmp/* -exec rm {} \; ";
	array_push($ArrayOfCmd, $cmd);
	
}

$output;

foreach ($ArrayOfCmd as $cmd){
	$res = exec($cmd);
}
$response["success"] = true;

print (json_encode($response));
?>
