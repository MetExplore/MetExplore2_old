<?php
require_once "../database/connection.php";
require_once "../LogBioSourceUpdate.php";

$functionParam = json_decode($_POST['functionParam'], $assoc = true);
$initialValues = json_decode($_POST['initialValues'], $assoc = true);

extract($functionParam, EXTR_OVERWRITE);

require_once '../user/userFunctions.php';

$currentUser = getIdUser();

if (getBioSourceRights($currentUser, $idBiosource, $link) == "denied") {
    echo '{"success":false}';
    return;
}

/////////////////////////////////////////////
// Update Reaction in database
/////////////////////////////////////////////

$name = mysqli_real_escape_string($link, $name);
$generic = mysqli_real_escape_string($link, $generic);
$EC = mysqli_real_escape_string($link, $EC);
$dbIdentifier = mysqli_real_escape_string($link, $dbIdentifier);
$go = mysqli_real_escape_string($link, $go);
$goName = mysqli_real_escape_string($link, $goName);
$idReaction = mysqli_real_escape_string($link, $idReaction);

// Check if the dbIdentifier already exists

$sqlCheck = "SELECT r.dbIdentifier " .
    "FROM Reaction r INNER JOIN ReactionInBioSource rib ON r.id=rib.idReaction " .
    "WHERE r.dbIdentifier='$dbIdentifier' AND rib.idBioSource='$idBiosource'";

$res = mysqli_query($link, $sqlCheck) or die('{success: "false", message: "Error in Mysql Query: ' . mysqli_error($link) . '"}');

$num_result = $res->num_rows;

# If the reaction id does not change, the number of reactions with the
# same id must equal to 1, otherwise to 0
$num_to_test = $dbIdentifier == $initialValues['dbIdentifier'] ? 1 : 0;

if ($num_result > $num_to_test) {
    die('{success: "false", message: "Reaction can\'t be updated. Reaction with same id already exists. Reaction ids must be unique."}');
}

$sqlReaction = "UPDATE Reaction SET `name`='$name', `generic`='$generic', `ec`='$EC', `dbIdentifier`='$dbIdentifier', `go`='$go', `goName`='$goName' WHERE `Reaction`.`id`='$idReaction';";

$num_result = mysqli_query($link, $sqlReaction) or die('{success: false, message: "Error in Mysql Query: ' . mysqli_error($link) . '"}');

AddSQLtoBioSourceLog($idBiosource, $sqlReaction, $iduser);

/////////////////////////////////////////////
// Update Reaction in Biosource
/////////////////////////////////////////////

$reversible = mysqli_real_escape_string($link, $reversible);
$hole = mysqli_real_escape_string($link, $hole);
$ubound = mysqli_real_escape_string($link, $ubound);
$lbound = mysqli_real_escape_string($link, $lbound);
$idBiosource = mysqli_real_escape_string($link, $idBiosource);

$sqlReactionInBioSource = "UPDATE `ReactionInBioSource` SET `reversible`='$reversible', `hole`='$hole', `upperBound`='$ubound', `lowerBound`='$lbound' WHERE  `ReactionInBioSource`.`idReaction`='$idReaction' AND `ReactionInBioSource`.`idBioSource`='$idBiosource' ;";

$num_result = mysqli_query($link, $sqlReactionInBioSource) or die('{success: false, message: "Error in Mysql Query: ' . mysqli_error($link) . '"}');

$action = array(
    "action" => "update reaction form",
    "dbIdentifier" => $initialValues['dbIdentifier'],
    "dataNew" => $functionParam,
    "dataOld" => $initialValues,
    "idReaction" => $idReaction,
);

AddSQLtoBioSourceLog($idBiosource, $sqlReactionInBioSource, $iduser, $action, $link);

//////////////////////////////////////////
//Update metabolites on history :
//////////////////////////////////////////

//error_log( print_R($Substrat,TRUE) );

