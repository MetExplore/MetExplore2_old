<?php 
// 
	require_once 'database/connection.php';
	require_once 'user/userFunctions.php';
	$P_idObject=$_GET['idObject'];
	$P_typeObject=$_GET['typeObject'];
	$typeSQL = ucfirst ($P_typeObject); //Type SQL : same as type of object but with first letter capitalized (Reaction, Pathway, ...).
	
	//Check rights:
	$idUser = getIdUser();
	if ($idUser == -1)
	{
		die('{success: false, message:"Login failed!"}');
	}
	
	//Check user who ask deletion is the comment's owner, or have access p (owner) or rw (read/write):
	if ($P_typeObject == "project") {
		$sql = "SELECT Status.status AS status FROM UserInProject, Status WHERE UserInProject.idProject = $P_idObject AND UserInProject.idAccess = Status.idStatus AND UserInProject.idUser = $idUser";
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
			   ."AND UserBioSource.idUser = $idUser "
			   ."AND UserBioSource.Acces = Status.idStatus";
	}
	$result=mysqli_query ($link, $sql) or die ('{success: false, message: "an error has occured. Please contact metexplore@toulouse.inra.fr. Error message: error in SQL request n°0 in datacomment: '. mysqli_error ($link) .'"}');
	if (mysqli_num_rows($result) == 0)
	{
		die('{success: false, message: "Error while getting comments: you have not access to the BioSource or Project."}');
	}
	
	
	$sql="SELECT DISTINCT Comment.idComment AS idComment, Comment.text AS text, Comment.title AS title, Comment.idUser AS idUser FROM Comment, ${typeSQL}HasComment WHERE  ${typeSQL}HasComment.idComment = Comment.idComment AND ${typeSQL}HasComment.id$typeSQL = $P_idObject";
	
	$result=mysqli_query ($link, $sql) or die (mysqli_error ($link));
        
    $data = array();
	while ($row=mysqli_fetch_object($result))
	{
		$idUser = $row->idUser;
		//Get user name:
		$sqlUser = "SELECT name FROM UserMet WHERE id=$idUser";
		$resultUser=mysqli_query ($link, $sqlUser) or die (mysqli_error ($link));
		$rowUser = mysqli_fetch_object($resultUser);
		if($rowUser)
			$row->nameUser=$rowUser->name;
		else
			$row->nameUser="None";
		$P_idComment = $row->idComment;
		
		//Attachments:
		$sqlC="SELECT Document.id AS attachId, Document.filePath AS attachFile," 
			 ."	Document.name AS attachName, Document.author AS attachAuthor," 
			 ." Document.description AS attachDesc"
			 ." FROM Document"
			 ." WHERE idComment=$P_idComment";
		$resultC=mysqli_query ($link,$sqlC) or die (mysqli_error ($link));
		$attachments = array();
		while ($rowC=mysqli_fetch_object($resultC))
		{
			$values = array();
			$values["id"] = $rowC->attachId;
			$values["filePath"] = $rowC->attachFile;
			$values["nameDoc"] = $rowC->attachName;
			$values["author"] = $rowC->attachAuthor;
			$values["desc"] = $rowC->attachDesc;
			array_push($attachments, $values);
		}
		$row->attachments = $attachments;
		$row->typeObj = $P_typeObject;
		$row->idObj = $P_idObject;
    	$data [] = $row;
	}
	
	$response["success"] = true;
	$response["results"] = $data;
	
 	echo json_encode($response);
?>
