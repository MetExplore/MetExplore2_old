<?php 
// 
$element=$_POST['el'];

$sql="DEL_List$element"."_id";
$P_idList=$_POST['id'];
$P_idBioSource=$_POST['idBioSource'];

// require_once '../../../../../shared/php/database/connection.php';
// require_once '../../../../../shared/php/database/requete_delList.php';
require_once '../database/connection.php';
require_once '../database/requete_delList.php';
require_once '../userAndProject/addHistoryItem.php';
$currentUser=getIdUser();

if(getBioSourceRights($currentUser, $P_idBioSource, $link) == "denied"){
	echo '{"success":false}';
	return;
}

$escapedIds=array();

foreach(explode(", ",$P_idList) as $unEscapedid) {
	array_push($escapedIds, mysqli_real_escape_string ( $link , $unEscapedid ));
}
$P_idList=implode(", ", $escapedIds);


if ($element == "Pathway") {
	$ids = explode(", ",$P_idList);
	foreach($ids as $id) {
		if ($id != "") {
			$sqlSelect = "SELECT Pathway.dbIdentifier AS dbIdentifier, Pathway.name AS name, PathwayInBioSource.idBioSource AS idBioSource FROM Pathway, PathwayInBioSource WHERE Pathway.id='$id' AND Pathway.id = PathwayInBioSource.idPathway";
			$result = mysqli_query($link, $sqlSelect) or die('{success: false, message:"Error while retrieving dbIdentifiers of deleted pathways!"}');
			if ($row = mysqli_fetch_object($result)) {
				$action = array(
					"action" => "delete pathway",
					"dbIdentifier" => $row->dbIdentifier,
					"name" => $row->name,
					"id" => $id
				);
				addHistoryItem($row->idBioSource, getIdUser(), $action, $link);
			}
		}
	}
}
elseif ($element == "Metabolite") {
	// error_log("delete metabolite");
	$ids = explode(", ",$P_idList);
	foreach($ids as $id) {
		if ($id != "") {
			$sqlSelect = "SELECT Metabolite.dbIdentifier AS dbIdentifier, Metabolite.name AS name, Metabolite.chemicalFormula AS chemicalFormula, MetaboliteInBioSource.idBioSource AS idBioSource FROM Metabolite, MetaboliteInBioSource WHERE Metabolite.id='$id' AND Metabolite.id = MetaboliteInBioSource.idMetabolite";
			// error_log($sqlSelect);
			$result = mysqli_query($link, $sqlSelect) or die('{success: false, message:"Error while retrieving dbIdentifiers of deleted metabolites!"}');
			if ($row = mysqli_fetch_object($result)) {
				$action = array(
					"action" => "delete metabolite",
					"dbIdentifier" => $row->dbIdentifier,
					"name" => $row->name,
					"chemicalFormula" => $row->chemicalFormula,
					"id" => $id
				);
				addHistoryItem($row->idBioSource, getIdUser(), $action, $link);
			}
		}
	}
}
elseif ($element == "Enzyme") {
	$ids = explode(", ",$P_idList);
	foreach($ids as $id) {
		if ($id != "") {
			$sqlSelect = "SELECT Enzyme.dbIdentifier AS dbIdentifier, Enzyme.name AS name, EnzymeInBioSource.idBioSource AS idBioSource FROM Enzyme, EnzymeInBioSource WHERE Enzyme.id='$id' AND Enzyme.id = EnzymeInBioSource.idEnzyme";
			$result = mysqli_query($link, $sqlSelect) or die('{success: false, message:"Error while retrieving dbIdentifiers of deleted enzymes!"}');
			if ($row = mysqli_fetch_object($result)) {
				$action = array(
						"action" => "delete enzyme",
						"dbIdentifier" => $row->dbIdentifier,
						"name" => $row->name,
						"id" => $id
				);
				addHistoryItem($row->idBioSource, getIdUser(), $action, $link);
			}
		}
	}
}
elseif ($element == "Protein") {
	$ids = explode(", ",$P_idList);
	foreach($ids as $id) {
		if ($id != "") {
			$sqlSelect = "SELECT Protein.dbIdentifier AS dbIdentifier, Protein.name AS name, ProteinInBioSource.idBioSource AS idBioSource FROM Protein, ProteinInBioSource WHERE Protein.id='$id' AND Protein.id = ProteinInBioSource.idProtein";
			$result = mysqli_query($link, $sqlSelect) or die('{success: false, message:"Error while retrieving dbIdentifiers of deleted enzymes!"}');
			if ($row = mysqli_fetch_object($result)) {
				$action = array(
						"action" => "delete protein",
						"dbIdentifier" => $row->dbIdentifier,
						"name" => $row->name,
						"id" => $id
				);
				addHistoryItem($row->idBioSource, getIdUser(), $action, $link);
			}
		}
	}
}
elseif ($element == "Gene") {
	$ids = explode(", ",$P_idList);
	foreach($ids as $id) {
		if ($id != "") {
			$sqlSelect = "SELECT Gene.dbIdentifier AS dbIdentifier, Gene.name AS name, GeneInBioSource.idBioSource AS idBioSource FROM Gene, GeneInBioSource WHERE Gene.id='$id' AND Gene.id = GeneInBioSource.idGene";
			$result = mysqli_query($link, $sqlSelect) or die('{success: false, message:"Error while retrieving dbIdentifiers of deleted genes!"}');
			if ($row = mysqli_fetch_object($result)) {
				$action = array(
						"action" => "delete gene",
						"dbIdentifier" => $row->dbIdentifier,
						"name" => $row->name,
						"id" => $id
				);
				addHistoryItem($row->idBioSource, getIdUser(), $action, $link);
			}
		}
	}
}
elseif($element == "Compartment"){
	$sql="DEL_ListCompartInBioSource";
	$sqlSelect = "SELECT CompartmentInBioSource.idCompartmentInBioSource AS id, CompartmentInBioSource.identifier AS dbIdentifier,  Compartment.name AS name, CompartmentInBioSource.idBioSource AS idBioSource FROM Compartment, CompartmentInBioSource WHERE Compartment.idCompartment = CompartmentInBioSource.idCompartment AND CompartmentInBioSource.idCompartmentInBioSource IN ($P_idList);";
	$result = mysqli_query($link, $sqlSelect) or die('{success: false, message:"Error while retrieving dbIdentifiers of deleted genes!"}');
	while ($row = mysqli_fetch_object($result)) {
		$action = array(
				"action" => "delete compartment",
				"dbIdentifier" => $row->dbIdentifier,
				"name" => $row->name,
				"id" => $row->id
		);
		addHistoryItem($row->idBioSource, getIdUser(), $action, $link);
	}		
}

// error_log($$sql);

$result=mysqli_query ($link,$$sql) or die('{success: false, message:"Error in SQL statement: Impossible to delete selected ids."}');
mysqli_close($link);

?>