//Refactor lists:
$newSubstrats = array();
foreach ($Substrate as $sub) {
    $newSubstrats[$sub['idMetabolite']] = $sub;
}
$newSubstrats_list = array_keys($newSubstrats);
$newProducts = array();
foreach ($Product as $prod) {
    $newProducts[$prod['idMetabolite']] = $prod;
}
$newProducts_list = array_keys($newProducts);
$oldSubstrats = array();
foreach ($initialValues['Substrate'] as $sub) {
    $oldSubstrats[$sub['idMetabolite']] = $sub;
}
$oldSubstrats_list = array_keys($oldSubstrats);
$oldProducts = array();
foreach ($initialValues['Product'] as $prod) {
    $oldProducts[$prod['idMetabolite']] = $prod;
}
$oldProducts_list = array_keys($oldProducts);

//Get added and updated metabolites:
$addedSubstrats = array();
$updatedSubstrats = array();
foreach ($newSubstrats_list as $new) {
    if (!in_array($new, $oldSubstrats_list)) {
        $addedSubstrats[$new] = $newSubstrats[$new];
    } else {
        $changed = false;
        foreach ($newSubstrats[$new] as $key => $value) {
            if ($value != $oldSubstrats[$new][$key]) {
                $changed = true;
            }
        }
        if ($changed) {
            $metab = array(
                "new" => $newSubstrats[$new],
                "old" => $oldSubstrats[$new],
            );
            $updatedSubstrats[$new] = $metab;
        }
    }
}
$addedProducts = array();
$updatedProducts = array();
foreach ($newProducts_list as $new) {
    if (!in_array($new, $oldProducts_list)) {
        $addedProducts[$new] = $newProducts[$new];
    } else {
        $changed = false;
        foreach ($newProducts[$new] as $key => $value) {
            if ($value != $oldProducts[$new][$key]) {
                $changed = true;
            }
        }
        if ($changed) {
            $metab = array(
                "new" => $newProducts[$new],
                "old" => $oldProducts[$new],
            );
            $updatedProducts[$new] = $metab;
        }
    }
}

//Add added metabolites to history if any:
if (count($addedSubstrats) > 0 || count($addedProducts) > 0) {
    $action = array(
        "action" => "add metabolites to reaction",
        "idReaction" => $idReaction,
        "dbIdentifier" => $dbIdentifier,
        "lMetabolites" => $addedSubstrats,
        "rMetabolites" => $addedProducts,
    );
    addHistoryItem($idBiosource, $iduser, $action, $link);
}

//Add updated metabolites to history if any:
if (count($updatedSubstrats) > 0 || count($updatedProducts) > 0) {
    $action = array(
        "action" => "update metabolites on reaction",
        "idReaction" => $idReaction,
        "dbIdentifier" => $dbIdentifier,
        "lMetabolites" => $updatedSubstrats,
        "rMetabolites" => $updatedProducts,
    );
    addHistoryItem($idBiosource, $iduser, $action, $link);
}

//Get deleted metabolites:
$deletedSubstrats = array();
foreach ($oldSubstrats_list as $old) {
    if (!in_array($old, $newSubstrats_list)) {
        $deletedSubstrats[$old] = $oldSubstrats[$old];
    }
}
$deletedProducts = array();
foreach ($oldProducts_list as $old) {
    if (!in_array($old, $newProducts_list)) {
        $deletedProducts[$old] = $oldProducts[$old];
    }
}

//Add to history if any:
if (count($deletedSubstrats) > 0 || count($deletedProducts) > 0) {
    $action = array(
        "action" => "delete metabolites from reaction",
        "idReaction" => $idReaction,
        "dbIdentifier" => $dbIdentifier,
        "lMetabolites" => $deletedSubstrats,
        "rMetabolites" => $deletedProducts,
    );
    addHistoryItem($idBiosource, $iduser, $action, $link);
}

