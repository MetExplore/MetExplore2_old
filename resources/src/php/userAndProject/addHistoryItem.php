<?php

require_once ('../config/server_variables.php');
require_once ('../user/userFunctions.php');

/**
 * Add action to the History
 * @param unknown $idbiosource
 * @param unknown $idUser
 * @param string $action
 * @param string $link
 */
function addHistoryItem($idbiosource, $idUser, $action, $link) {
	//Add log in history table
	$desc = "";
	$filename = "";
	$detailsTxt = "";
	//Add BioSource to MetExplore :
	if ($action['action'] == "add biosource") {
		$desc = "Add BioSource to MetExplore.";
		$res = formatDataInTableFile($action['data'], null, "biosource", $idbiosource, $idbiosource, "Add new");
		$filename = $res["filename"];
		$detailsTxt = $res["detailsTxt"];
	}
	//Add User to existing BioSource :
	elseif ($action['action'] == "add user to biosource") {
		$iduseradd = mysqli_real_escape_string ( $link , $action['iduser']);
		$sql = "SELECT name FROM UserMet WHERE id=$iduseradd";
		$result = mysqli_query ( $link, $sql ) ;
		if(!$result) { return('{success: false, message: "History: Error in SQL request n°1"}');}
		if ($row = mysqli_fetch_object($result)) {
			$useradd = $row->name;
			$desc = "Add user $useradd to BioSource.";
		}
	}
	//Add Biblio ref to existing BioSource :
	elseif($action['action'] == "add biblio") {
		$title = $action['title'];
		$authors = $action['authors'];
		$year = $action['year'];
		$desc = "Add Reference \"$title ($authors, $year)\"";
	}
	//Update reaction in grid:
	elseif($action['action'] == "update reaction") {
		$desc = 'Update reaction "' . $action['dbIdentifier'] . '": set ' . $action['field'] . " = " . $action['value'];
	}
	//Add reaction with form:
	elseif($action['action'] == "add reaction form") {
		$desc = "Add reaction " . $action['dbIdentifier'];
		//Write details to a file:
		//Prepare data:
		$res = formatDataInTableFile($action['data'], null, "reaction", $idbiosource, $action["idReaction"], "Add new");
		$filename = $res["filename"];
		$detailsTxt = $res["detailsTxt"];
		
	}
	//Update reaction with form:
	elseif($action['action'] == "update reaction form") {
		$desc = "Update reaction " . $action['dbIdentifier'];
		//Write details to a file:
		//Prepare data:
		$res = formatDataInTableFile($action['dataNew'], $action['dataOld'], "reaction", $idbiosource, $action["idReaction"], "Update");
		$filename = $res["filename"];
		$detailsTxt = $res["detailsTxt"];
	}
	//Add metabolites to reaction:
	elseif($action['action'] == "add metabolites to reaction") {
		$lMetabolites = $action['lMetabolites'];
		$rMetabolites = $action['rMetabolites'];
		$desc = "Add " . strval(count($lMetabolites) + count($rMetabolites)) . " metabolites to reaction " . $action['dbIdentifier'];
		$lMetabolites_list = count($lMetabolites) > 0 ? implode(",", array_keys($lMetabolites)) : "NULL";
		$rMetabolites_list = count($rMetabolites) > 0 ? implode(",", array_keys($rMetabolites)) : "NULL";
		$sqlSubstrates = "SELECT 'substrate' AS type, id, name, chemicalFormula, dbIdentifier FROM Metabolite WHERE id IN ($lMetabolites_list)";
		$sqlProducts = "SELECT 'product' AS type, id, name, chemicalFormula, dbIdentifier FROM Metabolite WHERE id IN ($rMetabolites_list)";
		$sql = $sqlSubstrates . " UNION " . $sqlProducts;
		$result = mysqli_query ( $link, $sql ) ;
		if(!$result) { return('{success: false, message: "History: Error in SQL request n°2"}'); }
		$detailsTxt = "date\taction\told/new\tSubstrate/product\tId\tIdentifier\tName\tChemical formula\tcoeff\tsideCompound\n";
		while ($row = mysqli_fetch_object($result)) {
			$idMetabolite = $row->id;
			$detailsTxt .= date("Y-m-d") . "\tAdd metabolites to reaction " . $action["dbIdentifier"] . "\tnew\t";
			$detailsTxt .= $row->type . "\t" . $idMetabolite . "\t" . $row->dbIdentifier . "\t" . $row->name . "\t" . $row->chemicalFormula . "\t";
			if ($row->type == "substrate") {
				$detailsTxt .= $lMetabolites[$idMetabolite]['coeff'] .  "\t"
							   . $lMetabolites[$idMetabolite]['side'] .  "\n";
			}
			elseif ($row->type == "product") {
				$detailsTxt .= $rMetabolites[$idMetabolite]['coeff'] . "\t" . "\t"
						. $rMetabolites[$idMetabolite]['side'] . "\t" . "\n";
			}
			else {
				$detailsTxt .= "\t\t\t\n";
			}
		}
		$filename = getSaveFileName($idbiosource, $action["idReaction"], "reaction");
	}
	//Update metabolites on reaction:
	elseif($action['action'] == "update metabolites on reaction") {
		$lMetabolites = $action['lMetabolites'];
		$rMetabolites = $action['rMetabolites'];
		$desc = "Update " . strval(count($lMetabolites) + count($rMetabolites)) . " metabolites on reaction " . $action['dbIdentifier'];
		$lMetabolites_list = count($lMetabolites) > 0 ? implode(",", array_keys($lMetabolites)) : "NULL";
		$rMetabolites_list = count($rMetabolites) > 0 ? implode(",", array_keys($rMetabolites)) : "NULL";
		$sqlSubstrates = "SELECT 'substrate' AS type, id, name, chemicalFormula, dbIdentifier FROM Metabolite WHERE id IN ($lMetabolites_list)";
		$sqlProducts = "SELECT 'product' AS type, id, name, chemicalFormula, dbIdentifier FROM Metabolite WHERE id IN ($rMetabolites_list)";
		$sql = $sqlSubstrates . " UNION " . $sqlProducts;
		$result = mysqli_query ( $link, $sql );
		if (!$result) ('{success: false, message: "History: Error in SQL request n°3"}');
		$detailsTxt = "date\taction\told/new\tSubstrate/product\tId\tIdentifier\tName\tChemical formula\tcoeff\tsideCompound\n";
		while ($row = mysqli_fetch_object($result)) {
			$idMetabolite = $row->id;
			
			//Old values:
			$detailsTxt .= date("Y-m-d") . "\tUpdate metabolites on reaction " . $action["dbIdentifier"] . "\told\t";
			$detailsTxt .= $row->type . "\t" . $idMetabolite . "\t" . $row->dbIdentifier . "\t" . $row->name . "\t" . $row->chemicalFormula . "\t";
			if ($row->type == "substrate") {
				$detailsTxt .= $lMetabolites[$idMetabolite]['old']['coeff'] . "\t" . $lMetabolites[$idMetabolite]['old']['side'] .  "\n";
			}
			elseif ($row->type == "product") {
				$detailsTxt .= $rMetabolites[$idMetabolite]['old']['coeff'] .  "\t"
						. $rMetabolites[$idMetabolite]['old']['side'] .  "\n";
			}
			else {
				$detailsTxt .= "\t\t\t\n";
			}			
			
			//New values:
			$detailsTxt .= date("Y-m-d") . "\tUpdate metabolites on reaction " . $action["dbIdentifier"] . "\tnew\t";
			$detailsTxt .= $row->type . "\t" . $idMetabolite . "\t" . $row->dbIdentifier . "\t" . $row->name . "\t" . $row->chemicalFormula . "\t";
			if ($row->type == "substrate") {
				$detailsTxt .= $lMetabolites[$idMetabolite]['new']['coeff'] . "\t"
						. $lMetabolites[$idMetabolite]['new']['side'] .  "\n";
			}
			elseif ($row->type == "product") {
				$detailsTxt .= $rMetabolites[$idMetabolite]['new']['coeff'] . "\t"
						. $rMetabolites[$idMetabolite]['new']['side'] .  "\n";
			}
			else {
				$detailsTxt .= "\t\t\t\n";
			}
		}
		$filename = getSaveFileName($idbiosource, $action["idReaction"], "reaction");
	}
	//Delete metabolites from reaction:
	elseif($action['action'] == "delete metabolites from reaction") {
		$lMetabolites = $action['lMetabolites'];
		$rMetabolites = $action['rMetabolites'];
		$desc = "Remove " . strval(count($lMetabolites) + count($rMetabolites)) . " metabolites from reaction " . $action['dbIdentifier'];
		$lMetabolites_list = count($lMetabolites) > 0 ? implode(",", array_keys($lMetabolites)) : "NULL";
		$rMetabolites_list = count($rMetabolites) > 0 ? implode(",", array_keys($rMetabolites)) : "NULL";
		$sqlSubstrates = "SELECT 'substrate' AS type, id, name, chemicalFormula, dbIdentifier FROM Metabolite WHERE id IN ($lMetabolites_list)";
		$sqlProducts = "SELECT 'product' AS type, id, name, chemicalFormula, dbIdentifier FROM Metabolite WHERE id IN ($rMetabolites_list)";
		$sql = $sqlSubstrates . " UNION " . $sqlProducts;
		$result = mysqli_query ( $link, $sql ) ; 
		if(!$result) return('{success: false, message: "History: Error in SQL request n°4"}');
		$detailsTxt = "date\taction\told/new\tSubstrate/product\tId\tIdentifier\tName\tChemical formula\tcoeff\tsideCompound\tconstantCoef\n";
		while ($row = mysqli_fetch_object($result)) {
			$idMetabolite = $row->id;
			$detailsTxt .= date("Y-m-d") . "\tRemove metabolites from reaction " . $action["dbIdentifier"] . "\told\t";
			$detailsTxt .= $row->type . "\t" . $idMetabolite . "\t" . $row->dbIdentifier . "\t" . $row->name . "\t" . $row->chemicalFormula . "\t";
			if ($row->type == "substrate") {
				$detailsTxt .= $lMetabolites[$idMetabolite]['coeff'] .  "\t"
						. $lMetabolites[$idMetabolite]['side'] .  "\n";
			}
			elseif ($row->type == "product") {
				$detailsTxt .= $rMetabolites[$idMetabolite]['coeff'] .  "\t"
						. $rMetabolites[$idMetabolite]['side'] .  "\n";
			}
			else {
				$detailsTxt .= "\t\t\t\n";
			}
		}
		$filename = getSaveFileName($idbiosource, $action["idReaction"], "reaction");
	}
	//Add enzymes to reaction:
	elseif($action['action'] == "add enzymes to reaction") {
		$enzymes = $action['enzymes'];
		$desc = "Add " . strval(count($enzymes)) . " enzymes to reaction " . $action['dbIdentifier'];
		$enzymes_list = implode(",", $enzymes);
		$sql = "SELECT Enzyme.id AS id, Enzyme.name AS name, Enzyme.dbIdentifier AS dbIdentifier FROM Enzyme, EnzymeInBioSource"
			   ." WHERE EnzymeInBioSource.id IN ($enzymes_list)"
			   ." AND EnzymeInBioSource.idEnzyme = Enzyme.id";
		$result = mysqli_query ( $link, $sql ) ;
		if(!$result) return('{success: false, message: "History: Error in SQL request n°5"}');
		$detailsTxt = "date\taction\told/new\tId\tIdentifier\tName\n";
		while ($row = mysqli_fetch_object($result)) {
			$detailsTxt .= date("Y-m-d") . "\tAdd enzymes to reaction " . $action["dbIdentifier"] . "\tnew\t";
			$detailsTxt .= $row->id . "\t" . $row->dbIdentifier . "\t" . $row->name . "\n";
		}
		$filename = getSaveFileName($idbiosource, $action["idReaction"], "reaction");
	}
	//Delete enzymes from reaction:
	elseif($action['action'] == "delete enzymes from reaction") {
		$enzymes = $action['enzymes'];
		$desc = "Delete " . strval(count($enzymes)) . " enzymes from reaction " . $action['dbIdentifier'];
		$enzymes_list = implode(",", $enzymes);
		$sql = "SELECT Enzyme.id AS id, Enzyme.name AS name, Enzyme.dbIdentifier AS dbIdentifier FROM Enzyme, EnzymeInBioSource"
				." WHERE EnzymeInBioSource.id IN ($enzymes_list)"
				." AND EnzymeInBioSource.idEnzyme = Enzyme.id";
		$result = mysqli_query ( $link, $sql ) ;
		if(!$result) return('{success: false, message: "History: Error in SQL request n°6"}');
		$detailsTxt = "date\taction\told/new\tId\tIdentifier\tName\n";
		while ($row = mysqli_fetch_object($result)) {
			$detailsTxt .= date("Y-m-d") . "\tDelete enzymes from reaction " . $action["dbIdentifier"] . "\told\t";
			$detailsTxt .= $row->id . "\t" . $row->dbIdentifier . "\t" . $row->name . "\n";
		}
		$filename = getSaveFileName($idbiosource, $action["idReaction"], "reaction");
	}
	//Add reaction to pathways:
	elseif($action['action'] == "add reaction to pathways") {
		$pathways = $action['pathways'];
		$desc = "Add reaction " . $action['dbIdentifier'] . " to " . strval(count($pathways)) . " pathways";
		$pathways_list = implode(",", $pathways);
		$sql = "SELECT Pathway.id AS id, Pathway.name AS name, Pathway.dbIdentifier AS dbIdentifier FROM Pathway"
			   ." WHERE Pathway.id IN ($pathways_list)";
		$result = mysqli_query ( $link, $sql ) ;
		if(!$result) return('{success: false, message: "History: Error in SQL request n°7"}');
		$detailsTxt = "date\taction\told/new\tId\tIdentifier\tName\n";
		while ($row = mysqli_fetch_object($result)) {
			$detailsTxt .= date("Y-m-d") . "\tAdd reaction " . $action["dbIdentifier"] . " to pathways" . "\tnew\t";
			$detailsTxt .= $row->id . "\t" . $row->dbIdentifier . "\t" . $row->name . "\n";
		}
		$filename = getSaveFileName($idbiosource, $action["idReaction"], "reaction");
	}
	//Delete reaction from pathways:
	elseif($action['action'] == "delete reaction from pathways") {
		$pathways = $action['pathways'];
		$desc = "Remove reaction " . $action['dbIdentifier'] . " from " . strval(count($pathways)) . " pathways";
		$pathways_list = implode(",", $pathways);
		$sql = "SELECT Pathway.id AS id, Pathway.name AS name, Pathway.dbIdentifier AS dbIdentifier FROM Pathway"
				." WHERE Pathway.id IN ($pathways_list)";
				$result = mysqli_query ( $link, $sql ) ;
				if(!$result) return('{success: false, message: "History: Error in SQL request n°8"}');
				$detailsTxt = "date\taction\told/new\tId\tIdentifier\tName\n";
				while ($row = mysqli_fetch_object($result)) {
					$detailsTxt .= date("Y-m-d") . "\tRemove reaction " . $action["dbIdentifier"] . " from pathways" . "\told\t";
					$detailsTxt .= $row->id . "\t" . $row->dbIdentifier . "\t" . $row->name . "\n";
				}
		$filename = getSaveFileName($idbiosource, $action["idReaction"], "reaction");
	}
	//Delete reaction:
	elseif($action['action'] == "delete reaction") {
		$desc = "Remove reaction " . $action['dbIdentifier'];
		$fields = array('id', 'dbIdentifier', 'name', 'EC');
		$dataOld = array();
		foreach($fields as $field) {
			$dataOld[$field] = $action[$field];
		}
		$res = formatDataInTableFile(null, $dataOld, "reaction", $idbiosource, $action["id"], "Remove");
		$filename = $res["filename"];
		$detailsTxt = $res["detailsTxt"];
	}
	//Add pathway with form:
	elseif($action['action'] == "add pathway") {
		$desc = "Add pathway " . $action['dbIdentifier'];
		//Write details to a file:
		//Prepare data:
		$res = formatDataInTableFile($action['data'], null, "pathway", $idbiosource, $action["idPathway"], "Add new");
		$filename = $res["filename"];
		$detailsTxt = $res["detailsTxt"];
	}
	//Add reactions to pathway:
	elseif($action["action"] == "add reactions to pathway") {
		$reactionsInBs = $action['reactionsInBs'];
		$desc = "Add " . strval(count($reactionsInBs)) . " reactions to pathway " . $action["dbIdentifier"];
		$reactionsInBs_list = implode(",",$reactionsInBs);
		$sql = "SELECT Reaction.name AS name, Reaction.id AS id, Reaction.dbIdentifier AS dbIdentifier, Reaction.ec AS ec FROM Reaction, ReactionInBioSource"
			   ." WHERE ReactionInBioSource.id IN ($reactionsInBs_list)"
			   ." AND ReactionInBioSource.idReaction = Reaction.id";
		$result = mysqli_query ( $link, $sql ) ;
		if(!$result) return('{success: false, message: "History: Error in SQL request n°9"}');
		$detailsTxt = "date\taction\told/new\tId\tIdentifier\tName\tEC number\n";
		while ($row = mysqli_fetch_object($result)) {
			$detailsTxt .= date("Y-m-d") . "\tAdd reactions to pathway " . $action["dbIdentifier"] . "\tnew\t";
			$detailsTxt .= $row->id . "\t" . $row->dbIdentifier . "\t" . $row->name . "\t" . $row->ec . "\n";
		}
		$filename = getSaveFileName($idbiosource, $action["idPathway"], "pathway");
	}
	//Delete reactions from pathway:
	elseif($action["action"] == "delete reactions from pathway") {
		$reactionsInBs = $action['reactionsInBs'];
		$desc = "Remove " . strval(count($reactionsInBs)) . " reactions from pathway " . $action["dbIdentifier"];
		$reactionsInBs_list = implode(",",$reactionsInBs);
		$sql = "SELECT Reaction.name AS name, Reaction.id AS id, Reaction.dbIdentifier AS dbIdentifier, Reaction.ec AS ec FROM Reaction, ReactionInBioSource"
				." WHERE ReactionInBioSource.id IN ($reactionsInBs_list)"
				." AND ReactionInBioSource.idReaction = Reaction.id";
		$result = mysqli_query ( $link, $sql ) ;
		if(!$result) return('{success: false, message: "History: Error in SQL request n°10"}');
		$detailsTxt = "date\taction\told/new\tId\tIdentifier\tName\tEC number\n";
		while ($row = mysqli_fetch_object($result)) {
			$detailsTxt .= date("Y-m-d") . "\tRemove reactions from pathway " . $action["dbIdentifier"] . "\told\t";
			$detailsTxt .= $row->id . "\t" . $row->dbIdentifier . "\t" . $row->name . "\t" . $row->ec . "\n";
		}
		$filename = getSaveFileName($idbiosource, $action["idPathway"], "pathway");
	}
	//Add pathway to superPathways:
	elseif ($action['action'] == "add pathway to superPathways") {
		$superPathways = $action["superPathways"];
		$desc = "Add pathway " . $action["dbIdentifier"] . " to " . strval(count($superPathways)) . " super pathway(s)";
		$superPathways_list = implode(",", $superPathways);
		$sql = "SELECT id, name, dbIdentifier FROM Pathway WHERE id IN ($superPathways_list)";
		$result = mysqli_query ( $link, $sql ) ;
		if(!$result) return('{success: false, message: "History: Error in SQL request n°11"}');
		$detailsTxt = "date\taction\told/new\tId\tIdentifier\tName\n";
		while ($row = mysqli_fetch_object($result)) {
			$detailsTxt .= date("Y-m-d") . "\tAdd pathway " . $action["dbIdentifier"] . " to super pathway(s)\tnew\t";
			$detailsTxt .= $row->id . "\t" . $row->dbIdentifier . "\t" . $row->name . "\n";
		}
		$filename = getSaveFileName($idbiosource, $action["idPathway"], "pathway");
	}
	//Delete pathway from superPathways:
	elseif ($action['action'] == "delete pathway from superPathways") {
		$superPathways = $action["superPathways"];
		$desc = "Remove pathway " . $action["dbIdentifier"] . " from " . strval(count($superPathways)) . " super pathway(s)";
		$superPathways_list = implode(",", $superPathways);
		$sql = "SELECT id, name, dbIdentifier FROM Pathway WHERE id IN ($superPathways_list)";
		$result = mysqli_query ( $link, $sql ) ;
		if(!$result) return('{success: false, message: "History: Error in SQL request n°12"}');
		$detailsTxt = "date\taction\told/new\tId\tIdentifier\tName\n";
		while ($row = mysqli_fetch_object($result)) {
			$detailsTxt .= date("Y-m-d") . "\tRemove pathway " . $action["dbIdentifier"] . " from super pathway(s)\told\t";
			$detailsTxt .= $row->id . "\t" . $row->dbIdentifier . "\t" . $row->name . "\n";
		}
		$filename = getSaveFileName($idbiosource, $action["idPathway"], "pathway");
	}
	//Delete pathway:
	elseif($action["action"] == "delete pathway") {
		$desc = "Remove pathway " . $action["dbIdentifier"];
		$fields = array('id', 'dbIdentifier', 'name');
		$dataOld = array();
		foreach($fields as $field) {
			$dataOld[$field] = $action[$field];
		}
		$res = formatDataInTableFile(null, $dataOld, "pathway", $idbiosource, $action["id"], "Remove");
		$filename = $res["filename"];
		$detailsTxt = $res["detailsTxt"];
	}
	//Update pathway with form:
	elseif($action["action"] == "update pathway form") {
		$desc = 'Update pathway "' . $action['dbIdentifier'] . '"';
		//Write details to a file:
		//Prepare data:
		$res = formatDataInTableFile($action['dataNew'], $action['dataOld'], "pathway", $idbiosource, $action["idPathway"], "Update");
		$filename = $res["filename"];
		$detailsTxt = $res["detailsTxt"];
	}
	//Update metabolite in grid:
	elseif($action['action'] == "update metabolite") {
		$desc = 'Update metabolite "' . $action['dbIdentifier'] . '": set ' . $action['field'] . " = " . $action['value'];
	}
	//Add metabolite with form:
	elseif($action['action'] == "add metabolite") {
		$sql = "SELECT Compartment.name AS nameCompartment FROM Compartment, CompartmentInBioSource"
			   ." WHERE CompartmentInBioSource.idCompartmentInBioSource = " . $action['idCompartment']
			   ." AND CompartmentInBioSource.idCompartment = Compartment.idCompartment";
		$result = mysqli_query ( $link, $sql ) ;
		if(!$result) return('{success: false, message: "History: Error in SQL request n°13"}');
		if ($row = mysqli_fetch_object($result)) {
			$desc = "Add metabolite " . $action['dbIdentifier'] . " in compartment " . $row->nameCompartment;
			//Write details to a file:
			//Prepare data:
			$res = formatDataInTableFile($action['data'], null, "metabolite", $idbiosource, $action["idMetabolite"], "Add new");
			$filename = $res["filename"];
			$detailsTxt = $res["detailsTxt"];
		}
		else {
			die('{success: false, message: "History: Error: no row in getting name of compartment"}');
		}
	}
	//Delete metabolite:
	elseif($action["action"] == "delete metabolite") {
		$desc = "Remove metabolite " . $action["dbIdentifier"];
		$fields = array('id', 'dbIdentifier', 'name', 'chemicalFormula');
		$dataOld = array();
		foreach($fields as $field) {
			$dataOld[$field] = $action[$field];
		}
		$res = formatDataInTableFile(null, $dataOld, "metabolite", $idbiosource, $action["id"], "Remove");
		$filename = $res["filename"];
		$detailsTxt = $res["detailsTxt"];
	}
	//Update metabolites with form:
	elseif($action["action"] == "update metabolite form") {
		$desc = 'Update metabolite "' . $action['dbIdentifier'] . '"';
		//Write details to a file:
		//Prepare data:
		$res = formatDataInTableFile($action['data'], $action['dataOld'], "metabolite", $idbiosource, $action["idMetabolite"], "Update");
		$filename = $res["filename"];
		$detailsTxt = $res["detailsTxt"];
	}
	//Add enzyme with form:
	elseif($action['action'] == "add enzyme form") {
		$sql = "SELECT Compartment.name AS nameCompartment FROM Compartment, CompartmentInBioSource"
			   ." WHERE CompartmentInBioSource.idCompartmentInBioSource = " . $action['idCompartment']
			   ." AND CompartmentInBioSource.idCompartment = Compartment.idCompartment";
		$result = mysqli_query ( $link, $sql );
		if(!$result) return('{success: false, message: "History: Error in SQL request n°14"}');
		if ($row = mysqli_fetch_object($result)) {
			$desc = "Add enzyme " . $action['dbIdentifier'] . " in compartment " . $row->nameCompartment;
			//Write details to a file:
			//Prepare data:
			$res = formatDataInTableFile($action['data'], null, "enzyme", $idbiosource, $action["idEnzyme"], "Add new");
			$filename = $res["filename"];
			$detailsTxt = $res["detailsTxt"];
		}
		else {
			die('{success: false, message: "History: Error: no row in getting name of compartment"}');
		}
	}
	//Update enzyme with form:
	elseif($action['action'] == "update enzyme form") {
		$sql = "SELECT Compartment.name AS nameCompartment FROM Compartment, CompartmentInBioSource"
				." WHERE CompartmentInBioSource.idCompartmentInBioSource = " . $action['idCompartment']
				." AND CompartmentInBioSource.idCompartment = Compartment.idCompartment";
		$result = mysqli_query ( $link, $sql );
		if(!$result) return('{success: false, message: "History: Error in SQL request n°15"}');
		if ($row = mysqli_fetch_object($result)) {
			$desc = "Update enzyme " . $action['dbIdentifier'] . " in compartment " . $row->nameCompartment;
			//Write details to a file:
			//Prepare data:
			$res = formatDataInTableFile($action['dataNew'], $action['dataOld'], "enzyme", $idbiosource, $action["idEnzyme"], "Update");
			$filename = $res["filename"];
			$detailsTxt = $res["detailsTxt"];
		}
		else {
			die('{success: false, message: "History: Error: no row in getting name of compartment"}');
		}
	}
	//Add proteins to enzyme:
	elseif($action['action'] == "add proteins to enzyme") {
		$proteins = $action['proteins'];
		$desc = "Add " . strval(count($proteins)) . " proteins to enzyme " . $action["dbIdentifier"];
		$proteins_list = implode(",",$proteins);
		$sql = "SELECT Protein.name AS name, Protein.id AS id, Protein.dbIdentifier AS dbIdentifier FROM Protein, ProteinInBioSource"
				." WHERE ProteinInBioSource.id IN ($proteins_list)"
				." AND ProteinInBioSource.idProtein = Protein.id";
		$result = mysqli_query ( $link, $sql );
		if(!$result) return('{success: false, message: "History: Error in SQL request n°16"}');
		$detailsTxt = "date\taction\told/new\tId\tIdentifier\tName\n";
		while ($row = mysqli_fetch_object($result)) {
			$detailsTxt .= date("Y-m-d") . "\tAdd proteins to enzyme " . $action["dbIdentifier"] . "\tnew\t";
			$detailsTxt .= $row->id . "\t" . $row->dbIdentifier . "\t" . $row->name . "\n";
		}
		$filename = getSaveFileName($idbiosource, $action["idEnzyme"], "enzyme");
	}
	//Delete proteins from enzyme:
	elseif($action['action'] == "delete proteins from enzyme") {
		$proteins = $action['proteins'];
		$desc = "Delete " . strval(count($proteins)) . " proteins from enzyme " . $action["dbIdentifier"];
		$proteins_list = implode(",",$proteins);
		$sql = "SELECT Protein.name AS name, Protein.id AS id, Protein.dbIdentifier AS dbIdentifier FROM Protein, ProteinInBioSource"
				." WHERE ProteinInBioSource.id IN ($proteins_list)"
				." AND ProteinInBioSource.idProtein = Protein.id";
				$result = mysqli_query ( $link, $sql );
				if(!$result) return('{success: false, message: "History: Error in SQL request n°17"}');
				$detailsTxt = "date\taction\told/new\tId\tIdentifier\tName\n";
				while ($row = mysqli_fetch_object($result)) {
					$detailsTxt .= date("Y-m-d") . "\tDelete proteins from enzyme " . $action["dbIdentifier"] . "\told\t";
					$detailsTxt .= $row->id . "\t" . $row->dbIdentifier . "\t" . $row->name . "\n";
				}
		$filename = getSaveFileName($idbiosource, $action["idEnzyme"], "enzyme");
	}
	//Add enzyme to reactions:
	elseif($action['action'] == "add enzyme to reactions") {
		$reactions = $action['reactions'];
		$desc = "Add enzyme " . $action['dbIdentifier'] . " to " . strval(count($reactions)) . " reactions";
		$reactions_list = implode(",", $reactions);
		$sql = "SELECT Reaction.id AS id, Reaction.name AS name, Reaction.dbIdentifier AS dbIdentifier FROM Reaction, ReactionInBioSource"
				." WHERE ReactionInBioSource.id IN ($reactions_list)"
				." AND ReactionInBioSource.idReaction = Reaction.id";
		$result = mysqli_query ( $link, $sql );
		if(!$result) return('{success: false, message: "History: Error in SQL request n°18"}');
		$detailsTxt = "date\taction\told/new\tId\tIdentifier\tName\n";
		while ($row = mysqli_fetch_object($result)) {
			$detailsTxt .= date("Y-m-d") . "\tAdd enzyme " . $action["dbIdentifier"] . " to reactions" . "\tnew\t";
			$detailsTxt .= $row->id . "\t" . $row->dbIdentifier . "\t" . $row->name . "\n";
		}
		$filename = getSaveFileName($idbiosource, $action["idEnzyme"], "enzyme");
	}
	//Delete enzyme from reactions:
	elseif($action['action'] == "delete enzyme from reactions") {
		$reactions = $action['reactions'];
		$desc = "Delete enzyme " . $action['dbIdentifier'] . " from " . strval(count($reactions)) . " reactions";
		$reactions_list = implode(",", $reactions);
		$sql = "SELECT Reaction.id AS id, Reaction.name AS name, Reaction.dbIdentifier AS dbIdentifier FROM Reaction, ReactionInBioSource"
				." WHERE ReactionInBioSource.id IN ($reactions_list)"
				." AND ReactionInBioSource.idReaction = Reaction.id";
				$result = mysqli_query ( $link, $sql );
				if(!$result) return('{success: false, message: "History: Error in SQL request n°18"}');
				$detailsTxt = "date\taction\told/new\tId\tIdentifier\tName\n";
				while ($row = mysqli_fetch_object($result)) {
					$detailsTxt .= date("Y-m-d") . "\tDelete enzyme " . $action["dbIdentifier"] . " from reactions" . "\told\t";
					$detailsTxt .= $row->id . "\t" . $row->dbIdentifier . "\t" . $row->name . "\n";
				}
		$filename = getSaveFileName($idbiosource, $action["idEnzyme"], "enzyme");
	}
	//Delete enzyme:
	elseif($action["action"] == "delete enzyme") {
		$desc = "Remove enzyme " . $action["dbIdentifier"];
		$fields = array('id', 'dbIdentifier', 'name');
		$dataOld = array();
		foreach($fields as $field) {
			$dataOld[$field] = $action[$field];
		}
		$res = formatDataInTableFile(null, $dataOld, "enzyme", $idbiosource, $action["id"], "Remove");
		$filename = $res["filename"];
		$detailsTxt = $res["detailsTxt"];
	}
	//Add protein with form:
	elseif($action['action'] == "add protein form") {
		$sql = "SELECT Compartment.name AS nameCompartment FROM Compartment, CompartmentInBioSource"
				." WHERE CompartmentInBioSource.idCompartmentInBioSource = " . $action['idCompartment']
				." AND CompartmentInBioSource.idCompartment = Compartment.idCompartment";
		$result = mysqli_query ( $link, $sql );
		if(!$result) return('{success: false, message: "History: Error in SQL request n°19"}');
		if ($row = mysqli_fetch_object($result)) {
			$desc = "Add protein " . $action['dbIdentifier'] . " in compartment " . $row->nameCompartment;
			//Write details to a file:
			//Prepare data:
			$res = formatDataInTableFile($action['data'], null, "protein", $idbiosource, $action["idProtein"], "Add new");
			$filename = $res["filename"];
			$detailsTxt = $res["detailsTxt"];
		}
		else {
			die('{success: false, message: "History: Error: no row in getting name of compartment"}');
		}
	}
	//Add protein to enzymes:
	elseif($action['action'] == "add protein to enzymes") {
		$enzymes = $action['enzymes'];
		$desc = "Add protein " . $action['dbIdentifier'] . " to " . strval(count($enzymes)) . " enzymes" ;
		$enzymes_list = implode(",", $enzymes);
		$sql = "SELECT Enzyme.id AS id, Enzyme.name AS name, Enzyme.dbIdentifier AS dbIdentifier FROM Enzyme, EnzymeInBioSource"
				." WHERE EnzymeInBioSource.id IN ($enzymes_list)"
				." AND EnzymeInBioSource.idEnzyme = Enzyme.id";
		$result = mysqli_query ( $link, $sql );
		if(!$result) return('{success: false, message: "History: Error in SQL request n°20"}');
		$detailsTxt = "date\taction\told/new\tId\tIdentifier\tName\n";
		while ($row = mysqli_fetch_object($result)) {
			$detailsTxt .= date("Y-m-d") . "\tAdd protein " . $action["dbIdentifier"] . " to enzymes\tnew\t";
			$detailsTxt .= $row->id . "\t" . $row->dbIdentifier . "\t" . $row->name . "\n";
		}
		$filename = getSaveFileName($idbiosource, $action["idProtein"], "protein");
	}
	//Delete enzymes for protein:
	elseif($action['action'] == "delete enzymes for protein") {
		$enzymes = $action['enzymes'];
		$desc = "Remove " . strval(count($enzymes)) . " enzymes for protein " . $action['dbIdentifier'] ;
		$enzymes_list = implode(",", $enzymes);
		$sql = "SELECT Enzyme.id AS id, Enzyme.name AS name, Enzyme.dbIdentifier AS dbIdentifier FROM Enzyme, EnzymeInBioSource"
				." WHERE EnzymeInBioSource.id IN ($enzymes_list)"
				." AND EnzymeInBioSource.idEnzyme = Enzyme.id";
				$result = mysqli_query ( $link, $sql );
				if(!$result) return('{success: false, message: "History: Error in SQL request n°20"}');
				$detailsTxt = "date\taction\told/new\tId\tIdentifier\tName\n";
				while ($row = mysqli_fetch_object($result)) {
					$detailsTxt .= date("Y-m-d") . "\tRemove enzymes for protein " . $action["dbIdentifier"] . "\told\t";
					$detailsTxt .= $row->id . "\t" . $row->dbIdentifier . "\t" . $row->name . "\n";
				}
		$filename = getSaveFileName($idbiosource, $action["idProtein"], "protein");
	}
	//Add genes to protein:
	elseif($action['action'] == "add genes to protein") {
		$genes = $action['genes'];
		$desc = "Add " . strval(count($genes)) . " genes to protein " . $action['dbIdentifier'] ;
		$genes_list = implode(",", $genes);
		$sql = "SELECT Gene.id AS id, Gene.name AS name, Gene.dbIdentifier AS dbIdentifier FROM Gene, GeneInBioSource"
				." WHERE GeneInBioSource.id IN ($genes_list)"
				." AND GeneInBioSource.idGene = Gene.id";
				$result = mysqli_query ( $link, $sql );
				if(!$result) return('{success: false, message: "History: Error in SQL request n°21"}');
				$detailsTxt = "date\taction\told/new\tId\tIdentifier\tName\n";
				while ($row = mysqli_fetch_object($result)) {
					$detailsTxt .= date("Y-m-d") . "\tAdd genes to protein " . $action['dbIdentifier'] . "\tnew\t";
					$detailsTxt .= $row->id . "\t" . $row->dbIdentifier . "\t" . $row->name . "\n";
				}
				$filename = getSaveFileName($idbiosource, $action["idProtein"], "protein");
	}
	//Delete genes from protein:
	elseif($action['action'] == "delete genes from protein") {
		$genes = $action['genes'];
		$desc = "Delete " . strval(count($genes)) . " genes from protein " . $action['dbIdentifier'] ;
		$genes_list = implode(",", $genes);
		$sql = "SELECT Gene.id AS id, Gene.name AS name, Gene.dbIdentifier AS dbIdentifier FROM Gene, GeneInBioSource"
				." WHERE GeneInBioSource.id IN ($genes_list)"
				." AND GeneInBioSource.idGene = Gene.id";
				$result = mysqli_query ( $link, $sql );
				if(!$result) return('{success: false, message: "History: Error in SQL request n°22"}');
				$detailsTxt = "date\taction\told/new\tId\tIdentifier\tName\n";
						while ($row = mysqli_fetch_object($result)) {
						$detailsTxt .= date("Y-m-d") . "\tDelete genes from protein " . $action['dbIdentifier'] . "\told\t";
								$detailsTxt .= $row->id . "\t" . $row->dbIdentifier . "\t" . $row->name . "\n";
						}
						$filename = getSaveFileName($idbiosource, $action["idProtein"], "protein");
	}
	//Update protein with form:
	elseif($action['action'] == "update protein form") {
		$sql = "SELECT Compartment.name AS nameCompartment FROM Compartment, CompartmentInBioSource"
				." WHERE CompartmentInBioSource.idCompartmentInBioSource = " . $action['idCompartment']
				." AND CompartmentInBioSource.idCompartment = Compartment.idCompartment";
		$result = mysqli_query ( $link, $sql );
		if(!$result) return('{success: false, message: "History: Error in SQL request n°23"}');
		if ($row = mysqli_fetch_object($result)) {
			$desc = "Update protein " . $action['dbIdentifier'] . " in compartment " . $row->nameCompartment;
			//Write details to a file:
			//Prepare data:
			$res = formatDataInTableFile($action['dataNew'], $action['dataOld'], "protein", $idbiosource, $action["idProtein"], "Update");
			$filename = $res["filename"];
			$detailsTxt = $res["detailsTxt"];
		}
		else {
			die('{success: false, message: "History: Error: no row in getting name of compartment"}');
		}
	}
	//Delete protein:
	elseif($action["action"] == "delete protein") {
		$desc = "Remove protein " . $action["dbIdentifier"];
		$fields = array('id', 'dbIdentifier', 'name');
		$dataOld = array();
		foreach($fields as $field) {
			$dataOld[$field] = $action[$field];
		}
		$res = formatDataInTableFile(null, $dataOld, "protein", $idbiosource, $action["id"], "Remove");
		$filename = $res["filename"];
		$detailsTxt = $res["detailsTxt"];
	}
	//Add gene with form:
	elseif($action['action'] == "add gene form") {
		$desc = "Add gene " . $action['dbIdentifier'];
		//Write details to a file:
		//Prepare data:
		$res = formatDataInTableFile($action['data'], null, "gene", $idbiosource, $action["idGene"], "Add new");
		$filename = $res["filename"];
		$detailsTxt = $res["detailsTxt"];
	}
	//Update gene with form:
	elseif($action['action'] == "update gene form") {
		$desc = "Update gene " . $action['dbIdentifier'];
		//Write details to a file:
		//Prepare data:
		$res = formatDataInTableFile($action['dataNew'], $action['dataOld'], "gene", $idbiosource, $action["idGene"], "Update");
		$filename = $res["filename"];
		$detailsTxt = $res["detailsTxt"];
	}
	//Add gene to proteins:
	elseif($action['action'] == "add gene to proteins") {
		$proteins = $action['proteins'];
		$desc = "Add gene " . $action['dbIdentifier'] . " to " . strval(count($proteins)) . " proteins" ;
		$proteins_list = implode(",", $proteins);
		$sql = "SELECT Protein.id AS id, Protein.name AS name, Protein.dbIdentifier AS dbIdentifier FROM Protein, ProteinInBioSource"
				." WHERE ProteinInBioSource.id IN ($proteins_list)"
				." AND ProteinInBioSource.idProtein = Protein.id";
		$result = mysqli_query ( $link, $sql );
		if(!$result) return('{success: false, message: "History: Error in SQL request n°24"}');
		$detailsTxt = "date\taction\told/new\tId\tIdentifier\tName\n";
		while ($row = mysqli_fetch_object($result)) {
			$detailsTxt .= date("Y-m-d") . "\tAdd gene " . $action["dbIdentifier"] . " to proteins\tnew\t";
			$detailsTxt .= $row->id . "\t" . $row->dbIdentifier . "\t" . $row->name . "\n";
		}
		$filename = getSaveFileName($idbiosource, $action["idGene"], "gene");
	}
	//Delete gene from proteins:
	elseif($action['action'] == "delete gene from proteins") {
		$proteins = $action['proteins'];
		$desc = "Delete gene " . $action['dbIdentifier'] . " from " . strval(count($proteins)) . " proteins" ;
		$proteins_list = implode(",", $proteins);
		$sql = "SELECT Protein.id AS id, Protein.name AS name, Protein.dbIdentifier AS dbIdentifier FROM Protein, ProteinInBioSource"
				." WHERE ProteinInBioSource.id IN ($proteins_list)"
				." AND ProteinInBioSource.idProtein = Protein.id";
				$result = mysqli_query ( $link, $sql );
				if(!$result) return('{success: false, message: "History: Error in SQL request n°25"}');
				$detailsTxt = "date\taction\told/new\tId\tIdentifier\tName\n";
				while ($row = mysqli_fetch_object($result)) {
					$detailsTxt .= date("Y-m-d") . "\tDelete gene " . $action["dbIdentifier"] . " from proteins\told\t";
					$detailsTxt .= $row->id . "\t" . $row->dbIdentifier . "\t" . $row->name . "\n";
				}
				$filename = getSaveFileName($idbiosource, $action["idGene"], "gene");
	}
	//Delete gene:
	elseif($action["action"] == "delete gene") {
		$desc = "Remove gene " . $action["dbIdentifier"];
		$fields = array('id', 'dbIdentifier', 'name');
		$dataOld = array();
		foreach($fields as $field) {
			$dataOld[$field] = $action[$field];
		}
		$res = formatDataInTableFile(null, $dataOld, "gene", $idbiosource, $action["id"], "Remove");
		$filename = $res["filename"];
		$detailsTxt = $res["detailsTxt"];
	}
	//Add compartment with form:
	elseif($action['action'] == "add compartment form") {
		$desc = "Add compartment " . $action['name'];
		//Write details to a file:
		//Prepare data:
		$res = formatDataInTableFile($action['data'], null, "compartment", $idbiosource, $action["idCompartment"], "Add new");
		$filename = $res["filename"];
		$detailsTxt = $res["detailsTxt"];
	
	}
	$idUser=mysqli_real_escape_string($link, $idUser);
	//WRITE History in BDD (and in file if required):
	if ($desc != "") {
		$desc = mysqli_real_escape_string($link, $desc);
		$shortFilename = str_replace(DATALOG_DIR, "", $filename);
		$sql = "INSERT INTO History (idUser, idBioSource, action, fileDetails) VALUES ($idUser, $idbiosource, \"$desc\", \"$shortFilename\")";
		$result = mysqli_query ( $link, $sql );
		if(!$result) return('{success: false, message: "History: Error in SQL request n°26"}');
		//Write details in file if any:
		if ($filename != "" && $detailsTxt != "") {
			$idMySql = mysqli_insert_id($link);
			$handle = fopen($filename, "a"); //write only mode but pointer at the end of file
			fwrite($handle, "---" . strval($idMySql) . "\n");
			fwrite($handle, $detailsTxt);
			fclose($handle);
		}
	}
	
	//Update last modification date of the BioSource:
	$sql = "UPDATE BioSource SET dateLastModif=\"" . date("Y-m-d H:i:s") ."\" WHERE id=$idbiosource";
	$result = mysqli_query ( $link, $sql );
	if(!$result) return('{success: false, message: "History: Error in SQL request n°27"}');
	
	//Update last visit date of project if opened:
	$idProject = getIdProject();
	if ($idProject != -1) {
		$sql = "UPDATE UserInProject SET lastvisitDate=\"" . date("Y-m-d H:i:s") . "\" WHERE idProject=$idProject AND idUser=$idUser";
		$result=mysqli_query($link, $sql);
	}
	
	return "{success: true}";
}

