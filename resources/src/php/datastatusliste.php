<?php 
// 
	require_once 'database/connection.php';
	$P_idStatusType=$_GET['idStatusType'];
	$sql="SELECT DISTINCT Status.idStatus AS idStatus, Status.status AS status, Status.name AS name, Status.description AS description FROM Status WHERE  Status.idStatusType= $P_idStatusType";
	
//    $num_result=mysql_query($sql, $con);
//    $totaldata = mysql_num_rows($num_result);
    
    $result=mysqli_query ($link,$sql) or die (mysqli_error ($link));
    
    $data = array();
	while ($row=mysqli_fetch_object($result))
	{
    	$data [] = $row;
	}
	//echo '({"total":"'.$totaldata.'","results":'.json_encode($data).'})';
 echo json_encode($data);
?>
