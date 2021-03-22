<?php 
// 
	require_once 'database/connection.php';
	
	$sql="SELECT DISTINCT StatusType.idStatusType AS idStatusType, StatusType.class AS name, StatusType.description AS description FROM  StatusType";
	
    $num_result=mysqli_query($link,$sql);
    $totaldata = mysqli_num_rows($num_result);
    
    $result=mysqli_query ($link,$sql) or die (mysqli_error ($link));
    
    $data = array();
	while ($row=mysqli_fetch_object($result))
	{
    	$data [] = $row;
	}
	//echo '({"total":"'.$totaldata.'","results":'.json_encode($data).'})';
 echo json_encode($data);
?>
