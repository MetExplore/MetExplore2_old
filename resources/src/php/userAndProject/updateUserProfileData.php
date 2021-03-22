<?php

require_once '../database/connectionJoomla.php';
require_once '../database/connection.php';
require_once '../user/userFunctions.php';
require_once '../database/userJoomla.php';

$P_idUser=getIdUser();
$P_password = mysqli_real_escape_string($link, $_POST['currentPassword']);
$P_name = mysqli_real_escape_string($link, $_POST['name']);
$P_username = mysqli_real_escape_string($link, $_POST['username']);
$P_email = mysqli_real_escape_string($link, $_POST['email']);
$P_changePwd = mysqli_real_escape_string($link, $_POST['changePwd']);
$P_newPassword = $P_password;
if ($P_changePwd == "true") {
	$P_newPassword = mysqli_real_escape_string($link, $_POST["newPasswd"]);
}
$P_aboutMe = mysqli_real_escape_string($link, $_POST['aboutme']);
$P_address1 = mysqli_real_escape_string($link, $_POST['address1']);
$P_city = mysqli_real_escape_string($link, $_POST['city']);
$P_country = mysqli_real_escape_string($link, $_POST['country']);
$P_postalCode = mysqli_real_escape_string($link, $_POST['postalCode']);
$P_website = mysqli_real_escape_string($link, $_POST['website']);

$sendConfirmMail = false;

//Test1 : l'idUser correspond au username donné
$sql = "SELECT id, email FROM jzlvs_users WHERE username = \"$P_username\"";

$result = mysqli_query ( $linkJ, $sql ) or die ( '{success: false, message: "updateUserProfileData: Error in SQL request n°1"}' );

if ($row = mysqli_fetch_object ( $result )) {
	if ($row->id != $P_idUser) {
		die('{success: false, message: "Access denied. Please contact an administrator"}');
	}
	if ($row->email != $P_email) {
		$sendConfirmMail = true;
	}
}
else {
	if ($row->id != $P_idUser) {
		die('{success: false, message: "Failed searching username. Please contact an administrator"}');
	}
}

//Test2 : check if current password is correct:
$cryptPass = check_crypt_psw($P_password, $P_username, $link);
if ($cryptPass == '0') {
	die('{success: false, message: "Wrong password!"}');
}

//ALL TESTS DONE SUCCESSFULLY: DO UPDATE OF DATA !!

//1. Update password if necessary:
$newPass = get_crypt_psw($P_newPassword, $P_username, $link);
if ($newPass != $cryptPass && $P_changePwd == "true") {
	$sql = "UPDATE jzlvs_users SET password=\"$newPass\" WHERE id=$P_idUser";
	$result = mysqli_query ( $linkJ, $sql ) or die ( '{success: false, message: "updateUserProfileData: Error in SQL request n°2"}' );
}

//2. Update name and email:

$sql = "UPDATE jzlvs_users SET name = \"$P_name\", email = \"$P_email\" WHERE id=$P_idUser";
$result = mysqli_query ( $linkJ, $sql ) or die ( '{success: false, message: "updateUserProfileData: Error in SQL request n°3"}' );

//3. Update profiles:

$properties = array(
		"aboutme" => $P_aboutMe,
		"address1" => $P_address1,
		"city" => $P_city,
		"country" => $P_country,
		"postal_code" => $P_postalCode,
		"website" => $P_website
);

$sets = "";

foreach($properties as $key => $value) {
	$sql = "INSERT INTO `jzlvs_user_profiles` (user_id, profile_key, profile_value) VALUES "
		   ."(". $P_idUser .", \"profile.$key\", \"\\\"$value\\\"\") ON DUPLICATE KEY UPDATE profile_value=\"\\\"$value\\\"\"";
	$result = mysqli_query ( $linkJ, $sql ) or die ( '{success: false, message: "updateUserProfileData: Error in SQL request n°4 for key '. $key .'"}' );
}

if ($sendConfirmMail) {
	//TODO: envoyer un mail de confirmation de changement d'adresse mail.
}

echo "{success: true}";

?>