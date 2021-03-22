<?php

require_once ('utils/string_functions.php');

$fileName=$_GET['fileName'];
$valSep=$_GET['separator'];
$txtDelim=$_GET['delimiter'];
$skip=$_GET['skip'];
$comment=$_GET['comment'];

	$fp = fopen ($fileName, "r");  
	
	$values = array();
	//$row = array();
	
	class fileData {
		var $tab;
	}

	for($c=0; $c < $skip; $c++){
		fgets($fp);
	}

	
	while (($data = fgetcsv($fp, 0,$valSep,$txtDelim)) !== FALSE) {
		if($comment!=="" && startsWith($data[0],$comment)){
			continue;
		}


		$row= new fileData();
		
        $num = count($data);
        
        $cond= array();
        for ($c=0; $c < $num; $c++) {
        	//error_log($data[$c]);
             $cond[]= $data[$c];
             //$row->map0= $data[1];
        }
        $row->tab= $cond;
        
        $values[]= $row;
    }
    fclose($fp);
	
	echo '{success:true, rows:'.json_encode($values).'}';
 
?>