/////////////////////////////////////////////
//    Remove old LParticipant of the reaction and ADD the new ones
/////////////////////////////////////////////
if (!empty($Substrat)) {
    //Del old

    $sqlDelLeftPart = "DELETE FROM LeftParticipant WHERE idReaction='$idReaction';";
    $num_result = mysqli_query($link, $sqlDelLeftPart) or die('{success: false, message: "Error in Mysql Query: ' . mysqli_error($link) . '"}');

    AddSQLtoBioSourceLog($idBiosource, $sqlDelLeftPart, $iduser);

    //add new
    $sqlLPart = "INSERT INTO LeftParticipant (idReaction, idMetabolite, coeff, side) VALUES";

    foreach ($Substrate as $lpart) {

        $idMetabolite = mysqli_real_escape_string($link, $lpart["idMetabolite"]);
        $coeff = mysqli_real_escape_string($link, $lpart["coeff"]);
        $side = mysqli_real_escape_string($link, $lpart["side"]);

        $sqlLPart .= " ('$idReaction', '$idMetabolite',  '$coeff', '$side'),";
    }
    $sqlLPart = substr($sqlLPart, 0, strlen($sqlLPart) - 1);
    $num_result = mysqli_query($link, $sqlLPart) or die('{success: false, message: "Error in Mysql Query: ' . mysqli_error($link) . '"}');

    AddSQLtoBioSourceLog($idBiosource, $sqlLPart, $iduser);
}

/////////////////////////////////////////////
//    Remove old RParticipant of the reaction and ADD the new ones
/////////////////////////////////////////////
if (!empty($Product)) {

    //Del old

    $sqlDelRightPart = "DELETE FROM RightParticipant WHERE idReaction='$idReaction';";
    $num_result = mysqli_query($link, $sqlDelRightPart) or die('{success: false, message: "Error in Mysql Query: ' . mysqli_error($link) . '"}');

    AddSQLtoBioSourceLog($idBiosource, $sqlDelRightPart, $iduser);

    //add new
    $sqlRPart = "INSERT INTO RightParticipant (idReaction, idMetabolite, coeff, side) VALUES";

    foreach ($Product as $rpart) {

        $idMetabolite = mysqli_real_escape_string($link, $rpart["idMetabolite"]);
        $coeff = mysqli_real_escape_string($link, $rpart["coeff"]);
        $side = mysqli_real_escape_string($link, $rpart["side"]);

        $sqlRPart .= " ('$idReaction', '$idMetabolite',  '$coeff', '$side'),";
    }
    $sqlRPart = substr($sqlRPart, 0, strlen($sqlRPart) - 1);

    $num_result = mysqli_query($link, $sqlRPart) or die('{success: false, message: "Error in Mysql Query for insert in RightParticipant table: ' . mysqli_error($link) . '"}');

    AddSQLtoBioSourceLog($idBiosource, $sqlRPart, $iduser);
}

/////////////////////////////////////////////
// Del all the old pathways and ADD Reaction to new Pathways (if the new are defined)
/////////////////////////////////////////////
$idReactInBio = mysqli_real_escape_string($link, $idReactInBio);

// Del old
$sqlDelPaths = "DELETE FROM ReactionInPathway WHERE `idReactionBioSource`='$idReactInBio';";
$num_result = mysqli_query($link, $sqlDelPaths) or die('{success: false, message: "Error in Mysql Query for delete in ReactionInPathway table: ' . mysqli_error($link) . '"}');

AddSQLtoBioSourceLog($idBiosource, $sqlDelPaths, $iduser);

$oldPathways = $initialValues['pathway']; //Get pathways that were already present
if ($oldPathways == "") {
    $oldPathways = array();
}
// Add New
if ($pathway != "") {

    $addedPathways = array();

    $sqlReactionInPathway = "INSERT INTO ReactionInPathway (idPathway, idReactionBioSource) VALUES";
    foreach ($pathway as $path) {
        $pathc = mysqli_real_escape_string($link, $path);

        $sqlReactionInPathway .= " ('$pathc', '$idReactInBio'),";
        if (!in_array($path, $oldPathways) && !in_array($path, $addedPathways)) {
            array_push($addedPathways, $path);
        }
    }
    $sqlReactionInPathway = substr($sqlReactionInPathway, 0, strlen($sqlReactionInPathway) - 1);
    $num_result = mysqli_query($link, $sqlReactionInPathway) or die('{success: false, message: "Error in Mysql Query for insert in ReactionInPathway table: ' . mysqli_error($link) . '"}');

    $action = null;

    if (count($addedPathways) > 0) {
        $action = array(
            "action" => "add reaction to pathways",
            "dbIdentifier" => $dbIdentifier,
            "pathways" => $addedPathways,
            "idReaction" => $idReaction,
        );
    }

    AddSQLtoBioSourceLog($idBiosource, $sqlReactionInPathway, $iduser, $action, $link);
} else {
    $pathway = array(); //Must be an array for next foreach
}

