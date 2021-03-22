<?php 
// 
$P_idBioSource=$_GET['idBioSource'];
$sql=$_GET['req'];
/*
$P_Listid=$_GET['id'];
$start= $_GET['start'];
$limit= $_GET['limit'];
*/
require_once 'database/connection.php';
require_once 'database/requete_sel.php';

//$pos= 
//$sqlC= substr($$sql,)
/*
$sqlC= "SELECT COUNT(DISTINCT Metabolite.id) AS count ".strstr($$sql," FROM");
echo $sqlC;
$result=mysql_query ($sqlC) or die (mysql_error ());
$row=mysql_fetch_object($result);
$totaldata=$row->count;
*/
$totaldata=100;
$result=mysqli_query ($link,$$sql) or die (mysqli_error ($link));

$data = array();
while ($row=mysqli_fetch_object($result))
{
   	$P_idMetabolite= $row->id;
   	$sqlR="SELECT COUNT(*) AS countR FROM RightParticipant WHERE RightParticipant.idMetabolite=$P_idMetabolite";
	$resultR= mysqli_query ($link,$sqlR) or die (mysqli_error ($link));
	$rowR= mysqli_fetch_object($resultR);

	$sqlL="SELECT COUNT(*) AS countL FROM LeftParticipant WHERE LeftParticipant.idMetabolite=$P_idMetabolite";
	$resultL= mysqli_query ($link,$sqlL) or die (mysqli_error ($link));
	$rowL= mysqli_fetch_object($resultL);
	$row->count= $rowR->countR + $rowL->countL;
	
	$sqlC="SELECT DISTINCT CompartmentInBioSource.identifier AS identifier FROM CompartmentInBioSource, MetaboliteInCompartment WHERE MetaboliteInCompartment.idCompartmentInBioSource=CompartmentInBioSource.idCompartmentInBioSource AND MetaboliteInCompartment.idMetabolite= $P_idMetabolite";
	$resultC= mysqli_query ($link,$sqlC) or die (mysqli_error ($link));
	$compart= array();
	while ($rowC=mysqli_fetch_object($resultC))
	{
		$compart[]= $rowC->identifier;	
	}
	$row->compart= $compart;
	
	$row->name= html_entity_decode($row->name);
	//$row->compart= $dataB;
	//$row->count="0";
	//$row->compart="";
	$data [] = $row;
}
//echo '({"total":"'.$totaldata.'","results":'.json_encode($data).'})';
echo json_encode($data);
?>
