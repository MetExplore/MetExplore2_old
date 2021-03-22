<?php 

$keggid=$_POST['kegg'];


require_once('../config/server_variables.php');


$cmd = JAVA_BIN."java -cp ".METEXPLOREJAVA_DIR."/metExploreJava.jar metexplore.GetKeggAsJson -KeggID $keggid";

$output=array();

$res = exec($cmd, $output);

$json=(array) json_decode($output[0]);


echo json_encode($json);

?>



