<?php 
// 
require_once 'database/connection.php';
$P_idUser=$_GET['idUser'];
$sql="SELECT DISTINCT UserMenu.idMenu AS idMenu,  UserMenu.visible AS visible FROM UserMenu WHERE UserMenu.idUser= $P_idUser OR UserMenu.idUser=0 ORDER BY UserMenu.idUser";
  
$result=mysqli_query ($link, $sql) or die (mysqli_error ($link));
    
$data = array();
while ($row=mysqli_fetch_object($result))
{
   	$data [] = $row;
}

echo json_encode($data);
?>
