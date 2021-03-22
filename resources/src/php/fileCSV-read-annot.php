<?php 
$fileName=$_GET['fileName'];

	$fp = fopen ($fileName, "r");  
	
	$values = array();
	//$row = array();
	
	class fileData {
		var $tab;
	}
	
	while (($data = fgetcsv($fp, 0,"\t")) !== FALSE) {
		$row= new fileData();
        $num = count($data);

        $cond= array();
        for ($c=0; $c < $num; $c++) {
             $cond[]= $data[$c];
             //$row->map0= $data[1];
        }
        $row->tab= $cond;
        
        $values[]= $row;
    }
    fclose($fp);
	
	echo '{success:true, rows:'.json_encode($values).'}';
 
?>
