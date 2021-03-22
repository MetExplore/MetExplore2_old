<?php

/**
 * Get details of votes: get names of voters with their vote
 */

require_once '../database/connection.php';
require_once '../user/userFunctions.php';

$object = $_GET['idObject'];
$type = $_GET['typeObject'];
$typeSQL = ucfirst ($type);

$sql = "SELECT DISTINCT Status.status AS vote, UserMet.name AS name"
		." FROM VoteIn$typeSQL, Status, UserMet"
		." WHERE id$typeSQL = $object AND VoteIn$typeSQL.idVote = Status.idStatus"
		." AND VoteIn$typeSQL.idUser = UserMet.id";

$result = mysqli_query($link, $sql) or die('{success: false, message: "Error while retireving votes details. Please contact an adminstrator."}');

$data = array();

while ($row = mysqli_fetch_object($result)) {
	$item = array("vote" => intval($row->vote),
				  "name" => html_entity_decode ( $row->name ));
	array_push($data, $item);
}

$response["success"] = true;
$response["results"] = $data;
echo json_encode($response);

?>