<?php

$P_idBioSource=$_POST['idBioSource'];
class identifiersDBName
{

    public function DBName($idBioSource)
    {
        //error_log( 'Je passe');

        require_once '../../database/connectionPDO.php';
        $data= array();
        //metabolite extDBname identifiers
		$sql = $db->prepare("SELECT 'Metabolite' AS object, GROUP_CONCAT(DISTINCT extDBName) AS extDBName FROM  MetaboliteIdentifiers, MetaboliteInBioSource WHERE MetaboliteIdentifiers.idMetabolite=MetaboliteInBioSource.idMetabolite AND MetaboliteInBioSource.idBioSource= :idBioSource AND MetaboliteIdentifiers.score>0");
		$sql->bindValue(':idBioSource',  $idBioSource, PDO::PARAM_STR);
        $sql->execute();
        $dataMetabolite = $sql->fetch(PDO::FETCH_ASSOC);

        array_push($data, $dataMetabolite);

        //reaction extDBname identifiers
        $sql = $db->prepare("SELECT 'Reaction' AS object, GROUP_CONCAT(DISTINCT extDBName) AS extDBName FROM  ReactionIdentifiers, ReactionInBioSource WHERE ReactionIdentifiers.idReaction=ReactionInBioSource.idReaction AND ReactionInBioSource.idBioSource= :idBioSource AND ReactionIdentifiers.score>0");
        $sql->bindValue(':idBioSource',  $idBioSource, PDO::PARAM_STR);
        $sql->execute();
        $dataReaction = $sql->fetch(PDO::FETCH_ASSOC);

        array_push($data, $dataReaction);

        //gene extDBname identifiers
        $sql = $db->prepare("SELECT 'Gene' AS object, GROUP_CONCAT(DISTINCT extDBName) AS extDBName FROM  GeneIdentifiers, GeneInBioSource WHERE GeneIdentifiers.idGene=GeneInBioSource.idGene AND GeneInBioSource.idBioSource= :idBioSource AND GeneIdentifiers.score>0");
        $sql->bindValue(':idBioSource',  $idBioSource, PDO::PARAM_STR);
        $sql->execute();
        $dataGene = $sql->fetch(PDO::FETCH_ASSOC);

        array_push($data, $dataGene);

        $response["success"] = true;
        $response["results"] = $data;
        return json_encode($response);
    }
}

$result = new identifiersDBName;
$return= $result->DBName($P_idBioSource);

echo $return;

?>
