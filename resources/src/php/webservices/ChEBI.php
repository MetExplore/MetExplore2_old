<?php 

$chebiId=$_POST['chebi'];


require_once('../config/server_variables.php');


$cmd = JAVA_BIN."java -cp ".METEXPLOREJAVA_DIR."/metExploreJava.jar metexplore.webServices.ChEBIWebService -ChEBI $chebiId";

$output=array();

$res = exec($cmd, $output);

$json=(array) json_decode($output[0]);


echo json_encode($json);

?>



