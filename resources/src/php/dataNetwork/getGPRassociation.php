<?php
/**
 * Get GPR association for one reaction
 */

require_once '../database/connection.php';
require_once ('../user/userFunctions.php');
require_once '../biodata/biosource/bioSourceFunctions.php';

$P_idReaction = $_POST['idReaction'];
$P_dbIdReaction = $_POST['dbIdReaction'];
$P_nameReaction = $_POST['nameReaction'];
$P_ecReaction = $_POST['ecReaction'];
$P_idUser = getIdUser();


//Get idBioSource:
$sql = "SELECT BioSource.id AS idBioSource FROM BioSource, Reaction WHERE Reaction.id=$P_idReaction AND Reaction.idDB = BioSource.idDB";
$result = mysqli_query ( $link, $sql ) or die ('{success: false, message: "ERROR: please contact metexplore@toulouse.inra.fr. MESSAGE: error in mysql request n°0 in getting GPR association: '. mysql_error () .'"}' );
if ($row = mysqli_fetch_object ( $result )) {
	$idBioSource = $row->idBioSource;
}
else {
	die('{success: false, message: "ERROR: please contact metexplore@toulouse.inra.fr. MESSAGE: unable to get idBioSource while retrieving GPR association"}');
}

//Check rights if the BioSource is private:
if (getBioSourceStatus($idBioSource, $link) == "private") {
	$sql = "SELECT Status.status, BioSource.id AS idBioSource, Status.status AS access FROM Status, UserBioSource, Reaction, BioSource"
		   ." WHERE Reaction.id = $P_idReaction"
		   ." AND Reaction.idDB = BioSource.idDB"
		   ." AND BioSource.id = UserBioSource.idBioSource"
		   ." AND UserBioSource.idUser = $P_idUser"
		   ." AND UserBioSource.Acces = Status.idStatus";
	$result = mysqli_query ( $link, $sql ) or die ('{success: false, message: "ERROR: please contact metexplore@toulouse.inra.fr. MESSSAGE: error in mysql request n°0bis in getting GPR association: '. mysql_error () .'"}' );
	if ($row = mysqli_fetch_object ( $result )) {
		$idBioSource = $row->idBioSource;
	}
	else {
		die('{success: false, message:"GPR association: access denied!"}');
	}
}


//Initialize data:
$nodes = array("react_" . $P_idReaction); //Keep index of node in listnodes of config.graph below
$graph = array(
	"nodes" => array( array(
		"name" => $P_nameReaction . "[" . $P_ecReaction . "]",
		"identifier" => $P_dbIdReaction,
		"group" => "reaction",
		"main" => 1)),
	"links" => array(),
	"counts" => array(
		"enzymes" => 0,
		"genes" => 0,
		"proteins" => 0,
		"reactions" => 1
	)
);

//1. Get enzymes that catalyses the reaction:
$sqlEnz = "SELECT DISTINCT Enzyme.id AS id, Enzyme.dbIdentifier AS identifier, Enzyme.name AS name"
	   ." FROM Enzyme, EnzymeInBioSource, Catalyses, ReactionInBioSource"
	   ." WHERE  EnzymeInBioSource.idBioSource = $idBioSource"
	   ." AND Enzyme.id = EnzymeInBioSource.idEnzyme"
	   ." AND EnzymeInBioSource.id = Catalyses.idEnzymeInBioSource"
	   ." AND Catalyses.idReactionInBioSource= ReactionInBioSource.id"
	   ." AND ReactionInBioSource.idReaction = $P_idReaction";
$resultEnz = mysqli_query ( $link, $sqlEnz ) or die ('{success: false, message: "ERROR: please contact metexplore@toulouse.inra.fr. MESSSAGE: error in mysql request n°1 in getting GPR association: '. mysql_error () .'"}' );
$graph["counts"]["enzymes"] = mysqli_num_rows($resultEnz);

