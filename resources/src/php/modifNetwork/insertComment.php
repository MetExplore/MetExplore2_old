<?php 
// 
	require_once '../database/connection.php';
	$P_text=$_POST['comment'];
	$P_idUser=$_POST['idUser'];
	$Reactions= json_decode($_POST['Reactions']);


	$P_idUser=mysqli_real_escape_string ( $link , $P_idUser );
	$P_text=mysqli_real_escape_string ( $link , $P_text );


	$sql="INSERT INTO Comment (idUser, text) VALUES ('$P_idUser','$P_text')";
    $num_result=mysqli_query($link, $sql) or die('{success: false, message:"Error in SQL qtatement: impossible to add Comment"}');
    $id= mysqli_insert_id($link);
	
	//echo ($P_text);
	foreach($Reactions as $element)
	{
    	$P_idReaction= $element[0] ; 

    	$P_idReaction=mysqli_real_escape_string ( $link , $P_idReaction );
	    $sql="INSERT INTO ReactionHasComment (idReaction,idComment) VALUES ('$P_idReaction','$id')";
    	$num_result=mysqli_query($link, $sql) or die('{success: false, message:"Error in SQL qtatement: impossible to link Comment to Reaction"}');
    	
	}
?>
