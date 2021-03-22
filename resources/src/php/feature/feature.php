<?php
require_once '../database/connection.php';

$sql="SELECT * FROM feature";

//error_log($sql);
$result=mysqli_query ($link, $sql);    

if (! $result) {
	$response ["message"] = "Impossible to get the list of components";
	$response["success"] = false;
}
else {
	$data = array();
	
	while ($row=mysqli_fetch_object($result))
	{
		$components= explode(',',$row->listComponent);

        foreach ($components as $compo) {
            $rowComponent = new stdClass();
            $rowComponent->name=$row->name;
            $rowComponent->component=$compo;
            $rowComponent->typeComponent=$row->typeComponent;
            $rowComponent->listidUser=$row->listidUser;
            $rowComponent->listidBioSource=$row->listidBioSource;
            $rowComponent->specifStatus=$row->specifStatus;
            $rowComponent->defaultStatus=$row->defaultStatus;
            //error_log($row->listComponent);
            $data [] = $rowComponent;
        }
	}
	$response["success"] = true;
	$response["results"] = $data;
	
}
echo json_encode($response);

?>
