<?php 
require_once 'database/connection.php';
require_once 'user/userFunctions.php';

$P_idUser=getIdUser(); 

//$sql = "SELECT DISTINCT BioSource.id AS id , DatabaseRef.type as type,  Organism.name as orgName, BioSource.strain as strain, BioSource.idDB as idDB, BioSource.nameBioSource as nameBioSource, DatabaseRef.source as source, DatabaseRef.version as version, GROUP_CONCAT(Biblio.pubmedId,\"-\" ) AS biblio FROM BioSource LEFT OUTER JOIN BioSourceHasReference ON BioSource.id=BioSourceHasReference.idBioSource LEFT OUTER JOIN Biblio ON BioSourceHasReference.idBiblio=Biblio.idBiblio, UserBioSource, Organism, DatabaseRef WHERE (BioSource.idOrg= Organism.id) AND (UserBioSource.idBioSource= BioSource.id) AND (BioSource.idDB=DatabaseRef.id) AND (UserBioSource.idUser= $P_idUser) GROUP BY BioSource.id ORDER BY orgName";
$sql="SELECT DISTINCT Organism.name as orgName, Organism.id as orgId, DatabaseRef.id as dbId, DatabaseRef.type as dbType, DatabaseRef.url as dbUrl, DatabaseRef.name as dbName,DatabaseRef.version as dbVersion, DatabaseRef.source as dbSource, BioSource.id AS id , BioSource.strain as strain, BioSource.nameBioSource as nameBioSource, BioSource.idInDB AS IdinDBref, BioSource.tissue as tissue,BioSource.cellType as cellType, BioSource.source as source, BioSource.dateLastModif as lastModification, BioSource.dateAdd as dateAdd, GROUP_CONCAT(Biblio.pubmedId,'|',Biblio.ShortRef SEPARATOR \"-\" ) AS biblio, Status.name AS access FROM BioSource LEFT OUTER JOIN BioSourceHasReference ON BioSource.id=BioSourceHasReference.idBioSource LEFT OUTER JOIN Biblio ON BioSourceHasReference.idBiblio=Biblio.idBiblio, Organism, DatabaseRef, UserBioSource, Status WHERE BioSource.idOrg= Organism.id AND (BioSource.idDB=DatabaseRef.id) AND (UserBioSource.idUser= $P_idUser) AND UserBioSource.idBioSource= BioSource.id AND UserBioSource.Acces = Status.idStatus GROUP BY BioSource.id";

$response["success"] = false;


$result=mysqli_query ($link, $sql); 

if(! $result) {
	$response["message"] = "Impossible to get the list of the private bioSources!" ;
	mysqli_error($link);
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

	if ( $tab["dateAdd"] == "0000-00-00 00:00:00") {
		 $tab["dateAdd"] = "2015-02-13 00:00:00";
	}
	
	if ($tab["lastModification"] == "0000-00-00 00:00:00") {
		$tab["lastModification"] = $tab["dateAdd"];
	}

	$tab["public"]=false;
	
	//Check if BioSource is part of one project :
	$idBioSource = $tab['id'];
	$sqlP = "SELECT Project.id AS idProject, Project.name AS project FROM Project, BioSourceInProject"
			." WHERE BioSourceInProject.idBioSource = $idBioSource"
			." AND BioSourceInProject.idProject = Project.id";
	$resultP=mysqli_query ($link, $sqlP);
	if(! $resultP) {
		$response["message"] = "Impossible to get the list of the project associated to BioSource!" ;
		mysqli_error($link);
		die(json_encode($response));
	}
	if ($rowP=mysqli_fetch_object($resultP)) {
		$tab['project'] = $rowP->project;
		$tab['idProject'] = $rowP->idProject;
		$tab['groupNameProject'] = "1-project:" . $rowP->project;
	}
	else {
		$tab['project'] = "None";
		$tab['idProject'] = -1;
		$tab['groupNameProject'] = "0-private";
	}
	
	$results[]= $tab;
}

$response["success"] = true;
$response["results"] = $results;
echo json_encode($response);?>
