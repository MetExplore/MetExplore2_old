<?php
require_once '../database/connection.php';

$MySqlid = $_GET['idMySql'];

$sql = "SELECT extDBName, group_concat( extID SEPARATOR '<br/>') AS DBids FROM MetaboliteIdentifiers WHERE idMetabolite=$MySqlid AND  (MetaboliteIdentifiers.origin=\"SBML File\" OR MetaboliteIdentifiers.origin=\"SBML\" OR MetaboliteIdentifiers.origin=\"Import\" OR MetaboliteIdentifiers.origin=\"UserInput\") GROUP BY extDBName;";

$response["success"] = false;

$result = mysqli_query($link, $sql);

if (!$result) {
    $response["message"] = "Impossible to get the list of the identifiers of the metabolite!";
    mysqli_error($link);
    die(json_encode($response));
}

$results = array();

while ($tab = mysqli_fetch_assoc($result)) {
    $res = array();
    $res["dbname"] = $tab["extDBName"];
    $res["dbid"] = $tab["DBids"];

    array_push($results, $res);
}

$response["success"] = true;
$response["results"] = $results;

echo json_encode($response);
?>