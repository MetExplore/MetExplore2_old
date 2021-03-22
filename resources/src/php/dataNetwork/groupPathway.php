<?php 
/*
 * renvoi la liste idPathway pour filtrer affichage des grids
 * liste des id = chaine de caractere obtenu avec group_concat
 * cas ListidMetabolite
 * il faut faire les 2 requetes _ListidMetabRight et _ListidMetabLeft et faire une concatenation
 */ 
$P_idBioSource=$_POST['idBioSource'];
$sql=$_POST['req'];
$P_Listid=$_POST['id'];
$P_id=0;

require_once '../database/connection.php';
require_once '../database/requete_GroupConcat.php';

require_once '../user/userFunctions.php';

$currentUser=getIdUser();

if(getBioSourceRights($currentUser, $P_idBioSource, $link) == "denied"){
	echo '{"success":false}';
	return;
}

$query = 'SET GLOBAL group_concat_max_len=20000';
mysqli_query($link, $query);

$dataL="";
$pos= strpos($sql,"ListidMetabolite");

if ($pos>0) {

	$sqlL= str_replace("ListidMetabolite","ListidMetabLeft",$sql);
	// require '../database/requete_GroupConcat.php';
	$result= mysqli_query ($link, $$sqlL );
	
	if ($result) {    	
		$dataL = "";
		while ($row=mysqli_fetch_object($result))
		{	
   			$dataL  = $row->StringId;
		}		
	}
	
	$sql= str_replace("ListidMetabolite","ListidMetabRight",$sql);
	//error_log($sql);
}
// require '../database/requete_GroupConcat.php';
$result= mysqli_query ($link, $$sql );

$data = "";
if ($result) {
	while ($row=mysqli_fetch_object($result))
	{
   		$data  = $row->StringId;
	}	
}

if ($dataL != "") {
    if ($data != "") $data= $data.",".$dataL;
    else $data= $dataL;
}
echo json_encode($data);
?>