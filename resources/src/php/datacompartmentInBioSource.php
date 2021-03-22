<?php 
$P_idBioSource=$_GET['idBioSource'];
$sql=$_GET['req'];
$P_Listid=$_GET['id'];
$getFake=$_GET['getfake'];

require_once 'database/connection.php';
require_once 'database/requete_sel.php';
 
$result=mysqli_query ($link, $$sql) ;
$data = array();

if (! $result) {
	$response ["message"] = "Impossible to get the list of the Compartments!";
	$response["success"] = false;
}
else {    
	
	while ($row=mysqli_fetch_object($result))
	{
		if ( $row->identifier == "fake_compartment" && $getFake =="false" ) {
	   		// error_log($getFake);
	   		// $data [] = $row;
			
		}else{
			$data [] = $row;
		}
		
	}
}
echo json_encode($data);
?>
