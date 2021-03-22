<?php
/**********************************************
 * Coverage
 *
function coverage($P_idBioSource, $link, $object, $out) {
	

	
}*/
/**--------------------------------------------------------------------------------
 * recherche les pathways pour lesquels 1 des metabolites est present 
 *		execution requete  R_Pathway_ListidMetabolite avec param :listIdMetabolite
 * pour chaque pathway compter
 * 		nombre total de metabolite (et unique= si present en left et right =1
 * 		nombre de metabolites mappes dans ce pathway 
 */
/*
 * $result= mysqli_query ($link, $$sqlL );
	
	if ($result) {    
	
		$dataL = "";
		while ($row=mysqli_fetch_object($result))
 */

$P_idBioSource=	$_POST['idBioSource'];
$P_numMap= $_POST['numMapping'];
$P_Listid= $_POST['id'];
$P_Listid= 		str_replace(' ','',$P_Listid);
$P_ListidMap= 	$P_Listid;


//error_log($P_Listid);
//error_log($P_ListidMap);

$object= 		$_POST['object'];
$tabOut= 		explode(',', strtr($_POST['listOut']," ",""));
$tabListid=		explode(',', $P_Listid);

$P_id=0;

require_once '../database/connection.php';
//require_once '../database/requete_sel.php';
$dataOut= array();

foreach ($tabOut as $out) {
	
	//create select
	$sql= 'R_'.$out.'_Listid'.$object;
	
	//re-affecte param de la requete
	$P_Listid= $P_ListidMap;
	require '../database/requete_sel.php';
	
	$result= mysqli_query ($link, $$sql );

	//error_log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&".$out);
	//error_log($sql);
	//error_log($$sql);

	$data= array();
	
	if (!$result) {
	
	} else {
		
		
	
		while ($row=mysqli_fetch_object($result))
		{	
			$P_Listid= $row->id;
			
			$sql= 'R_'.$object.'_Listid'.$out;
			
			require '../database/requete_GroupConcat.php';

//			error_log('===');
//			error_log($$sql);
//			error_log('===');

			$resultObj= mysqli_query ($link, $$sql) ;
			
			if (!$resultObj) {
			
			} else {

				//$dataObj = array();
			
				while ($rowObj=mysqli_fetch_object($resultObj))
				{
					$dataObj = $rowObj->StringId;	
				}
//				error_log($P_Listid);
//				error_log($dataObj);
//				error_log($dataObj);
				$dataObj= explode(',', $dataObj);	
				

				//error_log($tabListid);
				$intersect = array_intersect($dataObj, $tabListid);
				$lengthintersect = sizeof($intersect);
				$lengthObj = sizeof($dataObj);
				$calculcoverage= 0;
				
				if ($lengthObj > 0) {
					$calculcoverage = round(($lengthintersect * 100) / $lengthObj, 2);
				}
				$coverage["id"] = $P_Listid;
				$coverage["coverage"] = $calculcoverage;
				$coverage["nbMapped"] = $lengthintersect;
				$coverage["nb"] = $lengthObj;
				$coverage["idMapped"] = implode(',',$intersect);
				$data[] = $coverage;
			}
		}
	}
	
	$dataOut[$out]= $data ;
}

$response["success"]=true;
$response["data"]=$dataOut;
$response["numMap"]=$P_numMap;
echo json_encode($response);
?>