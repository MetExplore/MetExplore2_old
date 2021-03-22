<?php 
// Creates a temporary file and returns a json string containing its path

require_once("config/server_variables.php");

extract($_POST,  EXTR_OVERWRITE);

if(! isset($rep)) {
	$rep = TMP_DIR;
}

if(! isset($ext)) {
	$ext = ".txt";
}

if(! isset($pre)) {
	$pre = "file";
}


if($ext != "" && substr($ext, 0, 1) != ".") {
	$ext = ".$ext";
}

$filename = $rep."/".$pre."_".rand()."$ext";

while(file_exists($filename)) {
	if($rep!="") {
		$filename = $rep."/".$pre."_".rand()."$ext";
	}
	else {
		$filename = $pre."_".rand()."$ext";
	}
}

$response["success"] = false;


$ourFileHandle = fopen($filename, 'w') or die(json_encode($response));

$response["path"] = basename($filename);

fclose($ourFileHandle);

$response["success"] = true;


print (json_encode($response));




?>