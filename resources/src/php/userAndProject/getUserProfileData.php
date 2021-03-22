<?php

require_once '../database/connectionJoomla.php';
require_once '../database/connection.php';
require_once '../user/userFunctions.php';

$P_idUser=getIdUser();


$P_idUser=mysqli_real_escape_string ( $linkJ , $P_idUser );

$sql = "SELECT name, username, email FROM jzlvs_users WHERE id=$P_idUser";
$result = mysqli_query ( $linkJ, $sql ) or die ( '{success: false, message: "getUserProfileData: Error in SQL request n°1"}' );

$data = array();
$userFound = false;
while ($row = mysqli_fetch_object ( $result ))
{
	$data['name'] = html_entity_decode ($row->name);
	$data['username'] = html_entity_decode ($row->username);
	$data['email'] = html_entity_decode ($row->email);
	$userFound = true;
}
if (!$userFound) {
	die('{success: false, message: "connexion failed!"}');
}

$data['aboutme'] = "";
$data['address1'] = "";
$data['city'] = "";
$data['country'] = "";
$data['postalCode'] = "";
$data['website'] = "";

$sql = "SELECT profile_key AS keyP, profile_value AS valueP FROM jzlvs_user_profiles WHERE user_id=$P_idUser";

$result = mysqli_query ( $linkJ, $sql ) or die ( '{success: false, message: "getUserProfileData: Error in SQL request n°2"}' );

while ($row = mysqli_fetch_object ( $result ))
{
	if ($row->keyP == "profile.aboutme") {
		$data['aboutme'] = html_entity_decode ($row->valueP);
		//Remove start and end quotes:
		$matches = array();
		if (preg_match('/^\"(.*)\"$/', $data['aboutme'], $matches)) {
			$data['aboutme'] = $matches[1];
		}
	}
	elseif ($row->keyP == "profile.address1") {
		$data['address1'] = html_entity_decode ($row->valueP);
		//Remove start and end quotes:
		$matches = array();
		if (preg_match('/^\"(.*)\"$/', $data['address1'], $matches)) {
			$data['address1'] = $matches[1];
		}
	}
	elseif ($row->keyP == "profile.city") {
		$data['city'] = html_entity_decode ($row->valueP);
		//Remove start and end quotes:
		$matches = array();
		if (preg_match('/^\"(.*)\"$/', $data['city'], $matches)) {
			$data['city'] = $matches[1];
		}
	}
	elseif ($row->keyP == "profile.country") {
		$data['country'] = html_entity_decode ($row->valueP);
		//Remove start and end quotes:
		$matches = array();
		if (preg_match('/^\"(.*)\"$/', $data['country'], $matches)) {
			$data['country'] = $matches[1];
		}
	}
	elseif ($row->keyP == "profile.postal_code") {
		$data['postalCode'] = html_entity_decode ($row->valueP);
		//Remove start and end quotes:
		$matches = array();
		if (preg_match('/^\"(.*)\"$/', $data['postalCode'], $matches)) {
			$data['postalCode'] = $matches[1];
		}
	}
	elseif ($row->keyP == "profile.website") {
		$data['website'] = html_entity_decode ($row->valueP);
		//Remove start and end quotes:
		$matches = array();
		if (preg_match('/^\"(.*)\"$/', $data['website'], $matches)) {
			$data['website'] = $matches[1];
		}
	}
}

$response["success"] = true;
$response["results"] = $data;

echo json_encode($response);

?>