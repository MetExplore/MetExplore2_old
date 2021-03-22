<?php

session_start();

if (isset($_SESSION['idProject'])) {
	$_SESSION['idProject'] = -1;
}

echo '{success: true}';

?>