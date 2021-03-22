<?php 
 
require_once 'database/connection.php';
$P_idUser= $_GET['idUser'];
$node= $_GET['node'];

$data = array();

if ($node == 'root') {
	// a la racine on veut la liste des Users
	$sql="SELECT DISTINCT UserMet.id AS id,  UserMet.name AS name, UserMet.username AS username FROM UserMet";
	$result=mysqli_query ($link, $sql) or die (mysqli_error ($link));
	while ($row=mysqli_fetch_object($result))
	{
		//$data [] = $row;
		
		$data [] = array(
			'text'=> $row->name,
			'id'=>$row->id,
			'cls'=>'folder',
			'children'=>array()
		);
	}	
	
} else {
	// qd on est sur un user on veut sa liste des BioSources
/*	$sql="SELECT DISTINCT UserBioSource.idBioSource AS id, BioSource.nameBioSource AS name FROM UserBioSource, BioSource WHERE UserBioSource.idBioSource=BioSource.id AND UserBioSource.idUser= $P_idUser";
	$result=mysql_query ($sql) or die (mysql_error ());
	while ($row=mysql_fetch_object($result))
	{
		$row->"leaf"="false";
		
	}	
*/	
}
 
//echo '({"root":'.json_encode($data).'})';
echo  json_encode($data);
?>
