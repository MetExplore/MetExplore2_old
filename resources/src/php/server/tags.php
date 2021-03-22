<?php
require_once("../config/server_variables.php");

$response["success"] = false;

// $cmd="svn log -v https://svn.code.sf.net/p/metexplore/code/tags|awk '/^   A/ { print $2 }'|grep -v '/.*/.*/'";

// // error_log($cmd);
// $output=array();
// $do = exec($cmd, $output);

// $output=preg_grep ( "/\/tags\/(.+)$/" , $output);

// $tmpres=array();
// foreach ($output as $directory){
	// $version=preg_replace( "/\/tags\/(.+)$/" , "$1",$directory);
	// if(! in_array($version,$tmpres)){ 
		// array_push($tmpres, $version);
	// }
// }

 $results=array();
// foreach ($tmpres as $version){
	// $res=array();
	// $res["tagversion"]=$version;
	// array_push($results, $res);
// }
	$res=array();
	$res["tagversion"]='2.7.3';
	array_push($results, $res);

$response["success"] = true;
$response["results"] = $results;

echo json_encode($response);

?>
