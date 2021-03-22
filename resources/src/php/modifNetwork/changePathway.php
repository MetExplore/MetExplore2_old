<?php 
// 
	require_once '../database/connection.php';
	$Pathways= json_decode($_POST['Pathways']);
	
	//Change only confidence as for now it is the only requirement:
	$id= mysqli_real_escape_string ( $link , $Pathways[0][0]);
	$value= mysqli_real_escape_string ( $link , $Pathways[0][6]);

    $sql="UPDATE Pathway SET confidence = '$value' WHERE Pathway.id='$id';";
    $num_result=mysqli_query($link, $sql) or die("Error in database command!");
    
    $response["success"] = true;
    echo json_encode($response);
?>