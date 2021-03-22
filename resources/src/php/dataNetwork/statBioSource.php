<?php
class statBioSource
{
//'bigg','chebi','hmdb','inchikey','kegg','lipidmaps','metacyc','metanetx.chemical','pubchem','seed','smiles','nbMetab','nbGene'
    public function stat()
    {
        require_once '../database/connectionPDO.php';
         $sql = $db->prepare("SELECT DISTINCT idBioSource, extDBName, nb, object  FROM StatBioSource WHERE extDBName IN ('bigg','chebi','hmdb','inchikey','kegg','lipidmaps','metanetx.chemical','pubchem','seed','smiles','nbMetab','nbGene','ensembl','ncbigene','biocyc')");
        $sql->execute();
        $dataStat = $sql->fetchAll(PDO::FETCH_ASSOC);

        $response["success"] = true;
        $response["results"] = $dataStat;

        return json_encode($response);
    }
}

$result = new statBioSource;
$return= $result->stat();

echo $return;
?>