//Log deleted pathways:
$removedPathways = array();

foreach ($oldPathways as $path) {
    if (!in_array($path, $pathway) && !in_array($path, $removedPathways)) {
        array_push($removedPathways, $path);
    }
}

if (count($removedPathways) > 0) {
    $action = array(
        "action" => "delete reaction from pathways",
        "dbIdentifier" => $dbIdentifier,
        "pathways" => $removedPathways,
        "idReaction" => $idReaction,
    );

    addHistoryItem($idBiosource, $iduser, $action, $link);
}

/////////////////////////////////////////////
// Del all the old Enzymes and ADD the new ones to Reaction (if defined)
/////////////////////////////////////////////

// Del old
$sqlDelEnzyme = "DELETE FROM Catalyses WHERE `idReactionInBioSource`='$idReactInBio';";
$num_result = mysqli_query($link, $sqlDelEnzyme) or die('{success: false, message: "Error in Mysql Query for Catalyses table: ' . mysqli_error($link) . '"}');

AddSQLtoBioSourceLog($idBiosource, $sqlDelEnzyme, $iduser);

$oldEnzymes = $initialValues['enzymes']; //Get enzymes that were already present
if ($oldEnzymes == "") {
    $oldEnzymes = array();
}
// Add New
if ($enzymes != "") {

    $addedEnzymes = array();

    $sqlEnzymeCatalyses = "INSERT INTO Catalyses (idReactionInBioSource, idEnzymeInBioSource) VALUES";

    foreach ($enzymes as $enz) {
        $enzc = mysqli_real_escape_string($link, $enz);

        $sqlEnzymeCatalyses .= " ('$idReactInBio', '$enzc'),";
        if (!in_array($enz, $oldEnzymes) && !in_array($enz, $addedEnzymes)) {
            array_push($addedEnzymes, $enz);
        }

    }
    $sqlEnzymeCatalyses = substr($sqlEnzymeCatalyses, 0, strlen($sqlEnzymeCatalyses) - 1);
    $num_result = mysqli_query($link, $sqlEnzymeCatalyses) or die('{success: false, message: "Error in Mysql Query for insert in Catalyses table: ' . mysqli_error($link) . '"}');

    $action = null;

    if (count($addedEnzymes) > 0) {
        $action = array(
            "action" => "add enzymes to reaction",
            "dbIdentifier" => $dbIdentifier,
            "enzymes" => $addedEnzymes,
            "idReaction" => $idReaction,
        );
    }

    AddSQLtoBioSourceLog($idBiosource, $sqlEnzymeCatalyses, $iduser, $action, $link);
}

//Log deleted enzymes:
$removedEnzymes = array();

foreach ($oldEnzymes as $enz) {
    if (!in_array($enz, $enzymes) && !in_array($enz, $removedEnzymes)) {
        array_push($removedEnzymes, $enz);
    }
}

if (count($removedEnzymes) > 0) {
    $action = array(
        "action" => "delete enzymes from reaction",
        "dbIdentifier" => $dbIdentifier,
        "enzymes" => $removedEnzymes,
        "idReaction" => $idReaction,
    );

    addHistoryItem($idBiosource, $iduser, $action, $link);
}

/////////////////////////////////////////////
// ADD Reaction Status (if defined)
/////////////////////////////////////////////

// Del old
$sqlDelStatus = "DELETE FROM ReactionHasStatus WHERE `idReaction`='$idReaction';";
$num_result = mysqli_query($link, $sqlDelStatus) or die('{success: false, message: "Error in Mysql Query: ' . mysqli_error($link) . '"}');

