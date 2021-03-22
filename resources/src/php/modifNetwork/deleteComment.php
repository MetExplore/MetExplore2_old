<?php 
// 
	require_once '../database/connection.php';
	$idComment= mysqli_real_escape_string ( $link ,$_POST['idComment'] );
	$idReaction= mysqli_real_escape_string ( $link ,$_POST['idReaction'] );
	
   	$sql= "DELETE FROM ReactionHasComment WHERE ReactionHasComment.idReaction='$idReaction' AND ReactionHasComment.idComment='$idComment';";
    $num_result=mysqli_query($link,$sql) or die('{success: false, message: "Error in Mysql Query"}');
   	$sql= "DELETE FROM Comment WHERE Comment.idComment='$idComment';";
    $num_result=mysqli_query($link,$sql) or die('{success: false, message: "Error in Mysql Query"}');
    
?>
