<?php
// List all the analyses in the session and in the user directory (if logged)
// returns a json
require_once ('../database/connection.php');
require_once ("../user/userFunctions.php");
require_once ("application_functions.php");

$idUser = getIdUser ();

$analyses = array ();

if ($idUser != - 1) {


        // The user is connected
        $user_dir = getUserDirectory ( $idUser, $link );

        $analyses = listAnalyses($user_dir, $analyses, false, $link);
        $analyses = listAnalysesRank($user_dir, $analyses, false, $link);

}

$session_dir = TMP_DIR . "/" . session_id();

$analyses = listAnalyses($session_dir, $analyses, true, $link);
$analyses = listAnalysesRank($session_dir, $analyses, true, $link);

$response["success"] = true;
$response["analyses"] = $analyses;
echo json_encode($response);


?>
