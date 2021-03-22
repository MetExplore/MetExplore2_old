<?php 

require_once ('config/server_variables.php');
	$sep=$_POST['sep'];
	//$header= $_POST['header'];
	$fileName = TMP_DIR.$_FILES['fileData']['name']; 
    $tmpName  = $_FILES['fileData']['tmp_name'];
	
	// error_log($sep);

	if ($sep=="tab") $sep="\t";

    /*
     * mettre le fichier dans le repertoire file_upload
    */
    
  	if(isset($_FILES)){
  		if (move_uploaded_file ($tmpName, $fileName)) {$upload = true;} else {$upload = false;}
	}
	$fp = fopen ($fileName, "r");  
	
	$rows = array();
	$data = fgetcsv($fp, 0,$sep);

	//$head = fgetcsv($fp, 1,$sep);

    $rows[0]= count($data);
    $rows[1]= $fileName;
	$rows[2]= $data;
    
	echo '{success:'.$upload.', rows:'.json_encode($rows).'}';
 
?>
