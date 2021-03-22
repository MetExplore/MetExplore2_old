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


$BSName=mysqli_real_escape_string ( $link , $BSName );
$IdinDBref=mysqli_real_escape_string ( $link , $IdinDBref );
$BSStrain=mysqli_real_escape_string ( $link , $BSStrain );
$BSTissue=mysqli_real_escape_string ( $link , $BSTissue );
$BSCellType=mysqli_real_escape_string ( $link , $BSCellType );
$idBiosource=mysqli_real_escape_string ( $link , $idBiosource );

$sql="UPDATE `BioSource` SET `nameBioSource`='$BSName',`idInDB`='$IdinDBref',`strain`='$BSStrain',`tissue`='$BSTissue',`cellType`='$BSCellType' WHERE `BioSource`.`id`='$idBiosource';";

$num_result=mysqli_query( $link, $sql) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

AddSQLtoBioSourceLog($idBiosource,$sql,$currentUser);

$DBRefURL=mysqli_real_escape_string ( $link , $DBRefURL );
$DBRefVersion=mysqli_real_escape_string ( $link , $DBRefVersion );
$DBRefSource=mysqli_real_escape_string ( $link , $DBRefSource );
$idDBRef=mysqli_real_escape_string ( $link , $idDBRef );

$sql="UPDATE `DatabaseRef` SET `url`='$DBRefURL',`version`='$DBRefVersion',`source`='$DBRefSource' WHERE `DatabaseRef`.`id`='$idDBRef';";

$num_result=mysqli_query( $link, $sql) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

AddSQLtoBioSourceLog($idBiosource,$sql,$currentUser);

?>