/**
 * Transform data old/new in a tabular file
 * @param unknown $data the data containing new values
 * @param unknown $dataOld the data containing old values, with THE SAME COLUMNS, exactly
 * @param unknown $typeData
 * @return multitype:string : the formated date
 */
function formatDataInTableFile($dataNew, $dataOld, $typeData, $idbiosource, $idObject, $action) {
	$details = array();
	$detailsTxt = "";
	$valuesNew = "";
	if ($dataNew != null)
	{
		foreach($dataNew as $col => $value) {
			if (gettype($value) == "array") {
				$finalValue = str_replace(",", ", ",json_encode($value));
			}
			else {
				$finalValue = $value;
			}
			$details[$col] = $finalValue;
		}
		ksort($details);
		$keys = array_keys($details);
		$valuesNew = array_values($details);
		$detailsTxt .= "date\taction\told/new\t" . implode("\t", $keys) . "\n";
	}
	if ($dataOld != null) {
		$detailsOld = array();
		foreach($dataOld as $col => $value) {
			if (gettype($value) == "array") {
				$finalValue = str_replace(",", ", ",json_encode($value));
			}
			else {
				$finalValue = $value;
			}
			$detailsOld[$col] = $finalValue;
		}
		ksort($detailsOld);
		if ($detailsTxt == "") {
			$keys = array_keys($detailsOld);
			$detailsTxt .= "date\taction\told/new\t" . implode("\t", $keys) . "\n";
		}
		$valuesOld = array_values($detailsOld);
		$lineToAdd = date("Y-m-d") . "\t$action $typeData\told\t" . implode("\t", $valuesOld);
		$detailsTxt .= $lineToAdd . "\n";
	}
	if ($valuesNew != "") //True if we have dataNew
	{
		$detailsTxt .= date("Y-m-d") . "\t$action $typeData\tnew\t" . implode("\t", $valuesNew) . "\n";
	}

	$filename = getSaveFileName($idbiosource, $idObject, $typeData);

	return array("filename" => $filename, "detailsTxt" => $detailsTxt);
}

/**
 * Make the filename where to save the history item
 * @param unknown $idbiosource
 * @param unknown $idObject
 * @param unknown $typeData
 * @return string: the filename
 */
function getSaveFileName($idbiosource, $idObject, $typeData) {
	$dirname = DATALOG_DIR."/History/$idbiosource/${typeData}s/";
	if (!file_exists($dirname)) {
		mkdir($dirname, 0777, true);
	}
	
	$filename = $dirname . "history_". $idObject .".tsv";
	return $filename;
}

?>