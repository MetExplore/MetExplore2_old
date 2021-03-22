<?php

/**
 * Get votes for given objects
 **/

require_once '../database/connection.php';
require_once 'getVotesFunctions.php';

$P_objects = json_decode($_POST["objects"]); //id of objects.
$P_typeObj = $_POST["typeObj"]; //type of object (reaction, pathway, ...).
$typeSQL = ucfirst ($P_typeObj); //Type SQL : same as type of object but with first letter capitalized (Reaction, Pathway, ...).

$data = array();
foreach ($P_objects as $obj) {
	$data[$obj] = getVotesForObject($obj, $typeSQL, $link);
}

$response["success"] = true;
$response["data"] = $data;

echo json_encode($response);

?>