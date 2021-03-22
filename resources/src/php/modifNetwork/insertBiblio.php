<?php 
// 
	require_once '../database/connection.php';
		
	$PMID=$_POST["pubmedid"];
	$title=$_POST["title"];
	$authors=$_POST["authors"];
	$Journal=$_POST["Journal"];
	$Year=$_POST["Year"];

	$shortRef="";

	$authorsList=explode (',', $authors);
	if (count($authorsList)>1){
		$shortRef=$authorsList[0]." et al., ".$Year;
	}else{
		$shortRef=$authorsList[0].", ".$Year;
	}

	$PMID=mysqli_real_escape_string ( $link , $PMID );
	$title=mysqli_real_escape_string ( $link , $title );
	$authors=mysqli_real_escape_string ( $link , $authors );
	$Journal=mysqli_real_escape_string ( $link , $Journal );
	$Year=mysqli_real_escape_string ( $link , $Year );
	$shortRef=mysqli_real_escape_string ( $link , $shortRef );

	
	$Reactions= json_decode($_POST['Reactions']);
	
	$sql="INSERT INTO Biblio (pubmedid,title,authors,Journal,Year,ShortRef) VALUES ('$PMID', '$title', '$authors','$Journal', '$Year','$shortRef');";
	$num_result=mysqli_query($link,$sql);
    $id= mysqli_insert_id($link);

    foreach($Reactions as $element)
	{
    	$P_idReaction= mysqli_real_escape_string ( $link , $element[0] ); 
		$id=mysqli_real_escape_string ( $link , $id );

    	$sql="INSERT INTO ReactionHasReference (idReaction,idBiblio) VALUES ($P_idReaction,$id)";
    	$num_result=mysqli_query($link, $sql);
	}
    //echo($sql);
    
?>
