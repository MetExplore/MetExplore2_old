<?php


$linkJ = new mysqli( get_cfg_var("metexplore.cfg.DB_HOST"), get_cfg_var("metexplore.cfg.DB_USER"), get_cfg_var("metexplore.cfg.DB_PSWD"), get_cfg_var("metexplore.cfg.DB_NAME_JOOMLA")) or die("Error " . mysqli_error($link));

if ($linkJ->connect_errno) {
    die('{"status":false, "message":"User database connection failed"}');
}
$linkJ->set_charset("utf8") or die("Error while charging utf8 charset : ". $linkJ->error);

?>