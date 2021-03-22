<?php 
$P_idBioSource=$_GET['idBioSource'];

require_once 'database/connection.php';
$sql="SELECT DISTINCT CompartmentInBioSource.idCompartment AS id ,CompartmentInBioSource.identifier AS identifier FROM CompartmentInBioSource WHERE CompartmentInBioSource.idBioSource= $P_idBioSource ORDER BY identifier";
  
$result=mysqli_query ($link,$sql) or die (mysqli_error ($link));
    
$data = array();
while ($row=mysqli_fetch_object($result))
{
   	$data [] = $row;
}
//echo '({"total":"'.$totaldata.'","results":'.json_encode($data).'})';
echo json_encode($data);
?>
