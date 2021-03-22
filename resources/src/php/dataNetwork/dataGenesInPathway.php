<?php
/**
 * Get all Genes details of each reaction that compose the pathway.
 */

require_once '../database/connection.php';

$Pathway = $_GET['idPathway'];

//Get informations about BioSource:
$sql = "SELECT DatabaseRef.name AS nameDB, DatabaseRef.url AS urlDB, DatabaseRef.type AS typeDB"
	   ." FROM Pathway, DatabaseRef"
	   ." WHERE Pathway.id = $Pathway"
	   ." AND Pathway.idDB = DatabaseRef.id";

$result = mysqli_query ( $link, $sql ) or die ( mysql_error () );
if ($row = mysqli_fetch_object ( $result ))
{
	$nameDB = $row->nameDB;
	$urlDB = $row->urlDB;
	$typeDB = $row->typeDB;
}
else 
{
	die("ERROR: can't get informations on DatabaseRef.");
}

//Get informations about all Genes that compose Pathway:
$sql = "SELECT DISTINCT Gene.id AS id, Gene.name AS name, Gene.dbIdentifier FROM GeneInBioSource, GeneCodesForProtein, ProteinInEnzyme, Catalyses, ReactionInBioSource, ReactionInPathway, Gene".
	   " WHERE ReactionInPathway.idPathway = $Pathway". 
	   " AND ReactionInBioSource.id = ReactionInPathway.idReactionBioSource".
	   " AND ReactionInBioSource.id = Catalyses.idReactionInBioSource".
	   " AND Catalyses.idEnzymeInBioSource = ProteinInEnzyme.idEnzymeInBioSource".
	   " AND ProteinInEnzyme.idProteinInBioSource = GeneCodesForProtein.idProteinInBioSource".
	   " AND GeneCodesForProtein.idGeneInBioSource = GeneInBioSource.id".
	   " AND GeneInBioSource.idGene = Gene.id";

$result = mysqli_query ( $link, $sql ) or die ( mysql_error () );

$results = array();

while($row = mysqli_fetch_object ( $result ))
{
	$res["name"] = html_entity_decode ( $row->name );
	$res["dbIdentifier"] = html_entity_decode ( $row->dbIdentifier );
	
	//Make url if Biosource type is biocyc or TrypanoCyc:
	if ($typeDB=="biocyc" || $typeDB=="BioCyc" || $typeDB=="TrypanoCyc")
	{
		if ($urlDB=="")
		{
			$res["url"] = "http://metacyc.org/META/NEW-IMAGE?type=GENE&object=" . $res["dbIdentifier"];
		}
		else
		{
			$res["url"] = $urlDB. "/" . $nameDB . "/NEW-IMAGE?type=GENE&object=" . $res["dbIdentifier"];
		}
	}
	else {
		$res["url"] = "NONE";
	}
	
	array_push($results, $res);
}

	$response["success"] = true;
	$response["results"] = $results;
	echo json_encode($response);

?>