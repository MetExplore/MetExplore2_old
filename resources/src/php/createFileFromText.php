<?php 
// Creates a temporary file and fills it with the text parameter

require_once("config/server_variables.php");

$response["success"] = false;

extract($_POST,  EXTR_OVERWRITE);


if(! isset($text)) {
	$response["message"] = "Lacks the text argument";
	die(json_encode($response));
}

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

$ourFileHandle = fopen($filename, 'w') or die(json_encode($response));

fwrite($ourFileHandle, $text);

$response["path"] = $filename;

fclose($ourFileHandle);

$response["success"] = true;


print (json_encode($response));



