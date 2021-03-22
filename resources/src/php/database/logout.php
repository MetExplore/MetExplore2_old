<?php

session_start();
if (isset($_SESSION['idUser']) ) {
	  	setcookie("PHPSESSID","",time()-3600,"/");
		unset($_SESSION['idUser']);
		unset($_SESSION['idProject']);
		session_destroy();
};

echo "{success: true}";

?>