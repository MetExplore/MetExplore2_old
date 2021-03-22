<?php 
// 
	require_once 'database/connection.php';
	$P_idReaction=$_GET['idReaction'];
	$sql="SELECT DISTINCT ReactionHasStatus.idReaction AS idReaction, Status.idStatus AS idStatus, Status.status AS status, Status.name AS nameStatus, Status.description AS descStatus, StatusType.name AS nameType, StatusType.description AS descType FROM Status, StatusType, ReactionHasStatus WHERE  ReactionHasStatus.idStatus = Status.idStatus AND Status.idStatusType= StatusType.idStatusType AND  ReactionHasStatus.idReaction = $P_idReaction";
	
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
