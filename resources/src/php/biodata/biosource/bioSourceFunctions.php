<?php 

/**
 * 
 * Returns the status of a biosource : private or public
 * If the id biosource is not in the table UserBioSource, then the biosource is public, otherwise it is private.
 * 
 * 
 * @param integer $idBioSource
 * @return string : private or public
 */
function getBioSourceStatus($idBioSource, $link) {

	$idBioSource=mysqli_real_escape_string ( $link , $idBioSource );
	
	$sql =  "SELECT * FROM BioSource WHERE BioSource.id = '$idBioSource';";
	$res = mysqli_query ( $link, $sql );
	
	if ($res) {
		if (mysqli_num_rows ( $res ) == 0) {
			return "undefined";
		}
	}
	else {
		//error_log("[ERROR][getBioSourceStatus] Sql error with the query $sql");
		return null;
	}
	
	
	
	$sql = "SELECT * FROM UserBioSource WHERE UserBioSource.idBioSource = '$idBioSource';";
	$res = mysqli_query ( $link, $sql );
	
	if ($res) {
	
		if (mysqli_num_rows ( $res ) == 0) {
			return "public";
		}
		else {
			return "private";
		}
	}
	else {
		//error_log("[ERROR][getBioSourceStatus] Sql error with the query $sql");
		return null;
	}
	
}

?>