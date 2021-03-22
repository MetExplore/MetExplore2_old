<?php
/*--------------------------------------------------------------------------------
 * Calcul des sommes :
 *  
 --------------------------------------------------------------------------------*/
function searchForId($id, $array) {
   foreach ($array as $key => $val) {
       if ($val['id'] === $id) {
           return $key;
       }
   }
   return null;
};

$P_idBioSource=$_GET['idBioSource'];
$P_name=$_GET['nameGrid']; 

$sqlG= "R_".$P_name."_Gene";
$sqlP= "R_".$P_name."_Protein";
$sqlE= "R_".$P_name."_Enzyme";
$sqlMl= "R_".$P_name."_MetabLeft";
$sqlMr= "R_".$P_name."_MetabRight";
$sqlR= "R_".$P_name."_Reaction";
$sqlPa= "R_".$P_name."_Pathway";
//print_r($sqlPa);

require_once '../database/connection.php';
require_once '../database/requete_Sum.php';
$data= array();
/*
 * $result=mysqli_query($link,$$sql) ;

if (! $result) {
	$response ["message"] = "Impossible to get the list of the pathways!";
	$response["success"] = false;
}
else {
	$data = array();
	 while ($row=mysqli_fetch_object($result))

 */
$response["success"] = false;

if ($P_name != "Pathway") {
	
	$result=mysqli_query($link,$$sqlPa) ;
 	// error_log($$sqlPa);
	while ($row=mysqli_fetch_object($result))
	{
		$ind= searchForId($row->id, $data);
		if ($ind) {
			$data[$ind]['nbPathway']= $row->nb;
		} else {
			$IdSum['id']= $row->id;
			$IdSum['nbPathway']= $row->nb;
			$IdSum['nbReaction']= 0;
			$IdSum['nbMetabolite']= 0;
			$IdSum['nbEnzyme']= 0;
			$IdSum['nbProtein']= 0;
			$IdSum['nbGene']= 0;
			
			$data[] = $IdSum;
		}
	}
}

if ($P_name != "Reaction") {
	
	$result=mysqli_query($link,$$sqlR);
 	// error_log($$sqlR);
	while ($row=mysqli_fetch_object($result))
	{
		$ind= searchForId($row->id, $data);
		if ($ind) {
			$data[$ind]['nbReaction']= $row->nb;
		} else {
			$IdSum['id']= $row->id;
			$IdSum['nbPathway']=0;
			$IdSum['nbReaction']= $row->nb;
			$IdSum['nbMetabolite']= 0;
			$IdSum['nbEnzyme']= 0;
			$IdSum['nbProtein']= 0;
			$IdSum['nbGene']= 0;
			
			$data[] = $IdSum;
		}
	}
}

if ($P_name != "Metabolite") {
	
	$result=mysqli_query($link,$$sqlMl);
	$metabLeft= array();
 	//error_log($$sqlMl);
	while ($row=mysqli_fetch_array($result))
	{
		$ind= searchForId($row['id'], $data);
		if ($ind) {
			$data[$ind]['nbMetabolite']= $row['nb'];
		} else {
			$IdSum['id']= $row['id'];
			$IdSum['nbPathway']=0;
			$IdSum['nbReaction']= 0;
			$IdSum['nbMetabolite']= $row['nb'];
			$IdSum['nbEnzyme']= 0;
			$IdSum['nbProtein']= 0;
			$IdSum['nbGene']= 0;
			
			$data[] = $IdSum;
		}
		$left['id']= $row['id'];
		$left['StringId']= $row['StringId'];
		$metabLeft[]= $left;		
	}	
	//$metabCombi= array_combine($metabId, $metabVal);
			/*
			 * Il y a des metabolites left, il faut donc comparer left/right
			 * nombre= taille du left + taille right - taille intersection
			 */
	
	$result=mysqli_query($link,$$sqlMr);
// 	error_log($$sqlMr);
	while ($row=mysqli_fetch_array($result))
	{		
		//error_log($row['id']);
		$indLeft= searchForId($row['id'], $metabLeft);
		//error_log($indLeft);
		if ($indLeft) {
			
			$arrayRight= array_map('strval', explode(',',$row['StringId']));
			$arrayLeft= array_map('strval', explode(',',$metabLeft[$indLeft]['StringId']));
			$intersect = array_intersect($arrayLeft, $arrayRight);
			$ind= searchForId($row['id'], $data);
			if ($ind) {
				$data[$ind]['nbMetabolite']= $data[$ind]['nbMetabolite']+$row['nb']-sizeof($intersect);
			} 
			
		} else 	{
			$ind= searchForId($row['id'], $data);
			if ($ind) {
				$data[$ind]['nbMetabolite']= $row['nb'];
			} else {
				$IdSum['id']= $row['id'];
				$IdSum['nbPathway']=0;
				$IdSum['nbReaction']= 0;
				$IdSum['nbMetabolite']= $row['nb'];
				$IdSum['nbEnzyme']= 0;
				$IdSum['nbProtein']= 0;
				$IdSum['nbGene']= 0;
				
				$data[] = $IdSum;
			}		
		}
	}
}	

/*
 * Enzyme
 */
if ($P_name != "Enzyme") {
	
	$result=mysqli_query($link,$$sqlE);
// 	error_log($$sqlE);
	while ($row=mysqli_fetch_object($result))
	{
		$ind= searchForId($row->id, $data);
		if ($ind) {
			$data[$ind]['nbEnzyme']= $row->nb;
		} else {
			$IdSum['id']= $row->id;
			$IdSum['nbPathway']=0;
			$IdSum['nbReaction']= 0;
			$IdSum['nbMetabolite']= 0;
			$IdSum['nbEnzyme']= $row->nb;
			$IdSum['nbProtein']= 0;
			$IdSum['nbGene']= 0;
		
		$data[] = $IdSum;
		}
	}
}

if ($P_name != "Protein") {
	$result=mysqli_query($link,$$sqlP);
 	//error_log($$sqlP);
	while ($row=mysqli_fetch_object($result))
	{
		$ind= searchForId($row->id, $data);
		if ($ind) {
			$data[$ind]['nbProtein']= $row->nb;
		} else {
			$IdSum['id']= $row->id;
			$IdSum['nbPathway']=0;
			$IdSum['nbReaction']= 0;
			$IdSum['nbMetabolite']= 0;
			$IdSum['nbEnzyme']= 0;
			$IdSum['nbProtein']= $row->nb;
			$IdSum['nbGene']= 0;
		
			$data[] = $IdSum;
		}
	}
}	

if ($P_name != "Gene") {
	$result=mysqli_query($link,$$sqlG);
// error_log($$sqlG);
	while ($row=mysqli_fetch_object($result))
	{
		$ind= searchForId($row->id, $data);
		if ($ind) {
			$data[$ind]['nbGene']= $row->nb;
		} else {
			$IdSum['id']= $row->id;
			$IdSum['nbPathway']=0;
			$IdSum['nbReaction']= 0;
			$IdSum['nbMetabolite']= 0;
			$IdSum['nbEnzyme']= 0;
			$IdSum['nbProtein']= 0;
			$IdSum['nbGene']= $row->nb;
		
			$data[] = $IdSum;
		}
	}
}

$response["success"]=true;
$response["data"]=$data;
echo json_encode($response);
?>