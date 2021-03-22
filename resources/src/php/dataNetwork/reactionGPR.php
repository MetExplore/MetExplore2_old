<?php
$P_idBioSource=$_GET['idBioSource'];

require_once '../database/connection.php';


$sql= "SELECT idReactionInBioSource AS idInBio, metaData FROM ReactionInBioSource_MetaData, ReactionInBioSource WHERE ReactionInBioSource.id= ReactionInBioSource_MetaData.idReactionInBioSource AND ReactionInBioSource.idBioSource=$P_idBioSource AND ReactionInBioSource_MetaData.metaData like '%GENE_ASSOCIATION%' ";
//error_log($sql);
$result=mysqli_query ($link, $sql);
$data = array();

$response = array();

if (! $result) {
    $response ["message"] = "Impossible to get the list of the gpr";
    $response["success"] = false;
    // error_log($result);
}
else {
    while ($row=mysqli_fetch_object($result))
    {

        $notes=$row->metaData;
        $pos1= stripos($notes,"GENE_ASSOCIATION:");
        $pos2= stripos($notes,"</p>",$pos1);
        $res= array();
        /* +18 pour enlever GENE_ASSOCIATION:*/
        $res["idInBio"]= $row->idInBio;
        $res["gpr"]= substr($notes,$pos1+18,$pos2-$pos1-18);

        array_push($data, $res);
        $response["success"] = true;
        $response["results"] = $data;

    }
}
echo json_encode($response);

?>
