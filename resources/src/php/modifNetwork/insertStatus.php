<?php 
// 
	require_once '../database/connection.php';
	$P_idStatus=$_POST['idStatus'];
	$P_idStatusType=$_POST['idStatusType'];
	$Reactions= json_decode($_POST['Reactions']);

	foreach($Reactions as $element)
	{
		$P_idReaction= $element[0] ;

        $P_idReaction=mysqli_real_escape_string ( $link , $P_idReaction );
        $P_idStatusType=mysqli_real_escape_string ( $link , $P_idStatusType );

    	$sql="SELECT ReactionHasStatus.idReaction, ReactionHasStatus.idStatus FROM ReactionHasStatus, Status WHERE ReactionHasStatus.idStatus= Status.idStatus AND ReactionHasStatus.idReaction=$P_idReaction AND Status.idStatusType=$P_idStatusType";
    	
    	$result=mysqli_query($sql);
	    $totaldata = mysqli_num_rows($result);
	       	
    	if ($totaldata==0) {
            $P_idStatus=mysqli_real_escape_string ( $link , $P_idStatus );
    		
    		$sql="INSERT INTO ReactionHasStatus (idReaction,idStatus) VALUES ($P_idReaction,$P_idStatus)";
    		$result=mysqli_query($link,$sql);
    	}
    	else {
    		$row=mysqli_fetch_object($result);

            
    		$sql="UPDATE ReactionHasStatus SET idStatus=$P_idStatus WHERE idReaction=$P_idReaction AND idStatus=$row->idStatus";
    		$result=mysqli_query($link,$sql);
    	}
	}
    
?>
