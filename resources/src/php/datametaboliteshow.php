<?php 
// 
$P_name=$_GET['query'];
//echo $P_name;

require_once 'database/connection.php';
//require_once 'database/requete_sel.php';

$sql= "SELECT DISTINCT Metabolite.id AS id, Metabolite.name AS name, Metabolite.chemicalFormula AS chemicalFormula, Metabolite.smiles AS smiles, Metabolite.caas AS caas, Metabolite.weight AS weight, Metabolite.generic AS generic, Metabolite.idDB AS idDB, Metabolite.dbIdentifier AS dbIdentifier FROM Metabolite WHERE  Metabolite.name LIKE '$P_name%'";
//error_log($sql);
//error_log($P_name);	
//$num_result=mysql_query($sql, $con);
//$totaldata = mysql_num_rows($num_result);
  
$result=mysqli_query ($link,$sql) or die (mysqli_error ($link));
    
$data = array();
while ($row=mysqli_fetch_object($result))
{
   	$row->name= html_entity_decode($row->name);
	$data [] = $row;
}
//echo '({"total":"'.$totaldata.'","results":'.json_encode($data).'})';
echo json_encode($data);
?>
