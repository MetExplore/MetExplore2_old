<?php
$P_idBioSource=$_POST['idBioSource'];
class dataMEtaboliteidentifiers
{

    public function MetaboliteIdentifiers($idBioSource)
    {
        require_once '../../database/connectionPDO.php';
        //error_log("-----biosource",$idBioSource);
        //$data= array();
        //metabolite extDBname identifiers
        //$sql = $db->prepare("SELECT DISTINCT MetaboliteIdentifiers.idMetabolite AS idmysql, extDBName, group_concat( DISTINCT extID SEPARATOR ' || ') AS extID FROM MetaboliteIdentifiers,MetaboliteInBioSource WHERE MetaboliteInBioSource.idBioSource= :idBioSource  AND MetaboliteIdentifiers.idMetabolite=MetaboliteInBioSource.idMetabolite AND  (MetaboliteIdentifiers.origin=\"SBML File\" OR MetaboliteIdentifiers.origin=\"SBML\" OR MetaboliteIdentifiers.origin=\"Import\" OR MetaboliteIdentifiers.origin=\"UserInput\") GROUP BY MetaboliteIdentifiers.idMetabolite, MetaboliteIdentifiers.extDBName");
        $sql = $db->prepare("SELECT DISTINCT MetaboliteIdentifiers.idMetabolite AS idmysql, extDBName, group_concat( DISTINCT extID SEPARATOR ' || ') AS extID FROM MetaboliteIdentifiers,MetaboliteInBioSource WHERE MetaboliteInBioSource.idBioSource= :idBioSource  AND MetaboliteIdentifiers.idMetabolite=MetaboliteInBioSource.idMetabolite AND  MetaboliteIdentifiers.score > 0 GROUP BY MetaboliteIdentifiers.idMetabolite, MetaboliteIdentifiers.extDBName");

        $sql->bindValue(':idBioSource',  $idBioSource, PDO::PARAM_STR);
        $sql->execute();
        $dataMetabolite = $sql->fetchAll(PDO::FETCH_ASSOC);

        $response["success"] = true;
        $response["results"] = $dataMetabolite;

        return json_encode($response);
    }
}

$result = new dataMetaboliteIdentifiers;
error_log($P_idBioSource);
$return= $result->MetaboliteIdentifiers($P_idBioSource);

echo $return;
?>