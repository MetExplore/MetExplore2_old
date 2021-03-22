<?php 
/**
 * Prints the id user stored in the php session
 * Used in MetExplore.globals.Session.setUserId()
 */

require_once(__DIR__."/userFunctions.php");


$idUser = getIdUser();

echo ($idUser);
?>
