<?php 
// 
	require_once 'database/connection.php';
	require_once 'config/server_variables.php';
	require_once 'user/userFunctions.php';
	
	$P_idComment=mysqli_real_escape_string($link, $_POST['idComment']); //Id of the comment
	$P_idObject=mysqli_real_escape_string($link, $_POST['idObject']); //Id of the object associated to the comment
	$P_typeObject=mysqli_real_escape_string($link, $_POST['typeObject']); //Type og this object (reaction, pathway, project, ...)
	$typeSQL = ucfirst ($P_typeObject); //Type SQL : same as type of object but with first letter capitalized (Reaction, Pathway, ...).
	
	
	//Check rights:
	$idUser = getIdUser();
	if ($idUser == -1)
	{
		die('{success: false, message:"Login failed!"}');
	}
	
	//Check user who ask deletion is the comment's owner, or have access p (owner) or rw (read/write):
	if ($P_typeObject == "project") {
		$sql = "SELECT Comment.idUser AS idUser, Status.status AS status FROM Comment, UserInProject, Status WHERE UserInProject.idProject = $P_idObject AND UserInProject.idAccess = Status.idStatus AND Comment.idComment=$P_idComment";
	}
	else {
		if (!in_array($P_typeObject, array("enzyme", "protein", "gene"))) {
			$idDB = "idDB";
		}
		else {
			$idDB = "dbId";
		}
		$sql = "SELECT Comment.idUser AS idUser, Status.status AS status "
			   ."FROM Comment, ${typeSQL}HasComment, ${typeSQL}, BioSource, UserBioSource, Status "
			   ."WHERE Comment.idComment=$P_idComment "
			   ."AND Comment.idComment = ${typeSQL}HasComment.idComment "
			   ."AND ${typeSQL}HasComment.id${typeSQL} = ${typeSQL}.id "
			   ."AND ${typeSQL}.$idDB = BioSource.idDB "
			   ."AND BioSource.id = UserBioSource.idBioSource "
			   ."AND UserBioSource.idUser = $idUser "
			   ."AND UserBioSource.Acces = Status.idStatus";
	}
	$result=mysqli_query ($link, $sql) or die ('{success: false, message: "an error has occured. Please contact metexplore@toulouse.inra.fr. Error message: error in SQL request n°0 in deletecomment'. mysqli_error ($link) .'"}');;
	if ($row = $row=mysqli_fetch_object($result))
	{
		if ($row->idUser != $idUser && !in_array($row->status, array('p', 'rw')))
		{
			die('{success: false, message:"Access denied!"}');
		}
	}
	else {
		die('{success: false, message: "Error while retriving rights of user to delete comment: ' . mysqli_error ($link) . '"}');
	}
	
	//Delete on association table:
	$sql = "DELETE FROM ${typeSQL}HasComment WHERE idComment=$P_idComment AND id${typeSQL}=$P_idObject";
	$result=mysqli_query ($link, $sql) or die ('{success: false, message: "an error has occured. Please contact metexplore@toulouse.inra.fr. Error message: error in SQL request n°1 in deletecomment'. mysqli_error ($link) .'"}');
	
	//DELETE ATTACHED DOCUMENTS FROM DISK IF ORPHANS:
	//1. Get files:
	$sql = "SELECT filePath FROM Document WHERE idComment=$P_idComment";
	$result=mysqli_query ($link, $sql) or die ('{success: false, message: "an error has occured. Please contact metexplore@toulouse.inra.fr. Error message: error in SQL request n°4 in deletecomment'. mysqli_error ($link) .'"}');
	$filesToDelete = array();
	while ($row = $row=mysqli_fetch_object($result))
	{
		$filePath = $row->filePath;
		if (strstr($filePath, USERFILES_URL)) {
			if (!in_array($filePath, $filesToDelete))
				array_push($filesToDelete, $filePath);
		}
	}
	//2. Check files:
	foreach ($filesToDelete as $file)
	{
		$sql = "SELECT id, filePath FROM Document WHERE idComment != $P_idComment AND filePath = \"$file\"";
		$result=mysqli_query ($link, $sql) or die ('{success: false, message: "an error has occured. Please contact metexplore@toulouse.inra.fr. Error message: error in SQL request n°5 in deletecomment'. mysqli_error ($link) .'"}');
		if (mysqli_num_rows ($result) == 0)
		{
			//WE CAN DELETE FILE:
			$realPath = str_replace(USERFILES_URL, USERFILES_DIR, $file, $count);
			if ($count != 1)
			{
				die('{success: false, message"Error while getting path in deleting attachments!"}');
			}
			if (file_exists($realPath))
				unlink($realPath) or die('{success: false, message: "Error when trying to delete file on the server!"}');
		}
	}
	
	//DELETE COMMENT:
	$sql = "DELETE FROM Comment WHERE idComment=$P_idComment";
	$result=mysqli_query ($link, $sql) or die (mysqli_error ($link));
	
	$response["success"] = true;
	echo json_encode($response);
	
?>