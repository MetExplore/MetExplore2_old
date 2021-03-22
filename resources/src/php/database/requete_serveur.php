<?php
// Indiquer que le contenu de la sortie est de type JSON.
//require_once '../database/connectionSV.php';
header('Content-Type: text/json');

// Créer le tableau de la réponse.
$response = array(
 "result" => array(
  array(
"name" => "test",
"strain" =>"test")));

// Encoder la tableau au format JSON.
echo json_encode($response);
?>