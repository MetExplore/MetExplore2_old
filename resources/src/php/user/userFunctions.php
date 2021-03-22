<?php
require_once (__DIR__ . "/../biodata/biosource/bioSourceFunctions.php");
require_once (__DIR__ . "/../config/server_variables.php");
require_once (__DIR__ . "/../utils/file_functions.php");

/**
 * Get the rights of a user for a given biosource
 *
 *
 * @param int $idUser        	
 * @param int $idBioSource        	
 * @param
 *        	mysql connection $link
 * @return string acces : "r" (read), "denied" (no access)
 */
function getBioSourceRights($idUser, $idBioSource, $link) {
	// Checks first if the biosource is in UserBioSource
	$status = getBioSourceStatus ( $idBioSource, $link );

	$idUser=mysqli_real_escape_string ( $link , $idUser );
	
	if ($status == null) {
		return "denied";
	} else {
		
		if ($status == "public") {
			return "r";
		} else {
			
			$sqlAc = "SELECT Status.status AS access FROM UserBioSource, Status WHERE UserBioSource.idBioSource = $idBioSource AND UserBioSource.idUser = '$idUser' AND UserBioSource.Acces = Status.idStatus;";
			$resultAc = mysqli_query ( $link, $sqlAc );
			if ($resultAc) {
				if (mysqli_num_rows ( $resultAc ) == 0) {
					return "denied";
				} else {
					
					$access = "r";
					
					// We get the last record
					while ( $rowAc = mysqli_fetch_object ( $resultAc ) ) {
						$access = $rowAc->access;
					}
					
					return $access;
				}
			} else {
				//error_log ( "[ERROR] sql error, query : $sqlAc\n" );
				return "denied";
			}
		}
	}
}

/**
 * Get the rights of a user for a given project
 *
 *
 * @param int $idUser        	
 * @param int $idProject        	
 * @param
 *        	mysql connection $link
 * @return string acces : "r" (read), "denied" (no access)
 */
function getProjectRights($idUser, $idProject, $link) {
	// Checks first if the biosource is in UserBioSource

	$idUser=mysqli_real_escape_string ( $link , $idUser );
	$idProject=mysqli_real_escape_string ( $link , $idProject );


	$sqlAc = "SELECT Status.status AS access, UserInProject.active AS active FROM UserInProject, Status WHERE UserInProject.idProject = '$idProject' AND UserInProject.idUser = '$idUser' AND UserInProject.idAccess = Status.idStatus";
	$resultAc = mysqli_query ( $link, $sqlAc );
	if ($resultAc) {
		if (mysqli_num_rows ( $resultAc ) == 0) {
			return "denied";
		} else {
			
			$access = "r";
			
			// We get the last record
			while ( $rowAc = mysqli_fetch_object ( $resultAc ) ) {
				$access = $rowAc->active == 1 ? $rowAc->access : "denied";
			}
			
			return $access;
		}
	} else {
		//error_log ( "[ERROR] sql error, query : $sqlAc\n" );
		return "denied";
	}
}

/**
 * Check if the userId given as parameter is the same than the idUser stored in the SESSION array
 *
 * @param int $idUser        	
 * @return boolean
 */
function checkUserId($idUser) {
	if (! isset ( $_SESSION )) {
		session_start ();
	}
	
	if (! array_key_exists ( 'idUser', $_SESSION )) {
		return false;
	}
	
	if ($_SESSION ['idUser'] != $idUser) {
		// $response["success"] = false;
		// $response["message"] = "Login failed!";
		//error_log ( "[MetExplore Violation] client user and server user are different" );
		// echo (json_encode($response));
		return false;
	}
	return true;
}

/**
 *
 * @return int : the id user stored in the SESSION array or -1 if not stored
 */
function getIdUser() {
	$idUser = - 1;
	
	if (! isset ( $_SESSION )) {
		session_start ();
	}
	
	if (isset ( $_SESSION ) && array_key_exists ( 'idUser', $_SESSION )) {
		$idUser = $_SESSION ['idUser'];
	}
	
	return $idUser;
}

/**
 *
 * @return int : the id project stored in the SESSION array or -1 if not stored
 */
function getIdProject() {
	$idProject = - 1;
	
	if (! isset ( $_SESSION )) {
		session_start ();
	}
	
	if (isset ( $_SESSION ) && array_key_exists ( 'idProject', $_SESSION )) {
		$idProject = $_SESSION ['idProject'];
	}
	
	return $idProject;
}

