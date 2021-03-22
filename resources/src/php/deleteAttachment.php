<?php

session_start();

require_once 'database/connection.php';
require_once 'config/server_variables.php';
require_once 'user/userFunctions.php';


$severalDeletions = false;

if (isset($_POST["attToDel"]))
{
	$attToDel = json_decode($_POST["attToDel"], true);
	$severalDeletions = true;
}
else 
{
	$idAttachment = $_POST["idAttachment"];
}

$P_idComment=mysqli_real_escape_string($link, $_POST['idComment']);
$P_idObject=mysqli_real_escape_string($link, $_POST['idObject']);
$P_typeObject=mysqli_real_escape_string($link, $_POST['typeObject']);
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
$result=mysqli_query ($link, $sql) or die ('{success: false, message: "an error has occured. Please contact metexplore@toulouse.inra.fr. Error message: error in SQL request n°0 in deletecomment: '. mysqli_error ($link) .'"}');;
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

//Start deletion
if(!$severalDeletions) {
	
	$doDeleteFile = true; //Delete the file physically on the server if true
	
	if (isset($_POST["filePath"]))
	{
		$realPath = USERFILES_DIR . $_POST["filePath"];
		$pathUrl = USERFILES_URL . $_POST["filePath"];
	}
	else 
	{
		$pathUrl = $_POST["url"];
		if (strstr($pathUrl, USERFILES_URL)) //If true, the file is stored on the server, so we have to delete it physically
		{
			$realPath = str_replace(USERFILES_URL, USERFILES_DIR, $pathUrl, $count);
			if ($count != 1)
			{
				die('{success: false, message"Error while getting path in deleting attachments !"}');
			}
		}
		else //The file is outside of the server, do not delete it physically (no, we can't)
		{
			$realPath = "null";
			$doDeleteFile=false;
		}
	}
	deleteAttachment($link, $idAttachment, $pathUrl, $realPath, $doDeleteFile);
}
else {
	foreach ($attToDel as $att) {
		$idAttachment = $att["id"];
		$doDeleteFile = true; //Delete the file physically on the server if true
		
		if (array_key_exists("path", $att))
		{
			$realPath = USERFILES_DIR . $att["path"];
			$pathUrl = USERFILES_URL . $att["path"];
		}
		elseif (array_key_exists("url", $att))
		{
			$pathUrl = $att["url"];
			if (strstr($pathUrl, USERFILES_URL)) //If true, the file is stored on the server, so we have to delete it physically
			{
				$realPath = str_replace(USERFILES_URL, USERFILES_DIR, $pathUrl, $count);
				if ($count != 1)
				{
					die('{success: false, message"Error while getting path in deleting attachments !"}');
				}
			}
			else //The file is outside of the server, do not delete it physically (no, we can't)
			{
				$doDeleteFile=false;
			}
		}
		else
		{
			die('{success: false, message: "ERROR in deleting attachments : none path or url was given as arguments !"}');
		}
		deleteAttachment($link, $idAttachment, $pathUrl, $realPath, $doDeleteFile);
	}
}

/**
 * Delete attached document
 * @param unknown $link: to connect to BDD
 * @param unknown $idAttachment: id of the document
 * @param unknown $pathUrl: url of the document (http://www.metexplore.../document.ext)
 * @param unknown $realPath: (/var/www/.../document.ext)
 * @param unknown $doDeleteFile: delete file physically if true
 */
function deleteAttachment($link, $idAttachment, $pathUrl, $realPath, $doDeleteFile)
{
	
	//Do deletion:
	if ($idAttachment != -1)
	{
		$sql = "DELETE FROM Document WHERE id=$idAttachment";
		$result=mysqli_query ($link, $sql) or die ('{success: false, message: "Error while deleting document : ' . mysqli_error ($link) . '-1"}');
	}
	if ($doDeleteFile)
	{
		//Check the physical file on the server is not used in another document
		$sql = "SELECT COUNT(*) AS nbFound FROM Document WHERE filePath=\"$pathUrl\"";
		$result=mysqli_query ($link, $sql) or die ('{success: false, message: "Error while deleting document : ' . mysqli_error ($link) . '-2"}');
		$row = mysqli_fetch_object($result);
		if ($row->nbFound == 0) //If it is not the case, we delete the file physically on ther server:
		{
			//Delete file from server:
			if (file_exists($realPath))
				unlink($realPath) or die('{success: false, message: "Error when trying to delete file on the server !"}');
		}
	}
}

echo "{success: true}";

?>