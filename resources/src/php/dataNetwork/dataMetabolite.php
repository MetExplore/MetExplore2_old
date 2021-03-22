<?php
//
$P_idBioSource=$_POST['idBioSource'];
$sql=$_POST['req'];
$P_Listid=$_POST['id'];
$P_getVotes = $_POST ['getVotes'] == "true";
//error_log("----");
//error_log($P_idBioSource);

require_once '../database/connection.php';
require_once '../database/requete_sel.php';
require_once 'getVotesFunctions.php';

require_once '../user/userFunctions.php';

$currentUser=getIdUser();

if(getBioSourceRights($currentUser, $P_idBioSource, $link) == "denied"){
	echo '{"success":false}';
	return;
}

$result=mysqli_query ($link, $$sql);    
$response= array();
if (! $result) {
	$response ["message"] = "Impossible to get the list of the metabolites!";
	$response["success"] = false;
}
else {
	
	require_once 'dataDatabaseRef.php';
	
	$data = array();
	
	while ($row=mysqli_fetch_object($result))
	{
		$row->name= html_entity_decode($row->name);
		$row->dbIdentifier= html_entity_decode($row->dbIdentifier);
		
		$P_idMetabolite=$row->id;

		//Get votes if necessary:
		if ($P_getVotes) {
			$votes = getVotesForObject($P_idMetabolite, "Metabolite", $link);
			$row->votes = $votes["votes"];
			$row->hasVote = $votes["hasVote"] ? "yes" : "no";
		}
		
		//ajout compartiments	
	    $sqlCompart="SELECT GROUP_CONCAT(DISTINCT CompartmentInBioSource.identifier SEPARATOR \" | \") AS Compartment FROM Metabolite, MetaboliteInCompartment, CompartmentInBioSource WHERE Metabolite.id= MetaboliteInCompartment.idMetabolite AND MetaboliteInCompartment.idCompartmentInBioSource=CompartmentInBioSource.idCompartmentInBioSource AND Metabolite.id=$P_idMetabolite";		
		$resultcompart=mysqli_query ($link, $sqlCompart) ;
		if ($resultcompart) {
			if ($compart= mysqli_fetch_object($resultcompart)) {
				$row->compartment= html_entity_decode($compart->Compartment); 
			} else {
				$row->compartment="";
			}
		}
		//ajout svg
	/*	
		$sqlId= "SELECT extID FROM MetaboliteIdentifiers WHERE MetaboliteIdentifiers.idMetabolite= $P_idMetabolite AND extDBName=\"inchi\" ORDER BY score DESC";
		$resultId= mysql_query ($sqlId, $con) or die (mysql_error ());
		$row->svg= "";
		if ($rowId= mysql_fetch_object($resultId)) {
			$sqlSvg= "SELECT svgFile FROM LinkInchiToSVGFile WHERE inchi=\"$rowId->extID\"";
			// error_log($sqlSvg);
			$resultSvg= mysql_query ($sqlSvg, $con) or die (mysql_error ());
			if ($rowSvg= mysql_fetch_object($resultSvg)) $row->svg= $rowSvg->svgFile;
		}*/
		
		//Link to database:
		if ($rowDB && ($rowDB->type=="biocyc" || $rowDB->type=="BioCyc" || $rowDB->type=="TrypanoCyc"))
		{
			if ($rowDB->url=="")
			{
				$row->linkToDB = "http://metacyc.org/META/NEW-IMAGE?type=COMPOUND&object=" . $row->dbIdentifier;
			}
			else
			{
				$row->linkToDB = $rowDB->url . "/" . $rowDB->name . "/NEW-IMAGE?type=COMPOUND&object=" . $row->dbIdentifier;
			}
		}
		else {
			$row->linkToDB = "NONE";
		}
		
		$data [] = $row;
	}
	$response["success"] = true;
	$response["results"] = $data;
	
}
echo json_encode($response);
	
?>
