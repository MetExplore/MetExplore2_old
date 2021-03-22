<?php 
// 
$P_idBioSource=$_POST['idBioSource'];
$sql=$_POST['req'];
$P_Listid=$_POST['id'];

require_once 'database/connection.php';
require_once 'database/requete_sel.php';

$result=mysqli_query ($link,$$sql);    
$data = "";

while ($row=mysqli_fetch_object($result))
{
	$data  = $row->ListidMetabolite;
}
echo json_encode($data);
?>