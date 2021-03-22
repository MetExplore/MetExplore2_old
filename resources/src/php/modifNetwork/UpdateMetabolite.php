<?php
require_once "../database/connection.php";
require_once "../LogBioSourceUpdate.php";

$functionParam = json_decode($_POST['functionParam'], $assoc = true);
$initialValues = json_decode($_POST['initialValues'], $assoc = true);

extract($functionParam, EXTR_OVERWRITE);

require_once '../user/userFunctions.php';

$currentUser = getIdUser();

if (getBioSourceRights($currentUser, $idBiosource, $link) == "denied") {
    echo '{"success":false, "message": "Permission denied"}';
    return;
}

$mtbname = mysqli_real_escape_string($link, $mtbname);
$formula = mysqli_real_escape_string($link, $formula);
$weight = mysqli_real_escape_string($link, $weight);
$generic = mysqli_real_escape_string($link, $generic);
$mtbId = mysqli_real_escape_string($link, $mtbId);
$charge = mysqli_real_escape_string($link, $charge);
$idMetabolite = mysqli_real_escape_string($link, $idMetabolite);

// Check if the dbIdentifier already exists

$sqlCheck = "SELECT m.dbIdentifier " .
    "FROM Metabolite m INNER JOIN MetaboliteInBioSource mib ON m.id=mib.idMetabolite " .
    "WHERE m.dbIdentifier='$mtbId' AND mib.idBioSource='$idBiosource'";

$res = mysqli_query($link, $sqlCheck) or die('{success: "false", message: "Error in Mysql Query: ' . mysqli_error($link) . '"}');

$num_result = $res->num_rows;

# If the metabolite id does not change, the number of metabolites with the
# same id must equal to 1, otherwise to 0
$num_to_test = $mtbId == $initialValues['mtbId'] ? 1 : 0;

if ($num_result > $num_to_test) {
    die('{success: "false", message: "Metabolite can\'t be updated. Metabolite with same id already exists. Metabolite ids must be unique."}');
}

$sqlMetab = "UPDATE Metabolite SET name='$mtbname', chemicalFormula='$formula', weight='$weight', generic='$generic', dbIdentifier='$mtbId', charge='$charge' WHERE id=$idMetabolite;";
$num_result = mysqli_query($link, $sqlMetab) or die('{success: false, message: "Error in Mysql Query when adding metabolite: ' . mysqli_error($link) . '"}');

AddSQLtoBioSourceLog($idBiosource, $sqlMetab, $iduser);

$idCmpInBS = mysqli_real_escape_string($link, $idCmpInBS);

$sqlMetabInCompart = "UPDATE MetaboliteInCompartment SET idCompartmentInBioSource='$idCmpInBS' WHERE idMetabolite='$idMetabolite';";
$num_result = mysqli_query($link, $sqlMetabInCompart) or die('{success: false, message: "Error in Mysql Query  when adding metabolite in compartment: ' . mysqli_error($link) . '"}');

$action = array(
    "action" => "update metabolite form",
    "dbIdentifier" => $mtbId,
    "idCompartment" => $idCmpInBS,
    "data" => $functionParam,
    "dataOld" => $initialValues,
    "idMetabolite" => $idMetabolite,
);

AddSQLtoBioSourceLog($idBiosource, $sqlMetabInCompart, $iduser, $action, $link);

$boundaryCondition = mysqli_real_escape_string($link, $boundaryCondition);
$sideCoumpound = mysqli_real_escape_string($link, $sideCoumpound);
$constant = mysqli_real_escape_string($link, $constant);
$idBiosource = mysqli_real_escape_string($link, $idBiosource);

$sqlMetabInBioSource = "UPDATE MetaboliteInBioSource SET boundaryCondition='$boundaryCondition', sideCompound='$sideCoumpound', constant='$constant' WHERE idBioSource='$idBiosource' AND idMetabolite='$idMetabolite';";

$num_result = mysqli_query($link, $sqlMetabInBioSource) or die('{success: false, message: "Error in Mysql Query  when adding boundary condition: ' . mysqli_error($link) . '"}');

AddSQLtoBioSourceLog($idBiosource, $sqlMetabInBioSource, $iduser);

//////////
// Del old Ref to insert the new one

//Del old
$sqlDelRef = "DELETE FROM MetaboliteIdentifiers WHERE idMetabolite='$idMetabolite';";
$num_result = mysqli_query($link, $sqlDelRef) or die('{success: false, message: "Error in Mysql Query"}');

AddSQLtoBioSourceLog($idBiosource, $sqlDelRef, $iduser);

//Insert new
$sqlMetaboliteRef = "INSERT INTO  MetaboliteIdentifiers (idMetabolite, extDBName, extID, origin, score) VALUES";

$changes = 0;

foreach ($DBref as $x => $x_value) {

    if ($x_value != '') {

        $changes++;

        $db = mysqli_real_escape_string($link, $x);
        $id = mysqli_real_escape_string($link, $x_value);
        $sqlMetaboliteRef .= " ('$idMetabolite', '$db', '$id', 'UserInput', '1'),";
    }
}

if ($changes > 0) {
    $sqlMetaboliteRef = substr($sqlMetaboliteRef, 0, strlen($sqlMetaboliteRef) - 1);

    $num_result = mysqli_query($link, $sqlMetaboliteRef) or die('{success: false, message: "Error in Mysql Query  when adding external refs: ' . mysqli_error($link) . '"}');
}

AddSQLtoBioSourceLog($idBiosource, $sqlMetaboliteRef, $iduser);

echo '{"success":"true"}';
return;
?>