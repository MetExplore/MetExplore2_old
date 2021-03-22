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
mysqli_query($link, $query);

$data = "";

	$result= mysqli_query ($link, $$sql );
	
	if ($result) {    
	
		while ($row=mysqli_fetch_object($result))
		{	
   			$data  = $row->StringId;
		}
	}

echo json_encode($data);
?>