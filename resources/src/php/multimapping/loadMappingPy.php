<?php 
//

require_once("../utils/file_functions.php");

$P_idBioSource=	$_POST['idBioSource'];
$p_json=	$_POST['jsonData'];
$p_class= "";

// Nom du fichier de data à créer
$filename = createRandomFileName('/var/www/tmp/', 'data', 'json');
// Ouverture du fichier, vider et ecrire json et fermeture
$filedata = fopen($filename, 'w');
//ftruncate($filedata,0);
fwrite($filedata, $p_json);
fclose($filedata);

//suppression fichier de sortie
$filenameout = createRandomFileName('/var/www/tmp/', 'out', 'json');;

//if (file_exists($filenameout))
//{
//    unlink($filenameout);
//}

//lancement du python -> creation fichier de sortie
$output = array();
$status= array();
//sous vm-metexplore-prod
$cmd= 'python3.6 ./metabolomics2network.py  json '.$filename.' /var/www/tmp/metabolites_'.$P_idBioSource.'_DB.json '.$filenameout.' ./conf.txt 1';
//sous windows
//$cmd= 'python ./mapping_json.py '.$filename.' /var/www/tmp/metabolites_'.$P_idBioSource.'_DB.json '.$filenameout.' ./conf_json.txt 1';

if ($_POST['classMap'] == 'true') {
    exec ($cmd . ',2', $output,$status);
} else {
    exec ($cmd , $output,$status);
}
$cycles = 0;
while (!($isFileCreated = file_exists($filenameout)) && $cycles > 100000) {
    $cycles++;
    usleep(1);
}
//error_log('output python ',$output);

//lecture du fichier de sortie
$response = array();
if (file_exists($filenameout))
{
    $json_source = file_get_contents($filenameout);
    $json_data = json_decode($json_source);
    $response ["json_data"] = $json_data;
    $response["success"] = true;
} else {

    $response["success"] = false;
}

echo json_encode($response);
?>