/**
 *
 * @param int $idUser        	
 * @return String
 *
 */
function getUsermd5($idUser, $link) {

	$idUser=mysqli_real_escape_string ( $link , $idUser );

	$sql = "SELECT `UserMet`.`username` AS login FROM `UserMet` WHERE `id`='$idUser'";
	
	$result = mysqli_query ( $link, $sql );
	
	if ($result) {
		if (mysqli_num_rows ( $result ) == 0 || mysqli_num_rows ( $result ) > 1) {
			//error_log ( "[ERROR] sql error, query : $sql \n" );
			return null;
		} else {
			$row = mysqli_fetch_object ( $result );
			$username = $row->login;
			
			return md5 ( $username );
		}
	} else {
		//error_log ( "[ERROR] sql error, query : $sql \n" );
		return null;
	}
}


/**
 * Returns the user directory
 * @param id $idUser
 * @param connection id $link
 * @return string|NULL
 */
function getUserDirectory($idUser, $link) {
	if ($idUser != - 1) {
		$md5 = getUsermd5 ( $idUser, $link );
		if ($md5 != null) {
			return USERFILES_DIR . "/" . $md5;
		} else {
			return null;
		}
	}
	return null;
}

/**
 * @param $P_idBiosource
 * @param $P_idUser
 * @param $git
 * @param $link
 * create file from $git data
 * push file
 *
 */
function addGit_updateDB($P_idBioSource, $P_idUser, $elements, $tabOrigin, $link)
{
    $sql = "SELECT * FROM UserMet WHERE UserMet.id = $P_idUser;";
    $result = mysqli_query ( $link, $sql );
    $row= mysqli_fetch_object($result);
    $email= $row->email;
	// recuperer les infos database table biosource_data
	foreach ($tabOrigin as $origin) {
        $sql = "SELECT * FROM BioSource_data WHERE BioSource_data.id = '$origin';";
        $result = mysqli_query ( $link, $sql );
        $row= mysqli_fetch_object($result);

        //faire un tableau de tous les datajson de la database
        $tabjson= json_decode($row->datajson, false);
        $taball[$origin]= $tabjson;

        //faire un tableau de tous les dbIdentifiers de la table biosource_data
        $len= count($tabjson);
        for ($i = 0; $i < $len; $i++)
        {
            $dbid= $tabjson[$i]->dbIdentifier;
            $tabdbId[]= $dbid ;
        }
        $taballdbId[$origin]= $tabdbId;
        $file[$origin]= $row->nameFile;
        //error_log($tabdbId);
    }


    foreach ($elements as $elt) {
		//recupere le json
		$origin= $elt['origin'];
		$dbId= $elt['dbIdentifier'];
		$field= $elt['field'];
		$value= $elt['value'];
        //error_log($dbId);
        $i= array_search($dbId,$taballdbId[$origin],true);
        //error_log($i);
        if ($i >= 0)  $taball[$origin][$i]->$field= $value;
        else {
            //ajouter dans le tab (si il n'y avait pas de valeur mais que le user en a mis
			// pas present dans json

		}
    }
    //error_log (json_encode($taball));

    //error_log(json_encode($newtab));
    foreach ($tabOrigin as $origin) {
		//exec ("git checkout https://forgemia.inra.fr/metexplore/data/metexplore-data.git".$file[$origin]. " ". $tmpFile = TMP_DIR . "test.txt"); //.$file[$origin] ;);
		//ecriture dans la base de donnée
    	$json= json_encode($taball[$origin]);
        $sql = "UPDATE BioSource_data SET datajson= '$json' WHERE BioSource_data.id = '$origin';";
        $result = mysqli_query ( $link, $sql );

    	//creation du fichier tabulé
        $tmpFile = createRandomFileName(TMP_DIR,"gitdata","txt"); //.$file[$origin] ;
        //error_log($tmpFile);
        //error_log($email);
        //error_log($file[$origin]);
        jsonToCsv($json,$tmpFile);
        $str= "curl -i -X POST  --user fvinson:11d3f5a9a42f893ebb5df064d436725d1a http://vm-metexplore-dev.toulouse.inra.fr:8080/job/addDataFromMetexplore/buildWithParameters?param=$tmpFile".",".$email.",".$file[$origin];
        //error_log($str);
        exec ($str);

    }


    // creer fichier correspondant + pusher
	//pour les colonnes qui existent deja mettre le tag et
	// dans le recherche du dbidentifier si pas trouvé c'est qu'il n'existe pas donc valeur de la database et non des suppl data
}

?>
