<?php

/**
* returns true or false whether the session is still active or not
* @return bool 
*/
function is_session_active(){

	$now = time();

	if (!isset($_COOKIE['PHPSESSID'])){
		// if no seesion is found, start a new one but still return false to indicate
		// that the old one has expired
		session_start();
		return false ;
	}


	session_start(); // ready to go!

	$now = time();
	if (isset($_SESSION['discard_after']) && $now > $_SESSION['discard_after']) {
	    // this session has worn out its welcome; kill it and start a brand new one
	    session_unset();
	    session_destroy();
	    return false ;
	}else{
		// $_SESSION['discard_after'] = $now + 86400;
		$_SESSION['discard_after'] = $now + 86400;
		return true;
	}


	// if ( version_compare(phpversion(), '5.4.0', '>=') ) {
	// 	session_start();
	// 	error_log("session_status: ".session_status());
	// 	error_log("PHP_SESSION_ACTIVE: ".PHP_SESSION_ACTIVE);

	// 	return session_status() === PHP_SESSION_ACTIVE ? true : false;
	// } else {
		// error_log("message: ".session_id());
		// return session_id() == '' ? false : true;
	// }
}


?>