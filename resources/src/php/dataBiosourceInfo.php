<?php 
// 
require_once 'database/connection.php';

$bioID=$_POST['idBioSource'];
$sql1="SELECT COUNT( DISTINCT ReactionInBioSource.id) AS nbReactions FROM ReactionInBioSource WHERE ReactionInBioSource.idBioSource=$bioID";

$sql2="SELECT COUNT( DISTINCT MetaboliteInBioSource.idMetaboliteInBioSource) AS nbMetabolites FROM MetaboliteInBioSource WHERE MetaboliteInBioSource.idBioSource=$bioID";

$sql3="SELECT COUNT( DISTINCT ids ) AS nbPathways FROM ( ( SELECT DISTINCT Pa.id AS ids FROM Pathway Pa, ReactionInPathway RiP, ReactionInBioSource RBS WHERE Pa.id=RiP.idPathway AND RiP.idReactionBioSource=RBS.id AND RBS.idBioSource=$bioID ) UNION (SELECT DISTINCT Pathway.id AS ids FROM Pathway, PathwayInBioSource WHERE Pathway.id=PathwayInBioSource.idPathway AND PathwayInBioSource.idBioSource=$bioID ) )y;";



$sql4="SELECT COUNT( DISTINCT CompartmentInBioSource.idCompartmentInBioSource) AS nbCompartments FROM CompartmentInBioSource WHERE CompartmentInBioSource.idBioSource=$bioID AND CompartmentInBioSource.idCompartment<>154";

$sql5="SELECT COUNT( DISTINCT UserBioSource.id) AS nbUsers FROM UserBioSource WHERE UserBioSource.idBioSource=$bioID";

$sql6="SELECT COUNT( DISTINCT Ge.id) AS nbGenes FROM Gene Ge, GeneInBioSource GeBS WHERE Ge.id=GeBS.idGene AND GeBS.idBioSource=$bioID";

$sql7="SELECT COUNT( DISTINCT Pr.id) AS nbProteins FROM Protein Pr, ProteinInBioSource PrBS WHERE Pr.id=PrBS.idProtein AND PrBS.idBioSource=$bioID";

$sql8="SELECT COUNT( DISTINCT En.id) AS nbEnzymes FROM Enzyme En, EnzymeInBioSource EnBS WHERE En.id=EnBS.idEnzyme AND EnBS.idBioSource=$bioID";


$response["success"] = false;
$results = array();
//
$result=mysqli_query ($link,$sql1);

if(! $result) {
	$response["message"] = "Impossible to get details for this bioSources!" ;
	//mysql_error();
	//die(json_encode($response));
}
else{
	$tab=mysqli_fetch_assoc($result);
	$results["nbReactions"] = $tab["nbReactions"];
}
//
$result=mysqli_query ($link,$sql2);

if(! $result) {
	$response["message"] = "Impossible to get details for this bioSources!" ;
//	mysql_error();
//	die(json_encode($response));
}
else{
	$tab=mysqli_fetch_assoc($result);
	$results["nbMetabolites"] = $tab["nbMetabolites"];
}
//
$result=mysqli_query ($link,$sql3);

if(! $result) {
	$response["message"] = "Impossible to get details for this bioSources!" ;
//	mysql_error();
//	die(json_encode($response));
}
else{
	$tab=mysqli_fetch_assoc($result);
	$results["nbPathways"] = $tab["nbPathways"];
}
//
$result=mysqli_query ($link,$sql4);

if(! $result) {
	$response["message"] = "Impossible to get details for this bioSources!" ;
//	mysql_error();
//	die(json_encode($response));
}
else{
	$tab=mysqli_fetch_assoc($result);
	$results["nbCompartments"] = $tab["nbCompartments"];
}
//
$result=mysqli_query ($link,$sql5);

if(! $result) {
	$response["message"] = "Impossible to get details for this bioSources!" ;
//	mysql_error();
//	die(json_encode($response));
}
else{
	$tab=mysqli_fetch_assoc($result);
	$results["nbUsers"] = $tab["nbUsers"];
}
//
$result=mysqli_query ($link,$sql6);

if(! $result) {
	$response["message"] = "Impossible to get details for this bioSources!" ;
//	mysql_error();
//	die(json_encode($response));
}
else{
	$tab=mysqli_fetch_assoc($result);
	$results["nbGenes"] = $tab["nbGenes"];
}
//
$result=mysqli_query ($link,$sql7);

if(! $result) {
	$response["message"] = "Impossible to get details for this bioSources!" ;
//	mysql_error();
//	die(json_encode($response));
}
else{
	$tab=mysqli_fetch_assoc($result);
	$results["nbProteins"] = $tab["nbProteins"];
}
//
$result=mysqli_query ($link,$sql8);

if(! $result) {
	$response["message"] = "Impossible to get details for this bioSources!" ;
//	mysql_error();
//	die(json_encode($response));
}
else{
	$tab=mysqli_fetch_assoc($result);
	$results["nbEnzymes"] = $tab["nbEnzymes"];
}
//
$response["success"] = true;
$response["results"] = $results;

echo json_encode($response);
?>
