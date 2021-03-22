<?php
require_once ('config/server_variables.php');
require_once ('userAndProject/addHistoryItem.php');


function AddSQLtoBioSourceLog($idbiosource, $sql, $idUser, $action = null, $link = null)
{
	$filename = DATALOG_DIR."/$idbiosource/datalog_$idbiosource.sql";

	$date =date( 'Y/m/d_H:i:s');
	
	$comment="-- $date: ";
	if (file_exists($filename)) {
		
		$comment.="Update of BioSource $idbiosource by user $idUser:\n";
		    
	} else {
		
		mkdir(DATALOG_DIR."/$idbiosource/", 0777);
		$comment.="Log Creation. Update of BioSource $idbiosource by user $idUser:\n";
		 
	}
	
	$comment.=$sql."\n";
	
	$handle = fopen($filename, "a"); //write only mode but pointer at the end of file
	
	fwrite($handle, $comment);
	
	fclose($handle);
	
	if (isset($action) && $action != null) {
		addHistoryItem($idbiosource, $idUser, $action, $link);
	}
}

?>