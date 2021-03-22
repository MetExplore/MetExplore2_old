<?php 
// 
require_once 'database/connection.php';

// $sql="SELECT DISTINCT BioSource.id AS id ,  CONCAT(CONCAT(Organism.name,' - '),CONCAT(BioSource.strain,CONCAT(' - ',BioSource.nameBioSource))) AS NomComplet, DatabaseRef.type as type FROM BioSource,Organism,DatabaseRef WHERE BioSource.idOrg= Organism.id AND (BioSource.idDB=DatabaseRef.id) AND BioSource.id NOT IN (SELECT DISTINCT idBioSource FROM UserBioSource) ORDER BY NomComplet";
$sql="SELECT DISTINCT Organism.name as orgName, Organism.id as orgId, DatabaseRef.type as dbType, DatabaseRef.id as dbId, DatabaseRef.url as dbUrl, DatabaseRef.name as dbName,DatabaseRef.version as dbVersion, DatabaseRef.source as dbSource, BioSource.id AS id , BioSource.strain as strain, BioSource.nameBioSource as nameBioSource, BioSource.tissue as tissue, BioSource.cellType as cellType, BioSource.source as source, GROUP_CONCAT(Biblio.pubmedId,'-' ) AS biblio, GROUP_CONCAT( DISTINCT UserMet.username ORDER BY UserMet.username ASC SEPARATOR ', ' ) AS users,
CASE WHEN BioSource.id IN (SELECT DISTINCT idBioSource FROM UserBioSource) THEN 'Private' ELSE 'Public' END AS status
FROM Organism, DatabaseRef, BioSource 
LEFT OUTER JOIN BioSourceHasReference ON BioSource.id=BioSourceHasReference.idBioSource 
LEFT OUTER JOIN Biblio ON BioSourceHasReference.idBiblio=Biblio.idBiblio 
LEFT OUTER JOIN UserBioSource ON BioSource.id = UserBioSource.idBioSource
LEFT OUTER JOIN UserMet ON UserBioSource.idUser = UserMet.id
WHERE BioSource.idOrg = Organism.id
AND (
BioSource.idDB = DatabaseRef.id
)
GROUP BY id
ORDER BY orgName";




//error_log($sql);

$response["success"] = false;


$result=mysqli_query ($link, $sql); 

if(! $result) {
	$response["message"] = "Unable to get the list of the bioSources!" ;
	mysqli_error();
	die(json_encode($response));
}


$results = array();

while ($tab=mysqli_fetch_assoc($result))
{
	$strain = $tab["strain"];

	$source = $tab["dbSource"];

	$version = $tab["dbVersion"];

	$completeName = $tab["orgName"];

	if($strain != "NULL" && $strain != "" && $strain != "NA")
	{
		$completeName = $completeName." (Strain: $strain)";
	}

	$completeName = $completeName." (Source: $source, Version: $version)";
	
	$tab["NomComplet"] = $completeName;
	
	$id= $tab["id"];
	
	$cmd="find /tmp/progress$id.txt 2>/dev/null";
	$output = array();
	$cmdres = exec($cmd, $output);
	
	if(sizeOf($output)!=0){
		$tab["inProgress"]=true;
	}else{
		$tab["inProgress"]=false;
	}
	
	$results[]= $tab;
	
}

$response["success"] = true;
$response["results"] = $results;
echo json_encode($response);
?>
