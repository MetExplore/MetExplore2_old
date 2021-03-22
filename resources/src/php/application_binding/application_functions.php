<?php


/**
 * Read a log for an analysis
 * @param  $dir : a path
 * @param  $session : if true, indicates that analysis is stored in the session directory
 */
function readLog($session, $log_file) {
	
	if($session == false)
	{
		$idUser = getIdUser();
		if($idUser == -1)
		{
			error_log("Error : trying to get user analyses without being connected");
			return analyses;
		}
	}
	
	if (file_exists ( $log_file )) {
		$log = file_get_contents ( $log_file );


		$analysis ["log"] = $log;
	}
	
	return $analysis ;
}

/**
 * List the analyses in a directory and put them in the analyses array
 * @param  $dir : a path
 * @param  $analyses : an array
 * @param  $session : if true, indicates that analysis is stored in the session directory
 */
function listAnalyses($dir, $analyses, $session, $link) {
	
	if($session == false)
	{
		$idUser = getIdUser();
		if($idUser == -1)
		{
			error_log("Error : trying to get user analyses without being connected");
			return $analyses;
		}
	}
	
	
	foreach ( glob ( "$dir/results*" ) as $subdir ) {
		if (is_dir ( $subdir )) {
			$key = basename ( $subdir );

			$pid_file = "$subdir/PID";
			
			$result_file = "$subdir/results.json";
			$title_file = "$subdir/title";
			
			$resultType_file = "$subdir/resultType";
			
			$date_file = "$subdir/date";
			$log_file = "$subdir/log";

			$target_bs_file ="$subdir/targetBS";
			$seeds_file = "$subdir/seedslist";

			$status = "log";
			
			$analysis = array();
	
			if (file_exists ( $pid_file ) && file_exists ( $title_file ) && file_exists ( $date_file ) && file_exists ( $resultType_file )) {
				
				$pid = trim(file_get_contents ( $pid_file ));

				$title = file_get_contents ( $title_file );
				$date = file_get_contents ( $date_file );
				$resultType = file_get_contents ( $resultType_file );

				if (file_exists ( $target_bs_file )) {
					$analysis ["targetBiosource"]=file_get_contents ( $target_bs_file );
				}
		 		if (file_exists ( $seeds_file )) {
				    $analysis ["seeds"]=file_get_contents ( $seeds_file );
				}

				
				$analysis ["date"] = $date;
				$analysis ["title"] = $title;
				$analysis ["resultType"] = $resultType;
				
				$analysis["id"] = basename($subdir);
				
				$analysis["session"] = $session;
				
				$analysis["path"] = "";
				if (file_exists ( $log_file )) {
					$log = file_get_contents ( $log_file );

					$l = strlen($log);

					if($l > 500) {
						$log = substr($log, $l-500, 500);
						$log = "[...]".$log;
					}


					$analysis ["log"] = $log;
				}
				
				if ($pid == -1)
				{
					$analysis ["status"] = "queue";
					$analysis ["log"] = "In the Data Center cluster queue";
				}
				else if (posix_getpgid ( $pid ) == false) {
					// The process is not running anymore
					if (! file_exists ( $result_file )) {
						$analysis ["status"] = "error";
					} else {
						$json = json_decode ( file_get_contents ( $result_file ), true );
						if ($json ["success"] == "true") {
							$analysis ["status"] = "success";
						} else {
							$analysis ["status"] = "error";
						}
						
						if($session == true)
						{
							$url = TMP_URL;
							
							if (! isset ( $_SESSION )) {
								session_start ();
							}
							$url .= "/".session_id();
						}
						else {
							$userDirectory = basename(getUserDirectory($idUser, $link));
							$url = USERFILES_URL."/$userDirectory";
						}

						$urllog = $url."/".basename($subdir)."/log";
						$url .= "/".basename($subdir)."/results.json";
						
						$analysis["logpath"] = $urllog;
						$analysis ["path"] = $url;
					}
				} else {
					$analysis ["status"] = "log";
				}
				
				array_push ( $analyses, $analysis );
			}
		}
	}
	
	return $analyses;
}

