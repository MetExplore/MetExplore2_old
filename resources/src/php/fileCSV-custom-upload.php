<?php 

require_once ('config/server_variables.php');

	$valSep=$_GET['separator'];
	$fileName = TMP_DIR.$_FILES['fileData']['name']; 
    $tmpName  = $_FILES['fileData']['tmp_name'];
    
    /*
     * mettre le fichier dans le repertoire file_upload
    */
    
  	if(isset($_FILES)){
  		if (move_uploaded_file ($tmpName, $fileName)) {$upload = true;} else {$upload = false;}
	}
	$fp = fopen ($fileName, "r");  
	
	$rows = array();
	$data = fgetcsv($fp, 0,$valSep);

    $rows[0]= count($data);
    $rows[1]= $fileName;
    
	echo '{success:'.$upload.', rows:'.json_encode($rows).'}';
 
?>
