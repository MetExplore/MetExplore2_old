<?php

require_once("../database/connection.php");
require_once("../LogBioSourceUpdate.php");

$functionParam= json_decode($_POST['functionParam'], $assoc=true);

extract ( $functionParam, EXTR_OVERWRITE );

require_once '../user/userFunctions.php';

$currentUser=getIdUser();

if($currentUser == - 1){
	echo '{"success":false}';
	return;
}

$id=mysqli_real_escape_string ( $link , $id );
$BurlSName=mysqli_real_escape_string ( $link , $url );
$version=mysqli_real_escape_string ( $link , $version );
$iduser=mysqli_real_escape_string ( $link , $iduser );
$source=mysqli_real_escape_string ( $link , $source );


$sqlDBRef="INSERT INTO DatabaseRef (name, url, version, iduser, type, source) VALUES ('$id', '$url', '$version', '$iduser', 'user', '$source');";


$num_result=mysqli_query($link, $sqlDBRef) or die('{success: false, message: "Error in Mysql Query"}');
$idDB= mysqli_insert_id($link);


$name=mysqli_real_escape_string ( $link , $name );
$idOrg=mysqli_real_escape_string ( $link , $idOrg );
$strain=mysqli_real_escape_string ( $link , $strain );
$tissue=mysqli_real_escape_string ( $link , $tissue );
$cellType=mysqli_real_escape_string ( $link , $cellType );
$comment=mysqli_real_escape_string ( $link , $comment );

$sqlBioSource="INSERT INTO BioSource (nameBioSource, idOrg, idDB, idInDB, strain, tissue, cellType, comments) VALUES ('$name', '$idOrg', '$idDB', '$id', '$strain', '$tissue', '$cellType', '$comment');";



$num_result=mysqli_query($link, $sqlBioSource) or die('{success: false, message: "Error in Mysql Query"}');
$idBioSource= mysqli_insert_id($link);

$action = array(
		'action' => "add biosource",
		'data' => $functionParam
);
AddSQLtoBioSourceLog($idBioSource,$sqlBioSource,$iduser, $action, $link);

$sqlUnitDef="INSERT INTO UnitDefinitionInBioSource (idBioSource, idUnitDefinition) VALUES ('$idBioSource', '6');";

// TODO : check the result
$num_result=mysqli_query($link, $sqlUnitDef) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

AddSQLtoBioSourceLog($idBioSource,$sqlUnitDef,$iduser, null);

$sqlPrivatise="INSERT INTO  UserBioSource (idUser, idBioSource, Acces) VALUES ('$iduser', '$idBioSource', (SELECT idStatus FROM Status WHERE status='p'));";

// TODO : check the result
$num_result=mysqli_query($link, $sqlPrivatise) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');



$action = array('action' => "add user to biosource", 'iduser' => $iduser);
AddSQLtoBioSourceLog($idBioSource,$sqlPrivatise,$iduser, null); //log has already been added below in History BDD Table


/////////////////////////////////////////////
// ADD BioSource Biblio (if defined)
/////////////////////////////////////////////
$BiblioIds=array();

foreach ($Biblio as $ref){

	$PMID=$ref["pubmedid"];
	$title=$ref["title"];
	$authors=$ref["authors"];
	$Journal=$ref["Journal"];
	$Year=$ref["Year"];
	
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
	
	$sqlReactionBiblio="INSERT INTO Biblio (pubmedid,title,authors,Journal,Year,ShortRef) VALUES ('$PMID', '$title', '$authors', '$Journal', '$Year','$shortRef')";
	
	$num_result=mysqli_query($link, $sqlReactionBiblio) or die('{success: false, message: "Error in Mysql Query": '.mysqli_error ($link).'}');
	array_push($BiblioIds,mysqli_insert_id($link));
	
	$action = array('action' => "add biblio", 'title' => $title, 'authors' => $authors, 'year' => $Year);
	AddSQLtoBioSourceLog($idBioSource,$sqlReactionBiblio,$iduser, $action, $link);
	
	
}

if (sizeof($BiblioIds) > 0) {
	
	$sqlReactionHasRef="INSERT INTO BioSourceHasReference (idBioSource,idBiblio) VALUES";

	foreach ($BiblioIds as $id){
		$sqlReactionHasRef.=" ('$idBioSource','$id'),";
	}
	$sqlReactionHasRef=substr($sqlReactionHasRef,0, strlen($sqlReactionHasRef)-1);
	
		
	$num_result=mysqli_query($link, $sqlReactionHasRef) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

	AddSQLtoBioSourceLog($idBioSource,$sqlReactionHasRef,$iduser, null, $link); //add anything to Hystory BDD Table
}



if($idBioSource && $idBioSource!=0){
	print "{\"success\":\"true\",\"idBioSource\":\"$idBioSource\"}";
}else{
	print "{\"success\":\"false\"}";
}
?>
