<?php

require_once '../database/connection.php';


$sql="SELECT count( distinct `id`) as total,
count(CASE WHEN `chemicalFormula` IS NULL OR `chemicalFormula` = 'NA' OR `chemicalFormula` = 'na' THEN 1 END ) AS withoutFormula
FROM Metabolite";

$results = array();

$res= array();
$total;

$result=mysqli_query ($link,$sql);

if(! $result) {
	$response["message"] = "Impossible to get statistics on metabolites" ;
	mysqli_error($link);
	die(json_encode($response));
}
else{
	$tab=mysqli_fetch_assoc($result);
	$total=$tab["total"];
	
	$res["attributeName"] = "Chemical Formula";
	$res["with"]=$total-$tab["withoutFormula"];	
	$res["without"]=$tab["withoutFormula"];
	array_push($results, $res);
}

$sql="SELECT  
count(CASE WHEN metabInDB.extDBName LIKE 'inchi' OR metabInDB.extDBName LIKE 'Inchi' THEN 1 END ) AS withInchi,
count(CASE WHEN metabInDB.extDBName LIKE 'inchikey' OR metabInDB.extDBName LIKE 'InchiKey' THEN 1 END ) AS withInchiKey,
count(CASE WHEN metabInDB.extDBName LIKE 'smiles'  THEN 1 END ) AS withSmiles,
count(CASE WHEN metabInDB.extDBName LIKE 'kegg.compound' OR metabInDB.extDBName LIKE 'KEGG' THEN 1 END ) AS withKegg,
count(CASE WHEN metabInDB.extDBName LIKE 'cas' THEN 1 END ) AS withCas,
count(CASE WHEN metabInDB.extDBName LIKE 'pubchem.compound' OR metabInDB.extDBName LIKE 'PubChem'  THEN 1 END ) AS withPubchemCID,
count(CASE WHEN metabInDB.extDBName LIKE 'sbo' THEN 1 END ) AS withSBO,
count(CASE WHEN metabInDB.extDBName NOT IN ('inchi','Inchi','inchikey','InchiKey','smiles','kegg.compound','KEGG','cas','pubchem.compound','PubChem','sbo') THEN 1 END ) AS withOther 
FROM
(SELECT DISTINCT  idMetabolite, extDBName FROM
 MetaboliteIdentifiers WHERE extID<>'NA'  AND extID<>'na' ) AS metabInDB;";

$result=mysqli_query ($link,$sql);

if(! $result) {
	$response["message"] = "Impossible to get statistics on metabolites" ;
	mysqli_error($link);
	die(json_encode($response));
}
else{
	$tab=mysqli_fetch_assoc($result);
	
		
	$res["attributeName"] = "InChI";
	$res["with"]=$tab["withInchi"];	
	$res["without"]=$total-$tab["withInchi"];
	array_push($results, $res);
	
	$res["attributeName"] = "InChIKey";
	$res["with"]=$tab["withInchiKey"];	
	$res["without"]=$total-$tab["withInchiKey"];
	array_push($results, $res);
	
	$res["attributeName"] = "Smiles";
	$res["with"]=$tab["withSmiles"];	
	$res["without"]=$total-$tab["withSmiles"];
	array_push($results, $res);
	
	$res["attributeName"] = "Kegg";
	$res["with"]=$tab["withKegg"];	
	$res["without"]=$total-$tab["withKegg"];
	array_push($results, $res);
	
	$res["attributeName"] = "Cas";
	$res["with"]=$tab["withCas"];	
	$res["without"]=$total-$tab["withCas"];
	array_push($results, $res);
	
	$res["attributeName"] = "PubchemCID";
	$res["with"]=$tab["withPubchemCID"];	
	$res["without"]=$total-$tab["withPubchemCID"];
	array_push($results, $res);
	
	$res["attributeName"] = "SBO";
	$res["with"]=$tab["withSBO"];	
	$res["without"]=$total-$tab["withSBO"];
	array_push($results, $res);
	
	$res["attributeName"] = "Other";
	$res["with"]=$tab["withOther"];	
	$res["without"]=$total-$tab["withOther"];
	array_push($results, $res);
}


$response["success"] = true;
$response["results"] = $results;

echo json_encode($response);

?>
