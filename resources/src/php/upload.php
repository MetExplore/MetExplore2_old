<?php
// Ce fichier ne semble plus utilise : verifier

// Generic php to upload files. The name of the field must be Filedata
// The parameters dir and fileName can be set to specify the path and the name of the uploaded file.
// Returns the file path



$uploadDirectory = "/tmp";

if(isset($_POST["dir"])) {
	$uploadDirectory = $_POST["dir"];
}

if(! isset($_FILES)){

	echo '{success: false, message: "Problem while uploading file"}';

	return;
}

$fileName = $uploadDirectory."/".basename($_FILES['Filedata']['tmp_name'])."x";


if(isset($_POST["fileName"])) {
	$fileName = $uploadDirectory."/".$_POST["fileName"];
}

$tmpName  = $_FILES['Filedata']['tmp_name'];



if (move_uploaded_file ($tmpName, $fileName)) {
	echo '{success: "true", path: "'.$fileName.'"}';
} else {

	echo '{success: false, message: "Problem while uploading file"}';
}


return;


?>