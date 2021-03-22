<?php 
// 
	require_once '../database/connection.php';
	$P_name=$_POST['statustype'];
	$P_description=$_POST['description'];

	$P_name=mysqli_real_escape_string ( $link , $P_name );
	$P_description=mysqli_real_escape_string ( $link , $P_description );

	$sql="INSERT INTO StatusType (name, description) VALUES ('$P_name','$P_description')";
    $num_result=mysqli_query($link, $sql);
?>
