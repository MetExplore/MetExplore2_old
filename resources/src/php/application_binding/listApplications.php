<?php
// List the external applications in a json format that will be used to build the web interface

require_once '../config/server_variables.php';
require_once "../utils/file_functions.php";

$cmd = JAVA_BIN . "java -Djava.library.path=" . D_JAVA_LIBRARY_PATH . " -cp " . METEXPLOREJAVA_DIR . "/metExploreJava.jar fr.inrae.toulouse.metexplore.metexplorejava.apps.gui.ListFunctions";

$cmd .= " 2> /dev/null";

$output = array();

$status = 1;

$res = exec($cmd, $output);

for ($i = 0; $i < count($output); $i++) {
    print $output[$i];
}
