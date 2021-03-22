<?php 
$fileName=$_GET['fileName'];
$sep=$_GET['sep'];
$header=$_GET['header'];

$fp = fopen ($fileName, "r");
	
	$values = array();
	//$row = array();
	
	class fileData {
		var $identified;
		var $idMap;
		var $conditions;
	}
    if ($sep=="tab") $sep="\t";
    if ($header) $data = fgetcsv($fp, 0,$sep);

	while (($data = fgetcsv($fp, 0,$sep)) !== FALSE) {
		$row= new fileData();
        $num = count($data);
        $row->identified= false;
        $row->idMap= $data[0];
        
        $cond= array();
        for ($c=1; $c < $num; $c++) {
             $cond[]= $data[$c];
             //$row->map0= $data[1];
        }
        $row->conditions= $cond;
        
        $values[]= $row;
    }
	
	echo '{success:true, rows:'.json_encode($values).'}';
 
?>