<?php
/*--------------------------------------------------------------------------------
 * recherche les pathways pour lesquels 1 des metabolites est present 
 *		execution requete  R_Pathway_ListidMetabolite avec param :listIdMetabolite
 * pour chaque pathway compter
 * 		nombre total de metabolite (et unique= si present en left et right =1
 * 		nombre de metabolites mappes dans ce pathway 
 */

$P_idBioSource=$_GET['idBioSource'];
$sql='R_Pathway_ListidMetabolite';
$P_Listid=$_GET['id'];

require_once '../database/connection.php';
require_once '../database/requete_sel.php';

$response["success"] = false;
$result=mysql_query ($$sql) or die (mysql_error ());

while ($row=mysql_fetch_object($result))
{
	$P_idPathway=$row->id;
	$sqlM="(SELECT DISTINCT RightParticipant.idMetabolite AS id 
			FROM RightParticipant, Reaction, ReactionInBioSource, ReactionInPathway 
			WHERE ReactionInBioSource.idBioSource = $P_idBioSource 
					AND RightParticipant.idReaction = Reaction.id 
					AND Reaction.id = ReactionInBioSource.idReaction 
					AND ReactionInBioSource.id=ReactionInPathway.idReactionBioSource 
					AND ReactionInPathway.idPathway = $P_idPathway)
	 		UNION
		   (SELECT DISTINCT LeftParticipant.idMetabolite AS id 
			FROM LeftParticipant, Reaction, ReactionInBioSource, ReactionInPathway 
			WHERE ReactionInBioSource.idBioSource = $P_idBioSource 
					AND LeftParticipant.idReaction = Reaction.id 
					AND Reaction.id = ReactionInBioSource.idReaction 
					AND ReactionInBioSource.id=ReactionInPathway.idReactionBioSource 
					AND ReactionInPathway.idPathway = $P_idPathway)";
	
	$resultMetabolite= mysql_query ($sqlM) or die (mysql_error ());
	
	
	$dataM = array();
	// for each metabolite in this pathway, get id.
	while ($rowM=mysql_fetch_object($resultMetabolite))
	{
		$dataM [] = $rowM->id;	
	}

	$P_Listid_array = array_map('strval', explode(',', $P_Listid));
	$intersect = array_intersect($dataM, $P_Listid_array);
	$lenghtintersect = sizeof($intersect);
	$lenghtPathway = sizeof($dataM);

	$coverage = round(($lenghtintersect * 100) / $lenghtPathway, 2);

	$pathwayCoverage["pathway"] = $P_idPathway;
	$pathwayCoverage["coverage"] = $coverage;
	$pathwayCoverage["nbMapped"] = $lenghtintersect;
	$pathwayCoverage["nb"] = $lenghtPathway;
	$data[] = $pathwayCoverage;
}

$response["success"]=true;
$response["data"]=$data;
echo json_encode($response);
?>