<?php

require_once ('../config/server_variables.php');

$data=array();

foreach (glob('/var/www/metexplore2/v*.txt') as $filename) {
    $data["versionAppli"]= basename($filename, ".txt");
}

echo json_encode($data);

?>
