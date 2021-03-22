<?php
/*
 * define('DBHOST','localhost');
define('DBUSER','root');
define('DBPASS','');
define('DBNAME','login-registration');

//application address
define('DIR','http://localhost/');
define('SITEEMAIL','florence.vinson@gmail.com');

try {

	//create PDO connection
	$db = new PDO("mysql:host=".DBHOST.";charset=utf8mb4;dbname=".DBNAME, DBUSER, DBPASS);
 */

define('DBHOST',get_cfg_var("metexplore.cfg.DB_HOST"));
define('DBUSER',get_cfg_var("metexplore.cfg.DB_USER"));
define('DBPASS',get_cfg_var("metexplore.cfg.DB_PSWD"));
define('DBNAME',get_cfg_var("metexplore.cfg.DB_NAME_DATA"));
// = new PDO('mysql:host=localhost;dbname=metexplore', $userMySql, $pwd);
$db = new PDO("mysql:host=".DBHOST.";dbname=".DBNAME, DBUSER, DBPASS, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION ));
//$db = new PDO("mysql:host=".metexplore.cfg.DB_HOST.";charset=utf8mb4;dbname=".metexplore.cfg.DB_NAME_DATA, metexplore.cfg.DB_USER, metexplore.cfg.DB_PSWD);
//$link = new mysqli( get_cfg_var("metexplore.cfg.DB_HOST"), get_cfg_var("metexplore.cfg.DB_USER"), get_cfg_var("metexplore.cfg.DB_PSWD"), get_cfg_var("metexplore.cfg.DB_NAME_DATA")) or die("Error " . mysqli_error($link));
//
//if ($link->connect_errno) {
//	die('{"status":false, "message":"User database connection failed"}');
//}
//
//$link->set_charset("utf8") or die("Error while charging utf8 charset : ". $link->error);
/*
 * metexplore.cfg.DB_HOST = "localhost"
metexplore.cfg.DB_NAME_DATA = "metexplore"
metexplore.cfg.DB_NAME_JOOMLA = "metexploreJoomla3"
metexplore.cfg.DB_USER = "root"
metexplore.cfg.DB_PSWD = ""
 */
?>
