<?php

require_once("../config/server_variables.php");

$response["success"] = false;

$cmd="".SHELLSCRIPT_DIR."/checkDiskSpace.sh";

$output;

$res = exec($cmd, $output);

$results = array();

$used=$output[0];
$unused=100-$used;

$res1 = array();
$res1["name"] = "Used Space";
	$res1["value"] = $used;
array_push($results, $res1);

$res2 = array();
$res2["name"] = "Free Space";
	$res2["value"] = $unused;
array_push($results, $res2);


$response["success"] = true;

$response["results"] = $results;
print (json_encode($response));
?>
