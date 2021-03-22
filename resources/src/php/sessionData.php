<?php
/**
 * Get information about current user and current biosource and current version
 * used in C_Session.js
 */

require_once ('user/userFunctions.php');
require_once ('database/connection.php');
require_once ('database/connectionJoomla.php');
require_once ("biodata/biosource/bioSourceFunctions.php");
require_once ('config/server_variables.php');

session_start();

$P_idBioSource=$_POST['idBioSource'];
$P_idUser=getIdUser();
$P_idProject = getIdProject(); 
$P_updateLastVisit = $_POST['updateLastVisit'];

$data = array();

// Get data about biosource and user access for this biosource
if ($P_idBioSource!=-1) {
	
	$sqlBioSource = "SELECT BioSource.id AS idBioSource, BioSource.strain as strain, BioSource.nameBioSource as nameBioSource, DatabaseRef.type as typeDB,  DatabaseRef.source as sourceDB, DatabaseRef.version as versionDB, DatabaseRef.id as idDB, Organism.name as orgName  FROM BioSource,Organism,DatabaseRef WHERE BioSource.idOrg= Organism.id AND BioSource.id=$P_idBioSource AND DatabaseRef.id=BioSource.idDB";
	
	$resultBioSource= $link->query($sqlBioSource);
	
	while ($row= mysqli_fetch_array($resultBioSource,MYSQLI_ASSOC))
	{		

		$completeName = $row['orgName'];
		$strain = $row['strain'];		
		if ($strain != "NULL" && $strain != "" && $strain != "NA") {
			$completeName = $completeName . " (Strain: $strain)";
		}
		
		$completeName = $completeName . " (Source: ".$row['sourceDB'].", Version: ".$row['versionDB'].")";
		
		$row["NomComplet"] = $completeName;
		
		$data= $row;
	}
		
	/*
	 * public or private
	*/
	$status = getBioSourceStatus($P_idBioSource, $link);
	if ($status == "denied" || $status == "private") 
	{
		$data ["public"] = false;
	}
	else 
	{
		$data ["public"] = true;
	}
	
	// Access
	$data["access"] = getBioSourceRights($P_idUser, $P_idBioSource, $link);
	
} else {
	
	$data ["idBioSource"] = -1;
	$data ["nameBioSource"] = -1;
	$data ["strain"] = -1;
	
	$data ["NomComplet"] = -1;
	$data ["typeDB"] = -1;     
	$data ["sourceDB"] = -1;
	$data ["versionDB"] = -1;
	$data ["idDB"] = -1;
	$data ["orgName"] = -1;
	$data ["public"] = false;
}


/**
 * Get user data
 */
if ($P_idUser!=-1) {
	
	$sqlUser = "SELECT UserMet.id AS idUser , UserMet.name AS nameUser, UserMet.username AS loginUser, UserMet.email AS emailUser, UserMet.lastvisitDate AS lastvisitDate FROM UserMet WHERE UserMet.id=$P_idUser ";
	
	$resultUser= $link->query($sqlUser);
	
	$row= mysqli_fetch_array($resultUser);
	
	$data["idUser"]= $row["idUser"];
	$data["nameUser"]= $row["nameUser"];
	$data["loginUser"]= $row["loginUser"];
	$data["emailUser"]= $row["emailUser"];
	$data["lastvisitDate"]= $row["lastvisitDate"];
	
	//Project :
	$data["idProject"] = $P_idProject;
	
	//Update lastvisitDate:
	if ($P_updateLastVisit == "true") {
		$sqlUpdt = "UPDATE jzlvs_users SET lastvisitDate=\"" . date("Y-m-d H:i:s") . "\" WHERE id=$P_idUser";
		$resultUpdt= $linkJ->query($sqlUpdt);
	}
	
} else {
	
	$data["idUser"]= -1;
	$data["nameUser"]= -1;
	$data["loginUser"]= -1;
	$data["emailUser"]= -1;
	
	//Project :
	$data["idProject"] = -1;
}

/*
 * recherche fichier version
 */

foreach (glob(WEB_DIR.'v*.txt') as $filename) {
    $data["versionAppli"]= basename($filename, ".txt");
}


echo json_encode($data);


?>
