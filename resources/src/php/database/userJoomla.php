<?php
require 'helper.php';
function crypt_joomla_psw($psw_clair, $id_user = 0, $username = "", $psw_joomla) {
	//
	// La class JUserHelper est necessaire le fichier : libraries/joomla/user/helper.php
//	require './connection.php';
//	// requete recherche password du username envoy�
//	$req = "SELECT id, name, email, password FROM UserMet WHERE UserMet.username=\"$username\"";
//	//php <5.5
//	//$res = mysql_query ( $req, $con );
//	// $taille = mysql_num_rows($res);
//	//$row = mysql_fetch_array ( $res );
//	//php>5.5
//	$res = mysqli_query ($link ,$req );
//	// $taille = mysql_num_rows($res);
//	$row = mysqli_fetch_array ( $res );
//	if (! isset ( $row ['password'] ))
//		return '0';
//	$psw_joomla = $row ['password'];
	// $id_user=$row['id'];
	list ( $psw, $salt ) = explode ( ":", $psw_joomla );
	$psw_crypt = JUserHelper::getCryptedPassword ( $psw_clair, $salt ) . ":" . $salt;
	if ($psw_crypt == $psw_joomla)
		return "ok";
	else
		return null;
}

function get_crypt_psw($psw_clair, $username = "", $link) {
	//
	// La class JUserHelper est necessaire le fichier : libraries/joomla/user/helper.php
	// requete recherche password du username envoy�
	$req = "SELECT id, name, email, password FROM UserMet WHERE UserMet.username=\"$username\"";
	//php <5.5
	//$res = mysql_query ( $req, $con );
	// $taille = mysql_num_rows($res);
	//$row = mysql_fetch_array ( $res );
	//php>5.5
	$res = mysqli_query ( $link,$req );
	// $taille = mysql_num_rows($res);
	$row = mysqli_fetch_array ( $res );
	if (! isset ( $row ['password'] ))
		return '0';
	$psw_joomla = $row ['password'];
	// $id_user=$row['id'];
	list ( $psw, $salt ) = explode ( ":", $psw_joomla );
	$psw_crypt = JUserHelper::getCryptedPassword ( $psw_clair, $salt ) . ":" . $salt;
	return $psw_crypt;
}

function check_crypt_psw($psw_clair, $username = "", $link) {
	// requete recherche password du username envoy�
	$req = "SELECT id, name, email, password FROM UserMet WHERE UserMet.username=\"$username\"";
	//php <5.5
	//$res = mysql_query ( $req, $con );
	// $taille = mysql_num_rows($res);
	//$row = mysql_fetch_array ( $res );
	//php>5.5
	$res = mysqli_query ( $link,$req );
	// $taille = mysql_num_rows($res);
	$row = mysqli_fetch_array ( $res );
	if (! isset ( $row ['password'] ))
		return '0';
	$psw_joomla = $row ['password'];
	// $id_user=$row['id'];
	list ( $psw, $salt ) = explode ( ":", $psw_joomla );
	$psw_crypt = JUserHelper::getCryptedPassword ( $psw_clair, $salt ) . ":" . $salt;
	if ($psw_crypt == $psw_joomla)
		return $psw_crypt;
	else
		return '0';
}

?>
