<?php 
// 
$P_idBioSource=$_POST['idBioSource'];
$sql=$_POST['req'];
$P_Listid=$_POST['id'];
$P_getVotes = $_POST ['getVotes'] == "true";
/*
$start= $_GET['start'];
$limit= $_GET['limit'];
$order= $_GET['order'];
$direction= $_GET['dir'];
*/
require_once '../database/connection.php';
require_once '../database/requete_sel.php';
require_once 'getVotesFunctions.php';

require_once '../user/userFunctions.php';

$currentUser=getIdUser();

if(getBioSourceRights($currentUser, $P_idBioSource, $link) == "denied"){
	return '{"success":false}';
}

//$sql= $$sql." ORDER BY name";		//.$order." ".$direction." LIMIT ".$start.",".$limit;
$result=mysqli_query($link,$$sql) ;
$response= array();
if (! $result) {
	$response ["message"] = "Impossible to get the list of the pathways!";
	$response["success"] = false;
}
else {
	
	require_once 'dataDatabaseRef.php';
	
	$data = array();
	 while ($row=mysqli_fetch_object($result))
	{
		$hasCompleteness = true; //true if we have all data to compute completeness
		$row->name= html_entity_decode($row->name);
		
		$P_idPathway= $row->id;
		
		//Get votes if necessary:
		if ($P_getVotes) {
			$votes = getVotesForObject($P_idPathway, "Pathway", $link);
			$row->votes = $votes["votes"];
			$row->hasVote = $votes["hasVote"] ? "yes" : "no";
		}
		
		//Total number of reactions :
		$sqlA = "SELECT COUNT(DISTINCT(ReactionInPathway.idReactionBioSource)) AS reactionsTotal"
				." FROM Pathway, ReactionInPathway"
				." WHERE Pathway.id = $P_idPathway"
				." AND Pathway.id = ReactionInPathway.idPathway"
				." GROUP BY Pathway.id";
		$resultA=mysqli_query($link,$sqlA);
		if ($rowA=mysqli_fetch_object($resultA))
		{
			$row->nbReaction = $rowA->reactionsTotal;
		}
		else {
			$hasCompleteness = false;
			//error_log("A pathway cannot have any reaction. Check for the problem. IDPATHWAY=$P_idPathway, IDBIOSOURCE=$P_idBioSource");
		}
		
		//Number of reaction with enzymes:
		$sqlA = "SELECT COUNT(DISTINCT(ReactionInPathway.idReactionBioSource)) AS reactionsWithEnz"
				." FROM Pathway, ReactionInPathway, Catalyses"
				." WHERE Pathway.id = $P_idPathway"
				." AND Pathway.id = ReactionInPathway.idPathway"
				." AND ReactionInPathway.idReactionBioSource = Catalyses.idReactionInBioSource"
				." GROUP BY Pathway.id";
		$resultA=mysqli_query($link,$sqlA);
		if($rowA=mysqli_fetch_object($resultA))
		{
			$row->nbReactionWithEnz = $rowA->reactionsWithEnz;
		}
		else {
			$row->nbReactionWithEnz = 0;
		}
		
		//Completeness:
		if ($hasCompleteness)
		{
			if ($row->nbReaction)
				$row->completeness = ($row->nbReactionWithEnz / $row->nbReaction) * 100;
		}
		else
		{
			$row->completeness = -1;
		}
		
		//Link to database:
		if ($rowDB && ($rowDB->type=="biocyc" || $rowDB->type=="BioCyc"|| $rowDB->type=="TrypanoCyc"))
		{
			if ($rowDB->url=="")
			{
				$row->linkToDB = "http://metacyc.org/META/NEW-IMAGE?type=PATHWAY&object=" . $row->dbIdentifier;
			}
			else
			{
				$row->linkToDB = $rowDB->url . "/" . $rowDB->name . "/NEW-IMAGE?type=PATHWAY&object=" . $row->dbIdentifier;
			}
		}
		else {
			$row->linkToDB = "NONE";
		}
		
	/*	$P_idPathway= $row->id;
		// error_log($P_idPathway);
	
		$sqlB= "(SELECT DISTINCT Metabolite.id AS id FROM Metabolite, MetaboliteInBioSource, LeftParticipant, Reaction, ReactionInBioSource, ReactionInPathway 
				WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND LeftParticipant.idMetabolite = Metabolite.id 
					AND ReactionInBioSource.idBioSource = $P_idBioSource AND LeftParticipant.idReaction = Reaction.id 
					AND LeftParticipant.idReaction = Reaction.id AND Reaction.id = ReactionInBioSource.idReaction 
					AND ReactionInBioSource.id=ReactionInPathway.idReactionBioSource AND ReactionInPathway.idPathway = $P_idPathway) 
				UNION  
				(SELECT DISTINCT Metabolite.id AS id FROM Metabolite, MetaboliteInBioSource, RightParticipant, Reaction, ReactionInBioSource, ReactionInPathway 
				WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND RightParticipant.idMetabolite = Metabolite.id 
					AND ReactionInBioSource.idBioSource = $P_idBioSource AND RightParticipant.idReaction = Reaction.id 
					AND Reaction.id = ReactionInBioSource.idReaction AND ReactionInBioSource.id=ReactionInPathway.idReactionBioSource 
					AND ReactionInPathway.idPathway = $P_idPathway)";
		$resultMetab=mysql_query ($sqlB) or die (mysql_error ());
		// error_log($sqlB);
		$row->nbMetabolite = mysql_num_rows($resultMetab);*/
		$data [] = $row;
	}
//echo '({"total":"'.$totaldata.'","results":'.json_encode($data).'})';
	$response["success"] = true;
	$response["results"] = $data;
	
}
echo json_encode($response);
?>