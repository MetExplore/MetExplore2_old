<?php 
// 
require_once 'database/connection.php';

// $sql="SELECT DISTINCT BioSource.id AS id ,  CONCAT(CONCAT(Organism.name,' - '),CONCAT(BioSource.strain,CONCAT(' - ',BioSource.nameBioSource))) AS NomComplet, DatabaseRef.type as type FROM BioSource,Organism,DatabaseRef WHERE BioSource.idOrg= Organism.id AND (BioSource.idDB=DatabaseRef.id) AND BioSource.id NOT IN (SELECT DISTINCT idBioSource FROM UserBioSource) ORDER BY NomComplet";
//$sql="SELECT DISTINCT Organism.name as orgName, Organism.id as orgId, DatabaseRef.type as dbType, DatabaseRef.url as dbUrl, DatabaseRef.name as dbName,DatabaseRef.version as dbVersion, DatabaseRef.source as dbSource,BioSource.id AS id , DatabaseRef.type as type,  Organism.name as orgName, BioSource.strain as strain, BioSource.idDB as idDB, BioSource.nameBioSource as nameBioSource, DatabaseRef.source as source, DatabaseRef.version as version, GROUP_CONCAT(Biblio.pubmedId,\"-\" ) AS biblio FROM BioSource LEFT OUTER JOIN BioSourceHasReference ON BioSource.id=BioSourceHasReference.idBioSource LEFT OUTER JOIN Biblio ON BioSourceHasReference.idBiblio=Biblio.idBiblio, Organism, DatabaseRef WHERE BioSource.idOrg= Organism.id AND (BioSource.idDB=DatabaseRef.id) AND BioSource.id NOT IN (SELECT DISTINCT idBioSource FROM UserBioSource) GROUP BY BioSource.id ORDER BY orgName";
$sql="SELECT DISTINCT Organism.name as orgName, Organism.id as orgId, DatabaseRef.type as dbType, DatabaseRef.url as dbUrl, DatabaseRef.name as dbName,DatabaseRef.version as dbVersion, DatabaseRef.source as dbSource, BioSource.id AS id , BioSource.strain as strain, BioSource.nameBioSource as nameBioSource, BioSource.idInDB AS IdinDBref, BioSource.tissue as tissue,BioSource.cellType as cellType,BioSource.source as source, BioSource.dateLastModif as lastModification, BioSource.dateAdd as dateAdd, GROUP_CONCAT(Biblio.pubmedId,'|',Biblio.ShortRef SEPARATOR \"-\" ) AS biblio FROM BioSource LEFT OUTER JOIN BioSourceHasReference ON BioSource.id=BioSourceHasReference.idBioSource LEFT OUTER JOIN Biblio ON BioSourceHasReference.idBiblio=Biblio.idBiblio, Organism, DatabaseRef WHERE BioSource.idOrg= Organism.id AND (BioSource.idDB=DatabaseRef.id) AND BioSource.id NOT IN (SELECT DISTINCT idBioSource FROM UserBioSource) GROUP BY BioSource.id";

//error_log($sql);
$result=mysqli_query ($link, $sql);    

if (! $result) {
	$response ["message"] = "Impossible to get the list of the biosources!";
	$response["success"] = false;
}
else {
	$data = array();
	
	while ($row=mysqli_fetch_object($result))
	{

		$strain = $row->strain;

		$source = $row->dbSource;

		$version = $row->dbVersion;

		$completeName = $row->orgName;

		if($strain != "NULL" && $strain != "" && $strain != "NA")
		{
			$completeName = $completeName." (Strain: $strain)";
		}

		$completeName = $completeName." (Source: $source, Version: $version)";
		
		$row->NomComplet = $completeName;

		if ($row->dateAdd == "0000-00-00 00:00:00") {
			$row->dateAdd = "2015-02-13 00:00:00";
		}

		if ($row->lastModification == "0000-00-00 00:00:00") {
			$row->lastModification = $row->dateAdd;
		}

		$row->public=true;
		
		$row->groupNameProject="2-public";
		
		$row->idProject=-1;
		
		$data [] = $row;
	}
	$response["success"] = true;
	$response["results"] = $data;
	
}
echo json_encode($response);?>
