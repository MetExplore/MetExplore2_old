<?php 
// 
	require_once 'database/connection.php';
	$P_idBioSource=$_GET['idBioSource'];
	$sql="SELECT DISTINCT DatabaseRef.id AS idDB, DatabaseRef.url AS url FROM DatabaseRef, BioSource WHERE DatabaseRef.id=BioSource.idDB AND BioSource.id = $P_idBioSource";
	
    $result=mysqli_query ($link,$sql) or die (mysqli_error ($link));
    
    $data = array();
	while ($row=mysqli_fetch_object($result))
	{
    	$data [] = $row;
	}
	//echo '({"total":"'.$totaldata.'","results":'.json_encode($data).'})';
 echo json_encode($data);
?>
