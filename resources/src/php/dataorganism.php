<?php 
// 
require_once 'database/connection.php';
$sql="SELECT DISTINCT id, name FROM Organism ORDER BY name";
	
//$num_result=mysql_query($sql, $con);
//$totaldata = mysql_num_rows($num_result);
$result=mysqli_query ($link, $sql);    

if (! $result) {
	$response ["message"] = "Impossible to get the list of the biosources!";
	$response["success"] = false;
}
else {
	$data = array();
	
	while ($row=mysqli_fetch_object($result))
	{
		
		$data [] = $row;
	}
	
}  

echo json_encode($data);
?>