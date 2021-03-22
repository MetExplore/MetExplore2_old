<?php

$P_idBioSource=$_POST['idBioSource'];
class identifiersgit
{

    public function DBNameIdsql($idBioSource)
    {
        //error_log( 'Je passe');

        require_once '../../database/connectionPDO.php';
        $data= array();
        //metabolite extDBname identifiers
		$sql = $db->prepare("SELECT 'Metabolite' AS object, extDBName, GROUP_CONCAT(DISTINCT MetaboliteIdentifiers.idMetabolite) AS listid FROM  MetaboliteIdentifiers, MetaboliteInBioSource WHERE MetaboliteIdentifiers.idMetabolite=MetaboliteInBioSource.idMetabolite AND MetaboliteInBioSource.idBioSource= :idBioSource AND MetaboliteIdentifiers.score>0 AND MetaboliteIdentifiers.origin='git' GROUP BY MetaboliteIdentifiers.extDBName");
		$sql->bindValue(':idBioSource',  $idBioSource, PDO::PARAM_STR);
        $sql->execute();
        $dataMetabolite = $sql->fetch(PDO::FETCH_ASSOC);
        if ($dataMetabolite) array_push($data, $dataMetabolite);

        //reaction extDBname identifiers
        $sql = $db->prepare("SELECT 'Reaction' AS object, extDBName, GROUP_CONCAT(DISTINCT ReactionIdentifiers.idReaction) AS listid FROM  ReactionIdentifiers, ReactionInBioSource WHERE ReactionIdentifiers.idReaction=ReactionInBioSource.idReaction AND ReactionInBioSource.idBioSource= :idBioSource AND ReactionIdentifiers.score>0 AND ReactionIdentifiers.origin='git' GROUP BY ReactionIdentifiers.extDBName");
        $sql->bindValue(':idBioSource',  $idBioSource, PDO::PARAM_STR);
        $sql->execute();
        $dataReaction = $sql->fetch(PDO::FETCH_ASSOC);

        if ($dataReaction) array_push($data, $dataReaction);

        //gene extDBname identifiers
        $sql = $db->prepare("SELECT 'Gene' AS object, extDBName, GROUP_CONCAT(DISTINCT GeneIdentifiers.idGene) AS listid FROM  GeneIdentifiers, GeneInBioSource WHERE GeneIdentifiers.idGene=GeneInBioSource.idGene AND GeneInBioSource.idBioSource= :idBioSource AND GeneIdentifiers.score>0 AND GeneIdentifiers.origin='git' GROUP BY GeneIdentifiers.extDBName");
        $sql->bindValue(':idBioSource',  $idBioSource, PDO::PARAM_STR);
        $sql->execute();
        $dataGene = $sql->fetch(PDO::FETCH_ASSOC);

        if ($dataGene) array_push($data, $dataGene);

        $response["success"] = true;
        $response["results"] = $data;
        return json_encode($response);
    }
}

$result = new identifiersgit;
$return= $result->DBNameIdsql($P_idBioSource);

echo $return;

?>
