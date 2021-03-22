<?php
/*
 * recherche fichier version
 */
require_once ('config/server_variables.php');
$data= array();
foreach (glob(WEB_DIR.'v*.txt') as $filename) {
    $data["versionAppli"]= basename($filename, ".txt");
}

echo json_encode($data);
?>
