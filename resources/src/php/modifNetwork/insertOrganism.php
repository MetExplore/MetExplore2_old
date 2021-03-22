<?php 
/* insert d'un nouveau nom d'Organism
 * revoi son id
 */	
	require_once '../database/connection.php';
	
	$P_nameOrganism=$_POST['nameOrganism'];

	$P_nameOrganism=mysqli_real_escape_string ( $link , $P_nameOrganism );


	$sql="INSERT INTO Organism (name) VALUES ('$P_nameOrganism')";
    $num_result=mysqli_query($link, $sql);
    $data= array();
    $data["id"]= "".mysqli_insert_id($link)."";
    $data["name"]= $_POST['nameOrganism'];
    
	echo '{success:true, data:'.json_encode($data).'}';
 
?>
