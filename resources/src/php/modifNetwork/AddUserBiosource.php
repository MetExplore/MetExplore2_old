<?php 
// 
require_once '../database/connection.php';
require_once("../LogBioSourceUpdate.php");

$functionParam= json_decode($_POST['functionParam'], $assoc=true);
extract ( $functionParam, EXTR_OVERWRITE );

require_once '../user/userFunctions.php';

$currentUser=getIdUser();

if(getBioSourceRights($currentUser, $idBiosource, $link) == "denied"){
	echo '{"success":false}';
	return;
}

$response["success"] = true;

		$email=mysqli_real_escape_string ( $link , $email );

$sql="SELECT `UserMet`.`id` AS userId FROM `UserMet` WHERE `UserMet`.`email`='$email'";

$result=mysqli_query ($link, $sql) or die('{success: false, message: "Error in Mysql Query"}');


if((!$result)) {
	$response["success"] = false;
	$response["message"] = "This email is not associated with a MetExplore User account." ;

	die(json_encode($response));
}
else{

	if(mysqli_num_rows($result)==0){
	
		$response["success"] = false;
		$response["message"] = "This email is not associated with a MetExplore User account." ;

		//die(json_encode($response));
	}else{
	
		$tab=mysqli_fetch_assoc($result);
		$userId=$tab["userId"];

		$idBiosource=mysqli_real_escape_string ( $link , $idBiosource );

		$sql="INSERT INTO `UserBioSource` (`idUser`, `idBioSource`, `Acces`) VALUES ('$userId', '$idBiosource', (SELECT idStatus FROM Status WHERE status='rw'))";
		
		$numresult=mysqli_query ($link, $sql) or die('{success: false, message: "Error in Mysql Query"}');    

		if (! $numresult) {
			$response ["message"] = "Impossible to add the selected users";
			$response["success"] = false;
		}
		$action = array('action' => "add user to biosource", 'iduser' => $userId);
		AddSQLtoBioSourceLog($idBiosource,$sql,$iduser, $action, $link);
	}
	echo json_encode($response);
}
?>
