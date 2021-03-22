<?php 
// 
require_once 'database/connection.php';

$response ["success"] = false;

$results = array ();


$sql="SELECT `BioSource`.`id`, `BioSource`.`nameBioSource` , `BioSource`.`strain` , `BioSource`.`tissue` , `BioSource`.`source` AS BSsource, `BioSource`.`cellType` , `DatabaseRef`.`id` AS idDB,  `DatabaseRef`.`name`, `DatabaseRef`.`url`, `DatabaseRef`.`version`, `DatabaseRef`.`type`, `DatabaseRef`.`source` AS DBsource FROM `BioSource` LEFT OUTER JOIN `DatabaseRef` ON ( `BioSource`.`idDB` = `DatabaseRef`.`id` )";



$result = mysqli_query ($link, $sql );

if (! $result) {
	$response ["message"] = "Impossible to get the BioSources !";
	//mysql_error ();
	//die ( json_encode ( $response ) );
}

while ( $tab = mysqli_fetch_assoc ( $result ) ) {

	$res = array ();
	
	$res['idBiosource']=$tab['id'];

	$res['BSName']=$tab['nameBioSource'];
	
	$res['BSStrain']=$tab['strain'];
	
	$res['BSTissue']=$tab['tissue'];
	
	$res['BSSource']=$tab['BSsource'];
	$res['BSCellType']=$tab['cellType'];
	
	$res['idDBRef']=$tab['idDB'];
	
	$res['DBRefName']=$tab['name'];
	$res['DBRefURL']=$tab['url'];
	$res['DBRefVersion']=$tab['version'];
	$res['DBRefType']=$tab['type'];
	$res['DBRefSource']=$tab['DBsource'];
	
	array_push($results, $res);

}
			
$response ["success"] = true;
$response["results"] = $results;

echo json_encode ( $response );
/*
 * $sql="SELECT DISTINCT Organism.name as orgName, Organism.id as orgId, DatabaseRef.id as DBRefId, DatabaseRef.name as DBRefName, DatabaseRef.url as DBRefURL, DatabaseRef.version as DBRefVersion , DatabaseRef.type as DBRefType, DatabaseRef.source as DBRefSource, BioSource.id AS id, BioSource.strain as BSStrain, BioSource.nameBioSource as BSName, BioSource.tissue as BSTissue, BioSource.source as BSSource, BioSource.cellType as BScellType, GROUP_CONCAT(Biblio.pubmedId,\"-\" ) AS biblio FROM BioSource, DatabaseRef, Organism, BioSourceHasReference, Biblio SELECT DISTINCT Organism.name as orgName, Organism.id as orgId, DatabaseRef.id as DBRefId, DatabaseRef.name as DBRefName, DatabaseRef.url as DBRefURL, DatabaseRef.version as DBRefVersion , DatabaseRef.type as DBRefType, DatabaseRef.source as DBRefSource, BioSource.id AS id, BioSource.strain as BSStrain, BioSource.name as BSName, BioSource.tissue as BSTissue, BioSource.source as BSSource, BioSource.cellType as BScellType, GROUP_CONCAT(Biblio.pubmedId,"-" ) AS biblio FROM BioSource, DatabaseRef, Organism, BioSourceHasReference, Biblio WHERE BioSource.idDB= DatabaseRef.id AND BioSource.idOrg= Organism.id AND BioSourceHasReference.idBiblio=Biblio.idBiblio AND BioSource.id NOT IN (SELECT DISTINCT idBioSource FROM UserBioSource) GROUP BY BioSource.id ORDER BY orgName";

 */
?>
