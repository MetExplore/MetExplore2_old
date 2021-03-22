<?php 
//Get data of presence votes

	require_once '../database/connection.php';
	require_once '../user/userFunctions.php';
	
	$choice = "readOnly";
	if (isset($_POST['choice']))
		$choice = $_POST['choice'];
	$object = $_POST['idObject'];
	$idUser = $_POST['idUser'];
	$type = $_POST['type'];
	$typeSQL = ucfirst ($type);
	
	if (!checkUserId($idUser))
	{
		die('{success: false, message:"Login failed!"}');
	}
	
	$response["success"] = true;
	
	if (!in_array($type, array("enzyme", "protein", "gene")))
		$sql = "SELECT BioSource.id AS idBioSource FROM BioSource, $typeSQL WHERE $typeSQL.id = $object AND $typeSQL.idDB = BioSource.idDB";
	else
		$sql = "SELECT BioSource.id AS idBioSource FROM BioSource, $typeSQL WHERE $typeSQL.id = $object AND $typeSQL.dbId = BioSource.idDB";
	$result = mysqli_query($link, $sql) or failMySql("0", $sql);
	$row = mysqli_fetch_object($result);
	$idBioSource = $row->idBioSource;
	
	if($choice != "readOnly")
	{
		$rights = getBioSourceRights($idUser, $idBioSource, $link);
		
		if ($rights != "rw" && $rights != "a" && $rights != "p")
		{
			die("{success: false, message: Not allowed! $rights}");
		}
	}
		
	if($choice == "objectExists" || $choice == "objectNotExists" || $choice == "objectHasErrors")
	{
		//Search if user has already vote:
		$sql="SELECT id FROM VoteIn$typeSQL WHERE idUser=$idUser AND id$typeSQL=$object";
		$result = mysqli_query($link, $sql) or failMySql("1", $sql);
		$doUpdate = false;
		if ($row = mysqli_fetch_object($result))
		{
			$doUpdate = true;
		}
		if($doUpdate) //Update table
		{
			$sql="UPDATE VoteIn$typeSQL"
				 ." SET idVote = (SELECT idStatus FROM Status WHERE name=\"$choice\")"
				 ." WHERE idUser = $idUser AND id$typeSQL = $object";
		}
		else //Insert new value in table
		{
			$sql="INSERT INTO VoteIn$typeSQL(idUser, id$typeSQL, idVote)"
				 ." VALUES($idUser, $object, (SELECT idStatus FROM Status WHERE name=\"$choice\"))";
		}
		$result = mysqli_query($link, $sql) or failMySql("2", $sql);
	}
	
	else if($choice == "objectNoIdea") {
		//Search if user has already vote:
		$sql="SELECT id FROM VoteIn$typeSQL WHERE idUser=$idUser AND id$typeSQL=$object";
		$result = mysqli_query($link, $sql) or failMySql("3", $sql);
		if ($result)
		{
			//Delete vote:
			$sql="DELETE FROM VoteIn$typeSQL WHERE idUser=$idUser AND id$typeSQL=$object";
			$result = mysqli_query($link, $sql) or failMySql("4", $sql);
		}
	}
	
	$sql = "SELECT Status.name AS userChoice FROM VoteIn$typeSQL, Status"
			." WHERE VoteIn$typeSQL.idUser=$idUser AND VoteIn$typeSQL.id$typeSQL=$object"
			." AND VoteIn$typeSQL.idVote = Status.idStatus";
	$result = mysqli_query($link, $sql) or failMySql("5", $sql);
		$userChoice = $type . "NoIdea";
	if ($row = mysqli_fetch_object($result))
		{
		$userChoice = $row->userChoice;
	}
	$response["userChoice"] = $userChoice;
	
	$sql = "SELECT Status.name AS vote FROM VoteIn$typeSQL, Status WHERE id$typeSQL=$object AND VoteIn$typeSQL.idVote = Status.idStatus";
	$result = mysqli_query($link, $sql) or failMySql("6", $sql);
	$nbYes = 0;
	$nbHasErrors = 0;
	$nbNo = 0;
	while ($row = mysqli_fetch_object($result))
	{
	if($row->vote == "objectExists")
		$nbYes++;
	else if($row->vote == "objectHasErrors")
		$nbHasErrors++;
	else
		$nbNo++;
	}
	$nbTotal = $nbYes + $nbNo + $nbHasErrors;
	$nbTotalDiv = $nbTotal;
	if ($nbTotal == 0) {
		$nbTotalDiv = 1; //To not divise by 0
	}
	$response["nbYes"] = $nbYes;
	$response["nbYesPct"] = round(($nbYes / $nbTotalDiv) * 100, 0);
	$response["nbHasErrors"] = $nbHasErrors;
	$response["nbHasErrorsPct"] = round(($nbHasErrors / $nbTotalDiv) * 100, 0);
		$response["nbNo"] = $nbNo;
	$response["nbNoPct"] = round(($nbNo / $nbTotalDiv) * 100, 0);
		$response["nbTotal"] = $nbTotal;
    
	function failMySql($nb, $sql)
	{
		$response["success"] = false;
		$response["message"] = "Error in database request n°$nb";
		//error_log("ERROR IN SQL: " . $sql);
		die(json_encode($response));
	}
	
    echo json_encode($response);
?>