/**
 * List the analyses in a directory and put them in the analyses array
 * @param  $dir : a path
 * @param  $analyses : an array
 * @param  $session : if true, indicates that analysis is stored in the session directory
 */
function listAnalysesRank($dir, $analyses, $session, $link) {
	
	if($session == false)
	{
		$idUser = getIdUser();
		if($idUser == -1)
		{
			error_log("Error : trying to get user analyses without being connected");
			return $analyses;
		}
	}
	
	
	foreach ( glob ( "$dir/ranks*" ) as $subdir ) {
		if (is_dir ( $subdir )) {
			$key = basename ( $subdir );
  			
  			$job = "sh ".WEB_DIR."/resources/jobScripts/checkStatus.sh -d $subdir -j ".$key;
            exec ( $job );

			$result_file = "$subdir/results.json";
			$title_file = "$subdir/title";
			$status_file = "$subdir/status.txt";
			
			$resultType_file = "$subdir/resultType";
			
			$date_file = "$subdir/date";
			$log_file = "$subdir/log";

			$target_bs_file ="$subdir/targetBS";
			$seeds_file = "$subdir/seedslist";

			$analysis = array();
			
			if (file_exists ( $title_file ) && file_exists ( $date_file ) && file_exists ( $resultType_file )) {

				$title = file_get_contents ( $title_file );
				$date = file_get_contents ( $date_file );
				$resultType = file_get_contents ( $resultType_file );

				if (file_exists ( $target_bs_file )) {
					$analysis ["targetBiosource"]=file_get_contents ( $target_bs_file );
				}
		 		if (file_exists ( $seeds_file )) {
				    $analysis ["seeds"]=file_get_contents ( $seeds_file );
				}

				
				$analysis ["date"] = $date;
				$analysis ["title"] = $title;
				$analysis ["resultType"] = $resultType;
				
				$analysis["id"] = basename($subdir);
				
				$analysis["session"] = $session;
				
				$analysis["path"] = "";
				if (file_exists ( $log_file )) {
					$log = file_get_contents ( $log_file );

					$l = strlen($log);

					if($l > 500) {
						$log = substr($log, $l-500, 500);
						$log = "[...]".$log;
					}


					$analysis ["log"] = $log;
				}

				$output = file_get_contents($status_file);
			 	$pending = strpos($output, 'PENDING');
                $running = strpos($output, 'RUNNING');
                $completed = strpos($output, 'COMPLETED');

                if ($pending!==false)
                {
					$analysis ["status"] = "queue";
					$analysis ["log"] = "In the Data Center cluster queue";
                }
                else if ($running!==false) {
                    $analysis ["status"] = "log";
				}
				else if ($completed!==false) {
					// The process is not running anymore
					if (! file_exists ( $result_file )) {
						$analysis ["status"] = "error";
					} else {
						$json = json_decode ( file_get_contents ( $result_file ), true );
						if ($json ["success"] == "true") {
							$analysis ["status"] = "success";
						} else {
							$analysis ["status"] = "error";
						}

						if($session == true)
						{
							$url = TMP_URL;

							if (! isset ( $_SESSION )) {
								session_start ();
							}
							$url .= "/".session_id();
						}
						else {
							$userDirectory = basename(getUserDirectory($idUser, $link));
							$url = USERFILES_URL."/$userDirectory";
						}

						$urllog = $url."/".basename($subdir)."/log";
						$url .= "/".basename($subdir)."/results.json";

						$analysis["logpath"] = $urllog;
						$analysis ["path"] = $url;
					}
				}

				
				array_push ( $analyses, $analysis );
			}
		}
	}
	
	return $analyses;
}

/**
 * Delete an analysis directory
 * @param $dir : path
 */
function deleteAnalysisDir($dir) {
	foreach ( glob ( "$dir/*" ) as $file){
		if(is_file($file))
		{
			unlink($file);
		}
	}
	
	rmdir($dir);
	
}


?>
