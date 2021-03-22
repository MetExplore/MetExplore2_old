<?php
require_once("../config/server_variables.php");

$response["success"] = false;

$cmd="svn ls https://svn.code.sf.net/p/metexplore/code/branches";

// // error_log($cmd);
$output=array();
$do = exec($cmd, $output);
$results=array();
foreach ($output as $directory){
	$version= substr($directory, 0, -1);
	if (is_numeric($version)) {
		$res= array();
	 	$res["branchversion"]=$version;
		array_push($results, $res);
	}
}

$response["success"] = true;
$response["results"] = $results;

echo json_encode($response);

?>
