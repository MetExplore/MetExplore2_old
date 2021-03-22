<?php
/**
 * Gets the information for only one BioSource
 */
require_once 'database/connection.php';

$idBioSource = $_GET ['idBioSource'];

$response ["success"] = false;

$results = array ();

if (isset ( $idBioSource )) {
	
	// $sql="SELECT DISTINCT BioSource.id AS id , DatabaseRef.type as type, CONCAT(CONCAT(Organism.name,' - '),CONCAT(BioSource.strain,CONCAT(' - ',BioSource.nameBioSource))) AS NomComplet FROM BioSource,Organism,DatabaseRef WHERE BioSource.idOrg= Organism.id AND BioSource.id=$idBioSource AND DatabaseRef.id=BioSource.idDB ORDER BY NomComplet";
	
	$sql = "SELECT DISTINCT BioSource.id AS id , DatabaseRef.type as type,  Organism.name as orgName, BioSource.strain as strain, BioSource.nameBioSource as nameBioSource, DatabaseRef.source as source, DatabaseRef.version as version FROM BioSource,Organism,DatabaseRef WHERE BioSource.idOrg= Organism.id AND BioSource.id=$idBioSource AND DatabaseRef.id=BioSource.idDB ORDER BY orgName";
	
// 	error_log ( $sql );
	
	// $num_result=mysql_query($sql, $con);
	// $totaldata = mysql_num_rows($num_result);
	
	$result = mysqli_query ($link, $sql );
	
	if (! $result) {
		$response ["message"] = "Impossible to get the BioSource no $idBioSource!";
		mysqli_error ($link);
		die ( json_encode ( $response ) );
	}
		
	while ( $tab = mysqli_fetch_assoc ( $result ) ) {
		$orgName = $tab ["orgName"];
		
		$strain = $tab ["strain"];
		
		$type = $tab ["type"];
		
		$id = $tab ["id"];
		
		$nameBioSource = $tab ["nameBioSource"];
		
		$source = $tab ["source"];
		
		$version = $tab ["version"];
		
		$completeName = $orgName;
		
		if ($strain != "NULL" && $strain != "" && $strain != "NA") {
			$completeName = $completeName . " (Strain: $strain)";
		}
		
		$completeName = $completeName . " (Source: $source, Version: $version)";
		
		$res = array ();
		
		$res ["NomComplet"] = $completeName;
		$res ["id"] = $id;
		$res ["type"] = $type;
		
		/*
		 * public or private
		 */
		$sql = "SELECT DISTINCT UserBioSource.id AS id FROM UserBioSource WHERE UserBioSource.idBioSource=$idBioSource ";
	
// 		error_log ( $sql );
		$resultP = mysqli_query ($link, $sql );
		if (! $resultP) {
			$res ["public"] = false;	
		} else {
			$tabP = mysql_fetch_assoc ( $resultP );
			if ($tabP ["id"]!="") {
				$res ["public"] = false;
			} else {
				$res ["public"] = true;
			}
			
		}
	
		array_push($results, $res);
	}
}			
$response ["success"] = true;
$response["results"] = $results;

echo json_encode ( $response );
?>
