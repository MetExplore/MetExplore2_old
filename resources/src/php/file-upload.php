<?php

	/**
	 * Upload a file to the server
	 */

	session_start();
	
	//DONT FORGET DEFINE USERFILES_URL AND _DIR variables in server_variables.php
	
	require_once 'database/connection.php';
    require_once 'config/server_variables.php';
    
	$idUser = $_SESSION['idUser'];

    $size = $_FILES['selectFile']['size'];
    $error = $_FILES['selectFile']['error'];
    
    if ($size > 512000 || $error == 1 || $error == 2) //We accept only files that have a size of 500KO or less
    {
    	die('{success: false, message: "Your file is too big. We accept only files of less than 500 KO."}');
    }
    elseif ($error > 0)
    {
    	die('{success: false, message: "Error during uploading of file '. $_FILES['selectFile']['name'] . '"}');
    }
    
    $tmpName = $_FILES['selectFile']['tmp_name'];
    
    $sql = "SELECT username FROM UserMet WHERE id=$idUser";
    $result=mysqli_query ($link,$sql) or die('{success: false, message: "Error in checking username"');
    $row = mysqli_fetch_object($result);
    
    $baseDir = TMP_DIR;
    $dir = $baseDir . md5($row->username);
    
    if (!is_dir($dir)) {
    	mkdir($dir);
    }
        
    $fileName = $dir."/".basename($_FILES['selectFile']['name']);
    $nb = 2;
    
    $origFileName = $fileName;
    
    $addFile = true;
    
    $newMd5 = md5_file($_FILES['selectFile']['tmp_name']);
    
    while (file_exists($fileName) && $addFile) {
    	$fileName = $origFileName;
    	$oldMd5 = md5_file($fileName);
    	if ($newMd5 == $oldMd5)	{
    		$addFile = false;
    	}
    	else {
	    	$parts = explode("/", $fileName);
			$fileParts =explode("\\.", end($parts));
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
    
    $path = substr($fileName, strlen($baseDir));
    
    if ($addFile) {
	    if (move_uploaded_file ($tmpName, $fileName)) {
	    	echo '{success: "true", path: "'.$path.'", url: "'. USERFILES_URL . $path . '"}';
	    } else {
	    
	    	echo '{success: false, message: "Problem while uploading file", path: "'.$path.'"}';
	    }
    }
    else {
    	echo '{success: "true", path: "'.$path.'", url: "' . USERFILES_URL . $path . '"}';
    }
?>