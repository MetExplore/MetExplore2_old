<?php 
/*Ajout d'une valeur limit pour affectation couleur (FV)*/
require_once '../database/connection.php';


$idBioSource=$_GET['idBioSource'];
$listReactions=$_GET['idReactions'];
$header = $_GET["header"];
$fileName = $_GET["filePath"];

$ppm= 0;
if(isset($_GET["ppm"])) {
	$ppm = $_GET["ppm"];
}

$fun = $_GET["fun"];


// echo "Header : $header\n";
// echo "List Reactions : $listReactions\n";
// echo "id BioSource : $idBioSource\n";
// echo "ppm : $ppm\n";

$selLeftReactions = "";
$selRightReactions="";

if(! $listReactions=="") {

	$selLeftReactions = " AND LeftParticipant.idReaction IN ($listReactions)";
	$selRightReactions = " AND RightParticipant.idReaction IN ($listReactions)";
	
	
}

$maxColumns = 20;

$file = fopen("$fileName", "r");

$headerPeaks = array();

$columns = array();

$n=0;

$total = 0;
$hitLines=0;

$hits = 0;

while ($buffer = fgets($file)) {

	$n++;
	
	if(strcmp(substr($buffer, 0, 1), "#") != 0) {

		$buffer = 	rtrim($buffer);
			
		$tab = explode("\t", $buffer);
			
		if($n == 1 && $header == "true") {

			$headerPeaks = preg_replace('@[^a-zA-Z0-9_]@', '_', $tab);
			
			array_shift($headerPeaks);
			
			$noColumns = count($tab);
				
			for($i = 1; $i<$noColumns;$i++) {
				$columns[$i-1] = array();
				$columns[$i-1]["id"] = $headerPeaks[$i-1];
				$columns[$i-1]["type"] = "number";
				$columns[$i-1]["limit"] = "0";				
				$columns[$i-1]["values"] = array();
			}
			/* Ajout FV
			 * determination de la limit pour affichage couleur
			 */
			$columns[0]["limit"] = "1000";
			$columns[1]["limit"] = "3000000";
			$columns[2]["limit"] = "3000000";
			
			if($noColumns > $maxColumns) {
				echo '{
				"success":false,
				"message":"The number of columns is too large, sorry ! (size limit : '.$maxColumns.')"
			}';
				return;
			}
		}
		else if($n == 1 && $header == "false") {

			$noColumns = count($tab);

			if($noColumns > $maxColumns) {
				echo '{
				"success":false,
				"message":"The number of columns is too large, sorry ! (size limit : '.$maxColumns.')"
			}';
				return;
			}
				
			for($i = 1; $i<$noColumns; $i++) {
				$conditionName = "Col".$i;
				array_push($headerPeaks,"Col".$i);
				$columns[$i-1]["id"] = $conditionName;
				$columns[$i-1]["type"] = "number";
				$columns[$i-1]["values"] = array();
			}
		}
		
		if($n > 1 || ($n == 1 && $header == "false")) {
			
			$total++;
				
			$noColumns = count($tab);
				
			if($noColumns != count($headerPeaks)+1) {
				echo '{
				"success":false,
				"message":"Line '.$n.' : column number does not correspond to the column number of the header"
			}';
				return;
			}
				
			$identifier = $tab[0];

			$req = "";
			
			if($fun=="mapIdentifiers") {
				
			$reqLeft = "SELECT id FROM Metabolite, MetaboliteInBioSource, LeftParticipant WHERE Metabolite.dbIdentifier REGEXP '^".$identifier."(_IN_.*)*$' AND Metabolite.id=MetaboliteInBioSource.idMetabolite AND LeftParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource='".$idBioSource."' ".$selLeftReactions;
			$reqRight = "SELECT id FROM Metabolite, MetaboliteInBioSource, RightParticipant WHERE Metabolite.dbIdentifier REGEXP '^".$identifier."(_IN_.*)*$' AND Metabolite.id=MetaboliteInBioSource.idMetabolite AND RightParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource='".$idBioSource."' ".$selRightReactions;
			$req = "$reqLeft UNION $reqRight";
			
			}
			else if($fun=="mapNames") {
				$reqLeft = "SELECT id FROM Metabolite, MetaboliteInBioSource, LeftParticipant WHERE Metabolite.name REGEXP '^$identifier$' AND Metabolite.id=MetaboliteInBioSource.idMetabolite AND LeftParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource='".$idBioSource."' ".$selLeftReactions;
				$reqRight = "SELECT id FROM Metabolite, MetaboliteInBioSource, RightParticipant WHERE Metabolite.name REGEXP '^$identifier$' AND Metabolite.id=MetaboliteInBioSource.idMetabolite AND RightParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource='".$idBioSource."' ".$selRightReactions;
				$req = "$reqLeft UNION $reqRight";
			}
			else if($fun == "mapMasses") {
				$mass = $identifier;
				$marge = $mass * $ppm / 1000000;
				
				$massTestInf = $mass - $marge;
				$massTestSup = $mass + $marge;
				
				$reqLeft = "SELECT id FROM Metabolite, MetaboliteInBioSource, LeftParticipant WHERE weight>=$massTestInf AND weight<=$massTestSup AND Metabolite.id=MetaboliteInBioSource.idMetabolite AND LeftParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource='".$idBioSource."' ".$selLeftReactions;
				$reqRight = "SELECT id FROM Metabolite, MetaboliteInBioSource, RightParticipant WHERE weight>=$massTestInf AND weight<=$massTestSup AND Metabolite.id=MetaboliteInBioSource.idMetabolite AND RightParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource='".$idBioSource."' ".$selRightReactions;
				$req = "$reqLeft UNION $reqRight";
			}
			else if($fun == "mapGeneNamesOnReactions") {
				
				$req = "SELECT DISTINCT ReactionInBioSource.id AS idInBio, Reaction.id AS id, Reaction.name AS name, Reaction.ec AS ec, Reaction.dbIdentifier AS dbIdentifier, ReactionInBioSource.reversible AS reversible, ReactionInBioSource.hole AS hole, ReactionInBioSource.upperBound AS upperBound, ReactionInBioSource.lowerBound AS lowerBound FROM Reaction, ReactionInBioSource, Catalyses, EnzymeInBioSource, ProteinInEnzyme, ProteinInBioSource, GeneCodesForProtein, GeneInBioSource, Gene WHERE  Gene.id = GeneInBioSource.idGene AND Reaction.id = ReactionInBioSource.idReaction AND ReactionInBioSource.idBioSource = $idBioSource AND ReactionInBioSource.id = Catalyses.idReactionInBioSource AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND GeneCodesForProtein.idProteinInBioSource = ProteinInBioSource.id AND GeneCodesForProtein.idGeneInBioSource = GeneInBioSource.id AND Gene.name COLLATE UTF8_GENERAL_CI LIKE '%$identifier%'";
			}	
				
			$result=mysql_query ($req);
				
			if($result == false ) {
				
				echo '{
				"success":false,
				"message":"Error in database access"
				}';
				return;
			}
			
			if(mysql_numrows($result) > 0) {
				$hitLines++;
			}
			
			while ($row=mysql_fetch_object($result))
			{
				$idMetabolite = $row->id;
				
				$hits++;
				
				for($i = 1; $i<$noColumns; $i++) {
					array_push($columns[$i-1]["values"], array("id" => $idMetabolite, "value" => $tab[$i]));
				}
			}
		}
	}
}


fclose($file);

$res = array();
$res["success"] = "true";
$res["total"] = $total;
$res["hits"] = $hits;
$res["hitLines"] = $hitLines;
$res["columns"] = $columns;

echo json_encode($res);

// echo '{
// "success":true,
// "columns":[
// {
// "id":"col1",
// "type":"float",
// "values": [
// {id:"215499", value:"2.0"},
// {id:"215513", value:"3.0"}
// ]
// },
// {
// "id":"col2",
// "type":"float",
// "values": [
// {id:"215499", value:"4.5"},
// {id:"215513", value:"300.0"}
// ]
// }
// ]
// }';
?>