AddSQLtoBioSourceLog($idBiosource, $sqlDelStatus, $iduser);

// Add New
if ($idstatus != "") {
    $idstatus = mysqli_real_escape_string($link, $idstatus);

    $sqlReactionStatus = "INSERT INTO ReactionHasStatus (idReaction, idStatus) VALUES ('$idReaction', '$idstatus')";
    // TODO : Check the result !!!!
    $num_result = mysqli_query($link, $sqlReactionStatus) or die('{success: false, message: "Error in Mysql Query: ' . mysqli_error($link) . '"}');

    AddSQLtoBioSourceLog($idBiosource, $sqlReactionStatus, $iduser);

}

/////////////////////////////////////////////
// Del old biblio and ADD the new one (if defined)
/////////////////////////////////////////////

// Del old.

$sqlOldRxnBiblio = "SELECT idBiblio FROM ReactionHasReference WHERE idReaction='$idReaction';";
// TODO : Check the result !!!!
$result = mysqli_query($link, $sqlOldRxnBiblio);

$oldIDs = array();
while ($tab = mysqli_fetch_assoc($result)) {
    array_push($oldIDs, $tab["idBiblio"]);
}

if (sizeof($oldIDs) > 0) {
    $sqlDelBiblio = "DELETE FROM Biblio WHERE idBiblio IN (" . implode(',', array_map('intval', $oldIDs)) . ");";
    // TODO : Check the result !!!!
    $num_result = mysqli_query($link, $sqlDelBiblio) or die('{success: false, message: "Error in Mysql Query": ' . mysqli_error($link) . '}');

    AddSQLtoBioSourceLog($idBiosource, $sqlDelBiblio, $iduser);
}

// Add New
$BiblioIds = array();

foreach ($Biblio as $ref) {

    $PMID = $ref["pubmedid"];
    $title = $ref["title"];
    $authors = $ref["authors"];
    $Journal = $ref["Journal"];
    $Year = $ref["Year"];

    $shortRef = "";

    $authorsList = explode(',', $authors);
    if (count($authorsList) > 1) {
        $shortRef = $authorsList[0] . " et al., " . $Year;
    } else {
        $shortRef = $authorsList[0] . ", " . $Year;
    }

    $PMID = mysqli_real_escape_string($link, $PMID);
    $title = mysqli_real_escape_string($link, $title);
    $authors = mysqli_real_escape_string($link, $authors);
    $Journal = mysqli_real_escape_string($link, $Journal);
    $Year = mysqli_real_escape_string($link, $Year);
    $shortRef = mysqli_real_escape_string($link, $shortRef);

    $sqlReactionBiblio = "INSERT INTO Biblio (pubmedid,title,authors,Journal,Year,ShortRef) VALUES ('$PMID', '$title', '$authors','$Journal', '$Year','$shortRef')";

    // TODO : Check the result !!!!
    $num_result = mysqli_query($link, $sqlReactionBiblio) or die('{success: false, message: "Error in Mysql Query: ' . mysqli_error($link) . '"}');
    array_push($BiblioIds, mysqli_insert_id($link));

    AddSQLtoBioSourceLog($idBiosource, $sqlReactionBiblio, $iduser);

}

if (sizeof($BiblioIds) > 0) {

    $sqlReactionHasRef = "INSERT INTO ReactionHasReference (idReaction,idBiblio) VALUES";

    foreach ($BiblioIds as $id) {
        $idc = mysqli_real_escape_string($link, $id);

        $sqlReactionHasRef .= " ('$idReaction','$idc'),";
    }
    $sqlReactionHasRef = substr($sqlReactionHasRef, 0, strlen($sqlReactionHasRef) - 1);
    $num_result = mysqli_query($link, $sqlReactionHasRef) or die('{success: false, message: "Error in Mysql Query: ' . mysqli_error($link) . '"}');

    AddSQLtoBioSourceLog($idBiosource, $sqlReactionHasRef, $iduser);

}

echo '{"success":"true"}';
return;
