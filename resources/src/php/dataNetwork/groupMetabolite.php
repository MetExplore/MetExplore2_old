<?php 
// 
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
//mysqli_query($link, $query);

$data = "";
$sqlL= str_replace("R_Metabolite","R_MetabLeft",$sql);

$result=mysqli_query ($link, $$sqlL) or die (mysqli_error ($link));    
$dataL = "";
while ($row=mysqli_fetch_object( $result))
{	
   	$dataL  = $row->StringId;
}

$sqlR= str_replace("R_Metabolite","R_MetabRight",$sql);
$result=mysqli_query ($link, $$sqlR) or die (mysqli_error ($link));    
$dataR = "";

while ($row=mysqli_fetch_object( $result))
{	
   	$dataR  = $row->StringId;
}

$data = $dataL.",".$dataR;
if ($dataL == "") $data= $dataR;
if ($dataR == "") $data= $dataL;

echo json_encode($data);
?>