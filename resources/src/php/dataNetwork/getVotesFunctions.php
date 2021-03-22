<?php

function getVotesForObject($obj, $typeObj, $link) {
	require_once '../user/userFunctions.php';
	$idUser = getIdUser();
	$res = array();
	$sql = "SELECT Status.status AS vote, COUNT(*) AS nbVotes" //status is 0, 1 or 2
		." FROM VoteIn$typeObj, Status"
		." WHERE id$typeObj = $obj AND VoteIn$typeObj.idVote = Status.idStatus"
		." GROUP BY Status.idStatus";
	$result = mysqli_query($link, $sql) or die('{success: false, message: "Error while retireving votes. Please contact an administrator."}');
	
	$votes = array(0,0,0);
	while ($row = mysqli_fetch_object($result)) {
		$idVote = intval($row->vote);
		$votes[$idVote] = intval($row->nbVotes);
	}
	$res["votes"] = $votes;
	$sql = "SELECT * FROM VoteIn$typeObj WHERE id$typeObj = $obj AND idUser = $idUser";
	$result = mysqli_query($link, $sql) or die('{success: false, message: "Error while retireving votes in second request. Please contact an administrator."}');
	if (mysqli_num_rows($result) > 0) {
		$res["hasVote"] = true;
	}
	else {
		$res["hasVote"] = false;
	}
	
	return $res;
}

?>