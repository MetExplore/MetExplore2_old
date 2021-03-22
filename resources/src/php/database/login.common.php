<?php
require_once ("../javascript/xajax/xajax_core/xajax.inc.php");
session_start();
$xajax = new xajax("login.server.php");
$xajax->configure('javascript URI','../javascript/xajax/');
$xajax->register(XAJAX_FUNCTION,"loginForm");
?>