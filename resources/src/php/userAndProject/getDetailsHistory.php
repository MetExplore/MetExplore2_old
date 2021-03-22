<?php

require_once ('../config/server_variables.php');

//We get parameters: in some case, their are in POST, in other cases in GET, we have to check it:
if (isset($_POST['idHistory']))
	$idHistory = $_POST['idHistory'];
else
	$idHistory = $_GET['idHistory'];
if (isset($_POST['file']))
	$file = DATALOG_DIR . $_POST['file'];
else
	$file = DATALOG_DIR . $_GET['file'];

if (file_exists($file)) {

	$fileOp = fopen($file,"r");
	$hasFoundEntry = false; //History item found if true
	$finishEntry = false; //All History item is loaded if true
	$lines = array(); //List of lines inside the history item
	
	while(! feof($fileOp) && !$finishEntry) {
		$line = str_replace("\n", "", fgets($fileOp));
		if (preg_match_all("/^---(\d+)$/", $line, $matches)) { //Search for the header of an entry
			if (!$hasFoundEntry) {
				$idHist = $matches[1][0]; //Get in the first group in the match sequence
				if (strval($idHistory) == $idHist) {
					$hasFoundEntry = true;
				}
			}
			else {
				$finishEntry = true;
			}
		}
		else if($hasFoundEntry && $line != "") {
			array_push($lines, $line);
		}
	}
	
	if (count($lines) >= 2) {
	
		$cols = explode("\t", $lines[0]); //Get the cols names
		$nbCols = count($cols);
		
		$data = array();
		
		//Fill data:
		for ($it=1; $it < count($lines); $it++) {
			$line = array();
			$colsValues = explode("\t", $lines[$it]);
			if (count($colsValues) == $nbCols) { //Check file format is correct
				for ($nb=0; $nb < $nbCols; $nb++) {
					$line[$cols[$nb]] = $colsValues[$nb];
				}
				array_push($data, $line);
			}
			else {
				die('{success: false, message: "Error in reading history file: file format not correct!"}');
			}
		}
		
		$response["success"] = true;
		$response["data"] = $data;
		$response["fields"] = $cols;
		
	}
	
	else {
		$response["success"] = false;
		$response["message"] = "Error in reading history file: history entries not found!";
	}
}

else {
	$response["success"] = false;
	$response["message"] = "Error in reading history file: file not found!";
}

echo json_encode($response);

?>