while ($enz = mysqli_fetch_object ( $resultEnz )) { //For each enzyme
	
	//2. Get linked proteins:
	$sqlProt = "SELECT DISTINCT Protein.id AS id, Protein.dbIdentifier AS identifier, Protein.name AS name"
		   ." FROM Protein, ProteinInBioSource, ProteinInEnzyme, EnzymeInBioSource"
		   ." WHERE  ProteinInBioSource.idBioSource = $idBioSource"
		   ." AND Protein.id = ProteinInBioSource.idProtein"
		   ." AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource"
		   ." AND ProteinInEnzyme.idEnzymeInBioSource = EnzymeInBioSource.id"
		   ." AND EnzymeInBioSource.idEnzyme = " . $enz->id;
	$resultProt = mysqli_query ( $link, $sqlProt ) or die ('{success: false, message: "ERROR: please contact metexplore@toulouse.inra.fr. MESSSAGE: error in mysql request n°2 in getting GPR association: '. mysql_error () .'"}' );
	$nbProts = mysqli_num_rows($resultProt);
	$idE = -1;
	if ($nbProts > 1) {
		//Add the enzyme to the node
		$idE = "enz_" . $enz->id;
		if (!in_array($idE, $nodes)) {
			array_push($nodes, $idE);
			array_push($graph['nodes'], array (
				"name" => $enz->name,
				"identifier" => $enz->identifier,
				"group" => "enzyme",
				"main" => 1,
				"id" => $enz->id
			));
		}
		$targetProts = array_search($idE, $nodes);
		array_push($graph['links'], array(
			"source" => $targetProts,
			"target" => 0
		));
	}
	else {
		//proteins will be linked to the reaction directly
		$targetProts = 0;
	}
	
	while ($prot = mysqli_fetch_object ( $resultProt )) { //For each protein
		$idP = "prot_" . $prot->id;
		if ($targetProts == 0) {//There is no enzyme complex
			$idE = $idP;
		}
		//Add protein to the graph:
		if (!in_array($idP, $nodes)) {
			$graph["counts"]["proteins"] ++;
			array_push($nodes, $idP);
			array_push($graph['nodes'], array (
				"name" => $prot->name,
				"identifier" => $prot->identifier,
				"group" => "protein",
				"main" => 1,
				"id" => $prot->id
			));
		}
		$targetGenes = array_search($idP, $nodes);
		array_push($graph['links'], array(
			"source" => $targetGenes,
			"target" => $targetProts
		));
		
		//3. Get linked Genes:
		$sqlGenes = "SELECT DISTINCT Gene.id AS id, Gene.dbIdentifier AS identifier, Gene.name AS name"
					." FROM Gene, GeneInBioSource, GeneCodesForProtein, ProteinInBioSource"
					." WHERE GeneInBioSource.idBioSource = $idBioSource"
					." AND Gene.id = GeneInBioSource.idGene"
					." AND GeneInBioSource.id = GeneCodesForProtein.idGeneInBioSource"
					." AND GeneCodesForProtein.idProteinInBioSource= ProteinInBioSource.id"
					." AND ProteinInBioSource.idProtein = " . $prot->id;
		$resultGenes = mysqli_query ( $link, $sqlGenes ) or die ('{success: false, message: "ERROR: please contact metexplore@toulouse.inra.fr. MESSSAGE: error in mysql request n°3 in getting GPR association: '. mysql_error () .'"}' );
		
		while ($gene = mysqli_fetch_object ( $resultGenes )) { //For each gene
			$idG = "gene_" . $gene->id;
			//Add gene to the graph:
			if (!in_array($idG, $nodes)) {
				$graph["counts"]["genes"] ++;
				array_push($nodes, $idG);
				array_push($graph['nodes'], array (
					"name" => $gene->name,
					"identifier" => $gene->identifier,
					"group" => "gene",
					"main" => 1,
					"id" => $gene->id
				));
			}
			array_push($graph['links'], array(
				"source" => array_search($idG, $nodes),
				"target" => $targetGenes
			));
		}
	}
	
	//4. Get other reactions catalyzed by the Enzyme:
	$sqlOReact = "SELECT DISTINCT Reaction.id AS id, Reaction.dbIdentifier AS identifier, Reaction.name AS name"
				 ." FROM Reaction, ReactionInBioSource, Catalyses, EnzymeInBioSource"
				 ." WHERE  Reaction.id = ReactionInBioSource.idReaction"
				 ." AND ReactionInBioSource.idBioSource = $idBioSource"
				 ." AND ReactionInBioSource.id = Catalyses.idReactionInBioSource"
				 ." AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id"
				 ." AND EnzymeInBioSource.idEnzyme = " . $enz->id
				 ." AND Reaction.id != $P_idReaction";
	$resultOReact = mysqli_query ( $link, $sqlOReact ) or die ('{success: false, message: "ERROR: please contact metexplore@toulouse.inra.fr. MESSSAGE: error in mysql request n°4 in getting GPR association: '. mysql_error () .'"}' );
	
	while ($react = mysqli_fetch_object ( $resultOReact )) { //For each gene
		$idR = "reaction_" . $react->id;
		//Add gene to the graph:
		if (!in_array($idR, $nodes)) {
			$graph["counts"]["reactions"] ++;
			array_push($nodes, $idR);
			array_push($graph['nodes'], array (
				"name" => $react->name,
				"identifier" => $react->identifier,
				"group" => "reaction",
				"main" => 0,
				"id" => $react->id
			));
		}
		array_push($graph['links'], array(
			"source" => array_search($idE, $nodes),
			"target" => array_search($idR, $nodes)
		));
	}
}

//Echo results:

$response = array(
	"success" => true,
	"graph" => $graph
);

echo json_encode($response);

?>