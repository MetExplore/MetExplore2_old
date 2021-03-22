<?php

require_once('../database/connection.php');
require_once '../user/userFunctions.php';

$functionParam= json_decode($_POST['functionParam'], $assoc=true);
extract ( $functionParam, EXTR_OVERWRITE );

if (!isset($idBioSources)) {
	if (isset($idBiosource)) {
		$idBioSources = array($idBiosource);
	}
	else {
		die('{success: false, message:"missing argument $idBiosource(s)"}');
	}
}
if (!isset($databaseRefs)) {
	if (isset($databaseRef) && isset($idBiosource)) {
		$databaseRefs = array($idBiosource => $databaseRef);
	}
	else {
		die('{success: false, message:"missing argument $databaseRef(s)"}');
	}
}

$idUser = getIdUser();

$rightTypes = checkBioSources($idBioSources, $idUser, $link);
$response = deleteBioSources($idBioSources, $databaseRefs, $rightTypes, $idUser, $link);

echo json_encode($response);

function checkBioSources($idBioSources, $idUser, $link) {

	$idBioSourcesConverted= array();

	foreach($idBioSources as $idBioSource) {
		array_push($idBioSourcesConverted, mysqli_real_escape_string ( $link , $idBioSource ));
	}
	$idUser=mysqli_real_escape_string ( $link , $idUser );


	$idBiosources_list = implode(', ', $idBioSourcesConverted);
	$sql="SELECT `Status`.`status` AS rights, `UserBioSource`.`idBioSource` AS idBiosource FROM `Status`, `UserBioSource` WHERE `UserBioSource`.`idUser`='$idUser' AND `UserBioSource`.`idBioSource` in ($idBiosources_list) AND `UserBioSource`.`Acces`=`Status`.`idStatus`";
	$result=mysqli_query ($link, $sql);
	$response["success"] = false;
	
	$rightTypes= array();
	
	foreach($idBioSources as $idBioSource) {
		$rightTypes[$idBioSource] = "r";
	}
	
	if(! $result) {
		$response["message"] = "You have no rights on this Biosource" ;
		mysqli_error($link);
		die(json_encode($response));
	}
	
	if(mysqli_num_rows($result)==0){
		$response["message"] = "You have no rights on this Biosource" ;
		die(json_encode($response));
	
	}
	else{
	
		while ($tab=mysqli_fetch_assoc($result)){
			$rightTypes[$tab["idBiosource"]] = $tab["rights"];
		}
	}
	
	return $rightTypes;
}

function deleteBioSources($idBioSources, $databaseRefs, $rightTypes, $idUser, $link) {
	
	$response = array();
	$response["message"] = "Network deleted from the database.";

	$idUser = mysqli_real_escape_string ( $link , $idUser);
	
	foreach($idBioSources as $idBioSource) {
		
		$databaseRef = mysqli_real_escape_string ( $link , $databaseRefs[$idBioSource]);
		$rightType = mysqli_real_escape_string ( $link , $rightTypes[$idBioSource]);
		
		if ($rightType=="p"){
			$sql="DELETE FROM `DatabaseRef`  WHERE  `DatabaseRef`.`id`='$databaseRef'";
			$result=mysqli_query ($link, $sql);
			if(! $result) {
				$response["message"] = "Impossible to delete this bioSources/databaseref!";
				mysql_error();
				die(json_encode($response));
			}/*else{
				$response["success"] = true;
				$response["message"] = "Network deleted from the database.";
			}*/
		}else{
			
			$sql="DELETE FROM `UserBioSource` WHERE `UserBioSource`.`idUser`='$idUser' AND `UserBioSource`.`idBioSource`='$idBioSource'";
			$result=mysqli_query ($link, $sql);
			if(! $result) {
				$response["message"] = "Impossible to delete this bioSources/databaseref!";
				mysql_error();
				die(json_encode($response));
			}else{
				$response["success"] = true;
				$response["message"] = count($idBioSources) == 1 ? "You are not the owner of the network, you cannot delete it.</br>However, it was withdrawn from your personal Biosource list." : "You are not the owner of at least one network, you cannot delete those.</br>However, they were withdrawn from your personal Biosource list.";
			}
		}
	}
	$response["success"] = true;
	return $response;
}

?>
