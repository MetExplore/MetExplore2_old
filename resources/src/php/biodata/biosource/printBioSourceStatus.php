<?php
/**
 * Prints the id user stored in the php session
 * Used in MetExplore.globals.Session.setUserId()
 */
require_once (__DIR__ . "/bioSourceFunctions.php");
require_once (__DIR__ . "/../../database/connection.php");

if (! isset ( $_POST ['idBioSource'] )) {
	echo '{"success":false, "message":"no biosource provided", "status":"undefined"}';
	exit ();
} else {
	
	$idBioSource = $_POST ['idBioSource'];
	
	$status = getBioSourceStatus ( $idBioSource, $link );
	
	echo '{"success":true,  "status":"'.$status.'"}';
}
?>