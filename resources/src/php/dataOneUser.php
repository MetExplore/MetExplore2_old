<?php
/**
 * Gets the information for only one User
 */
require_once 'database/connection.php';

$idUser = $_GET ['idUser'];

if (isset ( $idUser )) {
	
	
	$sql = "SELECT DISTINCT UserMet.id AS id , UserMet.name AS name, UserMet.username AS username FROM UserMet WHERE UserMet.id=$idUser ";
	
// 	error_log ( $sql );
	
	$result=mysqli_query ($link,$sql) or die (mysqli_error ($link));
    
	$data = array();
	while ($row=mysqli_fetch_object($result))
	{
   		$data [] = $row;
	}
}
echo json_encode($data);	// $num_result=mysql_query($sql, $con);
?>
