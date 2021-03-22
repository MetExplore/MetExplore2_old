<?php
$link = new mysqli( get_cfg_var("metexplore.cfg.DB_HOST"), get_cfg_var("metexplore.cfg.DB_USER"), get_cfg_var("metexplore.cfg.DB_PSWD"), get_cfg_var("metexplore.cfg.DB_NAME_DATA")) or die("Error " . mysqli_error($link));

if ($link->connect_errno) {
	die('{"status":false, "message":"User database connection failed"}');
}

$link->set_charset("utf8") or die("Error while charging utf8 charset : ". $link->error);

?>
