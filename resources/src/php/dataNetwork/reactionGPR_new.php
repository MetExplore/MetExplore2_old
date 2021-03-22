<?php

$P_idBioSource=$_GET['idBioSource'];
class ReactionGPR
{
    private $_id;
    private $_gpr;
    private $_result;

    public function gpr($idBioSource)
    {
        //error_log( 'Je passe');

        require_once '../database/connectionPDO.php';

		$sqlReaction = $db->prepare("SELECT id AS idInBio FROM  ReactionInBioSource WHERE ReactionInBioSource.idBioSource= :idBioSource ");

		$sqlReaction->bindValue(':idBioSource',  $idBioSource, PDO::PARAM_STR);
        $sqlReaction->execute();

		//$row = $sqlReaction->fetch(PDO::FETCH_ASSOC);
        $data= array();
        $response = array();

        while ($dataReaction = $sqlReaction->fetch()) {
            $sqlEnz = $db->prepare("SELECT  GROUP_CONCAT(Gene.dbIdentifier SEPARATOR ' and ') AS enzyme  FROM ReactionInBioSource, Catalyses, EnzymeInBioSource, ProteinInEnzyme, ProteinInBioSource, GeneCodesForProtein, GeneInBioSource, Gene WHERE  Gene.id = GeneInBioSource.idGene AND GeneInBioSource.id = GeneCodesForProtein.idGeneInBioSource AND GeneCodesForProtein.idProteinInBioSource= ProteinInBioSource.id AND ProteinInBioSource.id=ProteinInEnzyme.idProteinInBioSource AND ProteinInEnzyme.idEnzymeInBioSource=EnzymeInBioSource.id AND EnzymeInBioSource.id = Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource= ReactionInBioSource.id AND ReactionInBioSource.id= :idReactionInBio  GROUP BY EnzymeInBioSource.idEnzyme ");
            $sqlEnz->bindValue(':idReactionInBio',  $dataReaction["idInBio"], PDO::PARAM_STR);
            $sqlEnz->execute();
            //error_log($dataReaction["idInBio"]);

            $enz="";
            $tabEnz= array();
            while ($dataEnz = $sqlEnz->fetch()) {
                if ($enz=="") $enz= '('.$dataEnz["enzyme"];
                else $enz= $enz. ') or ('.$dataEnz["enzyme"];
                array_push($tabEnz, $dataEnz["enzyme"]);

            }
            if ($enz!="") $enz= $enz.')';
            $res= array();
            $res["idInBio"]= $dataReaction["idInBio"];
            $res["gpr"]= $enz;
            $res["tabEnz"]= $tabEnz;
            array_push($data, $res);

            $response["success"] = true;
            $response["results"] = $data;

		}

        return json_encode($response);
    }
}

$result = new ReactionGPR;
$return= $result->gpr($P_idBioSource);
//error_log( $return);

echo $return;

?>
