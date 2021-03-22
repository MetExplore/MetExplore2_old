<?php 

require_once('../config/server_variables.php');

$functionParam= json_decode($_POST['functionParam'], $assoc=true);

extract ( $functionParam, EXTR_OVERWRITE );

if ($onlyEmpty){
	$cmd = "java -Xms512M -Xmx1024M -cp ".METEXPLOREJAVA_DIR."/metExploreJava.jar metexplore.gui.Admin.EnrichDBids -idBioSource $bioSourceId -onlyEmpty ";
}
else{
	$cmd = "java -Xms512M -Xmx1024M -cp ".METEXPLOREJAVA_DIR."/metExploreJava.jar metexplore.gui.Admin.EnrichDBids -idBioSource $bioSourceId";
}

// error_log($cmd);

$output = array();

$status = 1;

$cmd .= " > /dev/null &";

$res = exec($cmd, $output);

print "{\"success\":\"true\", \"message\":\"You will receive an email on the metexplore e-mail when the process will be finished\"}";

?>
