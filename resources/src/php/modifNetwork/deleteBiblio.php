<?php 
require_once("../database/connection.php");

$functionParam= json_decode($_POST['functionParam'], $assoc=true);

extract ( $functionParam, EXTR_OVERWRITE );

require_once '../user/userFunctions.php';

$currentUser=getIdUser();

if(getBioSourceRights($currentUser, $idbiosource, $link) == "denied"){
	echo '{"success":false}';
	return;
}

$PMID= mysqli_real_escape_string ( $link , $PMID );
$idbiosource= mysqli_real_escape_string ( $link , $idbiosource );

$sql= "DELETE FROM Biblio WHERE Biblio.pubmedId='$PMID' AND Biblio.idBiblio IN (SELECT idBiblio FROM BioSourceHasReference WHERE idBioSource='$idbiosource');";
$num_result=mysqli_query($link,$sql) or die('{success: false, message: "Error in Mysql Query"}');
    
?>
