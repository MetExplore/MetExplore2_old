<?php
require_once("../database/connection.php");
require_once("../LogBioSourceUpdate.php");

$functionParam= json_decode($_POST['functionParam'], $assoc=true);

extract ( $functionParam, EXTR_OVERWRITE );

require_once '../user/userFunctions.php';

$currentUser=getIdUser();

if(getBioSourceRights($currentUser, $idBiosource, $link) == "denied"){
	echo '{"success":false}';
	return;
}

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

$sql="INSERT INTO Biblio (pubmedid,title,authors,Journal,Year,ShortRef) VALUES ('$PMID', '$title', '$authors','$Journal', '$Year','$shortRef');";

$num_result=mysqli_query($link, $sql) or die('{success: false, message: "Error in Mysql Query"}');
$id= mysqli_insert_id($link);

AddSQLtoBioSourceLog($idBiosource,$sql,$iduser);

$idBiosource=mysqli_real_escape_string ( $link , $idBiosource );
$id=mysqli_real_escape_string ( $link , $id );

$sql="INSERT INTO BioSourceHasReference (idBioSource,idBiblio) VALUES ('$idBiosource', '$id');";
$num_result=mysqli_query($link, $sql) or die('{success: false, message: "Error in Mysql Query"}');

AddSQLtoBioSourceLog($idBiosource,$sql,$iduser);


?>
