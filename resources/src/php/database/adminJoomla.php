<?php
function crypt_joomla_psw($psw_clair,$id_user=0,$username="")
{ 
// La class  JUserHelper est necessaire le fichier : libraries/joomla/user/helper.php
 
    require '../database/helper.php';
	require_once '../database/adminConnection.php';
//requete recherche password du username envoy�
	$req="SELECT id, name, password FROM UserAdmin WHERE UserAdmin.username=\"$username\" ";
	
// 	error_log($req);
	
    $res=mysqli_query($link, $req);
    $row=mysqli_fetch_array($res);
    
    if(!isset($row['password'])) return '0';
    
    $psw_joomla=$row['password'];
    
    list($psw,$salt)=explode(":", $psw_joomla);
    $psw_crypt=JUserHelper::getCryptedPassword($psw_clair, $salt).":".$salt;
    
    if($psw_crypt==$psw_joomla) return $row['id'];
    else return '0';
}
?>
