<?php
$P_idBioSource=$_GET['idBioSource'];

require_once '../database/connection.php';
require_once '../user/userFunctions.php';


$currentUser=getIdUser();
if(getBioSourceRights($currentUser, $P_idBioSource, $link) == "denied"){
	echo '{"success":false}';
	return;
}


$sql= "SELECT DISTINCT MetaboliteIdentifiers.idMetabolite AS id, MetaboliteIdentifiers.extID AS inchi, MetaboliteIdentifiers.score AS score, MetaboliteIdentifiers.svgFile AS svg FROM MetaboliteIdentifiers, MetaboliteInBioSource WHERE MetaboliteInBioSource.idMetabolite= MetaboliteIdentifiers.idMetabolite AND  (MetaboliteIdentifiers.origin=\"SBML File\" OR MetaboliteIdentifiers.origin=\"SBML\" OR MetaboliteIdentifiers.origin=\"Import\" OR MetaboliteIdentifiers.origin=\"UserInput\") AND MetaboliteInBioSource.idBioSource= $P_idBioSource AND extDBName=\"inchi\" ";

//error_log($sql);
$result=mysqli_query ($link, $sql);
$data = array();

$response = array();

if (! $result) {
	$response ["message"] = "Impossible to get the list of the metabolites!";
	$response["success"] = false;
	// error_log($result);
}
else {
	while ($row=mysqli_fetch_object($result))
	{
		
		$svg=$row->svg;
		/*$fich= '../../../resources/images/structure_metabolite/'.$svg;
	
		$chwidth=0;
		$chheight=0;
		$handle = @fopen($fich, "r");
		//error_log($handle);
		if($handle) {
			$ch= fread($handle, filesize($fich));
			$poswidth= strpos($ch,"width=");
			$posheight=strpos($ch,"height=");
			
			$chwidth= substr($ch,$poswidth+7);
			$endwidth=  strpos($chwidth,"\"");
			$chwidth= substr($chwidth,0,$endwidth);
			
			$chheight= substr($ch,$posheight+8);
			$endheight=  strpos($chheight,"\"");
			$chheight= substr($chheight,0,$endheight);
			//error_log('w:'.$chwidth. 'h'.$posheight);
			
			//error_log('w: '.$chwidth. ' h: '.$chheight);
		}
		$row->width=$chwidth;
		$row->height=$chheight;//error_log($ch);*/
			$row->width=0;
		$row->height=0;//error_log($ch);

		$data [] = $row;
		$response["success"] = true;
		$response["results"] = $data;
		
	}
}
echo json_encode($response);

?>
