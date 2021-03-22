<?php 
// 


require_once '../database/connection.php';

$sql= "SELECT * FROM UserData WHERE UserData.id=2";
//error_log($sql);
$result=mysqli_query ($link, $sql);

if (! $result) {
	$response ["message"] = "Impossible to get the mapping";
	$response["success"] = false;
}
else {
	$data = array();
	 while ($row=mysqli_fetch_object($result))
	{
		$data [] = $row;
		//error_log($row);
	}
	$response["success"] = true;
	$response["results"] = $data[0];
	
}
echo json_encode($response);
?>