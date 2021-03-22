<?php 
// 
	require_once 'database/connection.php';
	require_once 'user/userFunctions.php';
	require_once 'config/server_variables.php';
	$P_idComment=mysqli_real_escape_string($link, $_POST['idComment']);
	$P_idObject=mysqli_real_escape_string($link, $_POST['idObject']);
	$P_typeObject=mysqli_real_escape_string($link, $_POST['typeObject']);
	$P_addNew=mysqli_real_escape_string($link, $_POST['addNew']);
	
	$P_text=mysqli_real_escape_string($link, $_POST['text']);
	$P_title=mysqli_real_escape_string($link, $_POST['title']);
	$P_attachments=$_POST['attachments'];
	$typeSQL = ucfirst ($P_typeObject);
	
	$response["success"] = true;
	
	
	$P_idUser= getIdUser();
	
	//CHECK RIGHTS:
	if ($P_idUser == -1)
	{
		die('{success: false, message:"Login failed!"}');
	}
	
	//Check user who ask deletion is the comment's owner, or have access p (owner) or rw (read/write):
	if ($P_typeObject == "project") {
		$sql = "SELECT Status.status AS status FROM UserInProject, Status WHERE UserInProject.idProject = $P_idObject AND UserInProject.idAccess = Status.idStatus AND UserInProject.idUser = $P_idUser";
	}
	else {
		if (!in_array($P_typeObject, array("enzyme", "protein", "gene"))) {
			$idDB = "idDB";
		}
		else {
			$idDB = "dbId";
		}
		$sql = "SELECT Status.status AS status "
			   ."FROM ${typeSQL}, BioSource, UserBioSource, Status "
			   ."WHERE ${typeSQL}.id = $P_idObject "
			   ."AND ${typeSQL}.$idDB = BioSource.idDB "
			   ."AND BioSource.id = UserBioSource.idBioSource "
			   ."AND UserBioSource.idUser = $P_idUser "
			   ."AND UserBioSource.Acces = Status.idStatus";
	}
	$result=mysqli_query ($link, $sql) or die ('{success: false, message: "an error has occured. Please contact metexplore@toulouse.inra.fr. Error message: error in SQL request n°0 in deletecomment'. mysqli_error ($link) .'"}');;
	if ($row = $row=mysqli_fetch_object($result))
	{
		if (!in_array($row->status, array('p', 'rw', 'a')))
		{
			die('{success: false, message:"Access denied!"}');
		}
	}
	else {
			die('{success: false, message: "Error while retriving rights of user to delete comment: ' . mysqli_error ($link) . '"}');
	}
	
	// Check if the user directory exists
	if(! is_dir(USERFILES_DIR))
	{
		die('{success: false, message:"No user directory ! Please contact the administrator"}');
	}
	
	if ($P_typeObject == "project") {
		$rights = getProjectRights($P_idUser, $P_idObject, $link);
	}
	else {
		if (!in_array($P_typeObject, array("enzyme", "protein", "gene"))) {
			$idDB = "idDB";
		}
		else {
			$idDB = "dbId";
		}
		$sql = "SELECT BioSource.id AS idBioSource FROM BioSource, $typeSQL WHERE $typeSQL.id = $P_idObject AND $typeSQL.$idDB = BioSource.idDB";
		$result = mysqli_query($link, $sql) or die('{success: false, message: "Error at first request. Please contact an adminstrator."}');
		$row = mysqli_fetch_object($result);
		$idBioSource = $row->idBioSource;
		$rights = getBioSourceRights($P_idUser, $idBioSource, $link);
	}
	
	if ($rights != "rw" && $rights != "a" && $rights != "p")
	{
		die("{success: false, message: Not allowed!}");
	}
	
	
	//Add/Update comment in Comment table:
	if ($P_addNew == 'true')
	{
		$sql = "INSERT INTO Comment (idUser, text, title) VALUES ($P_idUser, \"$P_text\", \"$P_title\")";
		}
	else
	{
		$sql = "UPDATE Comment SET text=\"$P_text\", title=\"$P_title\" WHERE idComment=$P_idComment";
	}
	$result=mysqli_query ($link, $sql) or die ('{success: false, message: "ERROR in request n°2: '.mysqli_error ($link). '. Please contact an administrator."}');
	if ($P_addNew == 'true')
		$P_idComment = mysqli_insert_id($link);
	$response["idComment"] = $P_idComment;
	
	//If Add : add to relative table
	if ($P_addNew == 'true')
	{
		$sql = "INSERT INTO ${typeSQL}HasComment (id$typeSQL, idComment) VALUES ($P_idObject, $P_idComment)";
		$result=mysqli_query ($link, $sql) or die ('{success: false, message: "ERROR in request n°3: '.mysqli_error ($link). '. Please contact an administrator."}');
	}
	
	//Attachments:
	$deleteAfterAllCopy = array();
	//$attachments will contain all files that have been uploaded
	$attachments = json_decode($P_attachments, true);
	$response["idAttachments"] = array();
	for ($it = 0; $it < count($attachments); $it++) {
		if ($attachments[$it] != null)
		{
			$nameDoc = $attachments[$it]["name"];
			$author = $attachments[$it]["author"];
			$desc = $attachments[$it]["description"];
			$idDoc = $attachments[$it]["id"];
			$filePath = $attachments[$it]["url"];
			//$type = "link";
			
			//Move file to user directory:
			if ($attachments[$it]["path"] != "null")
			{
				$path = $attachments[$it]["path"];
				$parts = explode("/", $path);
				$md5 = $parts[0];
				$userDir = USERFILES_DIR . $md5;
				if (!is_dir($userDir))
				{
					mkdir($userDir);
				}
				$fileName = USERFILES_DIR . $path;
				$origFileName = $fileName;
				$tmpFile = TMP_DIR . $path;
				
				//Get orig nameFile:
				$parts = explode("/", $fileName);
				$fileParts = explode("\\.", end($parts));
				if (count($fileParts) > 2) {
					$nameFile = join(".", array_slice($fileParts, 0, count($fileParts) - 1));
				}
				else {
					$nameFile = $fileParts[0];
				}
				$file = $nameFile . "." . $fileParts[count($fileParts) - 1];
				$fileOrig = $file;
				
				if(file_exists($tmpFile))
				{
					$addFile = true; //True if none file is found with same name and same md5sum
					$newMd5 = md5_file($tmpFile);
					$nb = 2;
					while (file_exists($fileName) && $addFile) {
						$fileName = $origFileName;
						$oldMd5 = md5_file($fileName);
						if ($newMd5 == $oldMd5)	{
							$addFile = false;
						}
						else { //A file is found with the same name but a different md5: so we change the name of the new file to not override it
							$parts = explode("/", $fileName);
							$fileParts = explode("\\.", end($parts));
							if (count($fileParts) > 2) {
								$nameFile = join(".", array_slice($fileParts, 0, count($fileParts) - 1));
							}
							else {
								$nameFile = $fileParts[0];
							}
							$file = $nameFile . "-$nb" . "." . $fileParts[count($fileParts) - 1];
							$parts[count($parts) - 1] = $file;
							$fileName = join("/", $parts);
							$nb++;
						}
					}
					copy($tmpFile, $fileName) or die('{success: false, message:"Error while moving file uploaded. Please contact an administrator.'. $fileName .'"}');
					if(!in_array($tmpFile, $deleteAfterAllCopy))
					{
						array_push($deleteAfterAllCopy, $tmpFile);
					}
					if ($file != $fileOrig)
					{
						$filePath = str_replace($fileOrig, $file, $filePath);
					}
				}
				else
				{
					//error_log("file $tmpFile not found");
					die('{success: false, message:"Error : file uploaded was not found in the server. Please contact an administrator."}');
				}
			}
			
			if ($idDoc < 0) { //It's a now document
				$sql = "INSERT INTO Document (`idComment`,`name`,`author`, `filePath`, `description`) VALUES($P_idComment, \"$nameDoc\", \"$author\", \"$filePath\", \"$desc\")";
			}
			else { //It's an update of an existing document
				$sql = "UPDATE Document SET name=\"$nameDoc\", author=\"$author\", filePath=\"$filePath\", description=\"$desc\" WHERE id=$idDoc";
			}
			$result=mysqli_query ($link, $sql) or die ('{success: false, message: "ERROR in request n°4: '.mysqli_error ($link). '. Please contact an administrator."}');
			if ($idDoc < 0) {
				array_push($response["idAttachments"], array("old" => $idDoc, "new" => mysqli_insert_id($link)));
			}
		}
	}
	
	//Delete tmp files:
	foreach ($deleteAfterAllCopy as $delTmpFile)
	{
		if(file_exists($delTmpFile) && !is_dir($delTmpFile))
		{
			unlink($delTmpFile);
		}
	}
	
	$response["idUser"] = $P_idUser;
	
	echo json_encode($response);
	
?>
