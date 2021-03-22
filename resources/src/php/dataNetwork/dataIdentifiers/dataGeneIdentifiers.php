<?php
$P_idBioSource=$_POST['idBioSource'];
class dataGeneIdentifiers
{

    public function GeneIdentifiers($idBioSource)
    {
        require_once '../../database/connectionPDO.php';
        //error_log("-----biosource",$idBioSource);
        //$data= array();
        //metabolite extDBname identifiers
        //$sql = $db->prepare("SELECT DISTINCT GeneIdentifiers.idGene AS idmysql, extDBName, group_concat( DISTINCT extID SEPARATOR ' || ') AS extID FROM GeneIdentifiers,GeneInBioSource WHERE GeneInBioSource.idBioSource= :idBioSource  AND GeneIdentifiers.idGene=GeneInBioSource.idGene AND  (GeneIdentifiers.origin=\"SBML File\" OR GeneIdentifiers.origin=\"SBML\" OR GeneIdentifiers.origin=\"Import\" OR GeneIdentifiers.origin=\"UserInput\") GROUP BY GeneIdentifiers.idGene, GeneIdentifiers.extDBName");
        $sql = $db->prepare("SELECT DISTINCT GeneIdentifiers.idGene AS idmysql, extDBName, group_concat( DISTINCT extID SEPARATOR ' || ') AS extID FROM GeneIdentifiers,GeneInBioSource WHERE GeneInBioSource.idBioSource= :idBioSource  AND GeneIdentifiers.idGene=GeneInBioSource.idGene AND  GeneIdentifiers.score > 0 GROUP BY GeneIdentifiers.idGene, GeneIdentifiers.extDBName");

        $sql->bindValue(':idBioSource',  $idBioSource, PDO::PARAM_STR);
        $sql->execute();
        $dataGene = $sql->fetchAll(PDO::FETCH_ASSOC);

        $response["success"] = true;
        $response["results"] = $dataGene;

        return json_encode($response);
    }
}

$result = new dataGeneIdentifiers;
//error_log($P_idBioSource);
$return= $result->GeneIdentifiers($P_idBioSource);

echo $return;
?>