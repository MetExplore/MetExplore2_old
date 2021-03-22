<?php 
// 
	require_once 'database/connection.php';
	$P_idReaction=$_GET['idReaction'];
	$sql="SELECT DISTINCT ReactionHasReference.idReaction AS idReaction, Biblio.idBiblio AS idBiblio, Biblio.pubmedid AS pubmedid, Biblio.title AS title, Biblio.authors, Biblio.Journal AS Journal, Biblio.Year AS Year FROM Biblio, ReactionHasReference WHERE  ReactionHasReference.idBiblio = Biblio.idBiblio AND  ReactionHasReference.idReaction = $P_idReaction";
	
    //$num_result=mysql_query($sql, $con);
    //$totaldata = mysql_num_rows($num_result);
    
    $result=mysql_query ($sql) or die (mysql_error ());
    
    $data = array();
	while ($row=mysql_fetch_object($result))
	{
    	$data [] = $row;
	}
	//echo '({"total":"'.$totaldata.'","results":'.json_encode($data).'})';
 echo json_encode($data);
?>