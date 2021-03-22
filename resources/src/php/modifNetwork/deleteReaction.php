<?php 
// 
	require_once '../database/connection.php';
	require_once '../userAndProject/addHistoryItem.php';
	require_once '../user/userFunctions.php';

	$P_idBioSource=$_POST['idBioSource'];

	$currentUser=getIdUser();

	if(getBioSourceRights($currentUser, $P_idBioSource, $link) == "denied"){
		echo '{"success":false}';
		return;
	}

	$Reactions= json_decode($_POST['Reactions']);
	
	foreach($Reactions as $element)
	{
    	$id= mysqli_real_escape_string ( $link , $element[0] );
    	$sql = "SELECT idBioSource, name, ec FROM Reaction, ReactionInBioSource WHERE Reaction.id = ReactionInBioSource.idReaction AND Reaction.id = '$id';";
    	$result = mysqli_query ( $link, $sql ) or die('{success: false, message: "Before history: Error in SQL request n°1 in getting idBioSource"}');


    	if ($row = mysqli_fetch_object($result)) {

    		$idbiosource = $row->idBioSource;
    		$name = $row->name;
    		$ec = $row->ec;
	    	$sql= "DELETE FROM Reaction WHERE Reaction.id='$id';";
	    	$result=mysqli_query($link,$sql) or die('{success: false, message: "Error in SQL request n°2: Impossible to delete selected reaction"}');

	    	if ($result) {
		    	$action = array(
		    		"action" => "delete reaction",
		    		"dbIdentifier" => $element[2],
		    		"id" => $id,
		    		"name" => $name,
		    		"EC" => $ec
		    	);
		    	
	    		addHistoryItem($idbiosource, $currentUser, $action, $link);
	    	}
    	}
	}
?>
