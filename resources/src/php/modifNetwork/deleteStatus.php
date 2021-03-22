<?php 
// 
	require_once '../database/connection.php';
	$idStatus= mysqli_real_escape_string ( $link , $_POST['idStatus']);
	$idReaction= mysqli_real_escape_string ( $link , $_POST['idReaction']);
	
   	$sql= "DELETE FROM ReactionHasStatus WHERE ReactionHasStatus.idReaction='$idReaction' AND ReactionHasStatus.idStatus='$idStatus'";
    $num_result=mysqli_query($link, $sql) or die('{success: false, message:"Error in SQL qtatement: Impossible to delete reaction\'s status."}');
    
?>
