<?php
$P_idBioSource=$_POST['idBioSource'];
class dataReactionIdentifiers
{

    public function ReactionIdentifiers($idBioSource)
    {
        require_once '../../database/connectionPDO.php';
        //error_log("-----biosource",$idBioSource);
        //$data= array();
//        $sql = $db->prepare("SELECT DISTINCT ReactionIdentifiers.idReaction AS idmysql, extDBName, group_concat( DISTINCT extID SEPARATOR ' || ') AS extID FROM ReactionIdentifiers,ReactionInBioSource WHERE ReactionInBioSource.idBioSource= :idBioSource  AND ReactionIdentifiers.idReaction=ReactionInBioSource.idReaction AND  (ReactionIdentifiers.origin=\"SBML File\" OR ReactionIdentifiers.origin=\"SBML\" OR ReactionIdentifiers.origin=\"Import\" OR ReactionIdentifiers.origin=\"UserInput\") GROUP BY ReactionIdentifiers.idReaction, ReactionIdentifiers.extDBName");
        $sql = $db->prepare("SELECT DISTINCT ReactionIdentifiers.idReaction AS idmysql, extDBName, group_concat( DISTINCT extID SEPARATOR ' || ') AS extID FROM ReactionIdentifiers,ReactionInBioSource WHERE ReactionInBioSource.idBioSource= :idBioSource  AND ReactionIdentifiers.idReaction=ReactionInBioSource.idReaction AND  ReactionIdentifiers.score > 0 GROUP BY ReactionIdentifiers.idReaction, ReactionIdentifiers.extDBName");

        $sql->bindValue(':idBioSource',  $idBioSource, PDO::PARAM_STR);
        $sql->execute();
        $dataReaction = $sql->fetchAll(PDO::FETCH_ASSOC);

        $response["success"] = true;
        $response["results"] = $dataReaction;

        return json_encode($response);
    }
}

$result = new dataReactionIdentifiers;
error_log($P_idBioSource);
$return= $result->ReactionIdentifiers($P_idBioSource);

echo $return;
?>