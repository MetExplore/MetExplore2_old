<?php
/**
 * Delete a job
 */
require_once ('../database/connection.php');
require_once ('../config/server_variables.php');
require_once ("application_functions.php");
require_once ("../user/userFunctions.php");

// set $dir_id and $stored_in_session
extract ( $_POST, EXTR_OVERWRITE );

// error_log ( "Stored in session : " . $stored_in_session );

if ($stored_in_session == "true") {
	
	if (! isset ( $_SESSION )) {
		session_start ();
	}
	
	// The job is stored in the session directory
	$session_dir = TMP_DIR . "/" . session_id ();
	$dir_to_remove = "$session_dir/$dir_id";
} else {
	$idUser = getIdUser ();
	if ($idUser == - 1) {
		//error_log ( "Error : trying to delete user analyses without being connected" );
		$response ["success"] = false;
		$response ["message"] = "Error : trying to delete user analyses without being connected";
		echo json_encode ( $response );
		return;
	}
	$userDirectory = getUserDirectory ( $idUser, $link );
	$dir_to_remove = "$userDirectory/$dir_id";
}
// error_log ( "to remove : $dir_to_remove" );

if (! is_dir ( $dir_to_remove )) {
	$response ["success"] = false;
	$response ["message"] = "No analysis to remove";
} else {

	// Stop the process if it's still running
    $isRank = strpos($dir_id, 'rank');

    if ($isRank===false) {
        $pid_file = "$dir_to_remove/PID";
        $pid = file_get_contents($pid_file);

        $error = false;
        if (posix_getpgid($pid) != false) {
            $flag = posix_kill($pid, 9);

            if ($flag == false) {
                $response ["success"] = false;
                $response ["message"] = "Impossible to stop the process";
                $error = true;
            }
        }
    }
    else
    {
        $job = "sh ".WEB_DIR."/resources/jobScripts/cancelJob.sh -j ".basename($tempdir);
        exec ( $job );
    }

	// Remove the directory if the process does not run or the process could be stopped
	if ($error == false) {
		deleteAnalysisDir ( $dir_to_remove );
		$response ["success"] = true;
		$response ["message"] = "Analysis successfully deleted";
	}
}

echo json_encode ( $response );

?>