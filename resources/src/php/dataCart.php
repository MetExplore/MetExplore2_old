<?php
$P_idBioSource=$_GET['idBioSource'];
//$sql=$_GET['req'];
$P_Listid= json_decode($_GET['id']);

require_once 'database/connection.php';

 
$data = array();
foreach($P_Listid as $id)
{
	$row->id= $id;	
	
	//Ajout pathways
	$sqlP= "SELECT DISTINCT Pathway.id AS id FROM Pathway, ReactionInPathway, ReactionInBioSource WHERE Pathway.id=ReactionInPathway.idPathway  AND ReactionInPathway.idReactionBioSource = ReactionInBioSource.id AND ReactionInBioSource.idReaction = $id AND ReactionInBioSource.idBioSource = $P_idBioSource";
	$resultP= mysqli_query ($link,$sqlP) or die (mysqli_error ($link));
	$dataP = array();		
	while ($rowP=mysqli_fetch_object($resultP))
	{
		$dataP[]= $rowP;
	}
	$row->pathways= $dataP;
	
	//Ajout objet Metabolite
	//substrates
	$sqlL= "SELECT DISTINCT Metabolite.id AS id FROM Metabolite, MetaboliteInBioSource, LeftParticipant WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND LeftParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource AND LeftParticipant.idReaction = $id";
			
	$resultL= mysqli_query ($link,$sqlL) or die (mysqli_error ($link));
	$dataL = array();		
	while ($rowL=mysqli_fetch_object($resultL))
	{
		$dataL[]= $rowL;
	}
	$row->substrates= $dataL;
	
	//products		
	$sqlR= "SELECT DISTINCT Metabolite.id AS id FROM Metabolite, MetaboliteInBioSource, RightParticipant WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND RightParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource AND RightParticipant.idReaction = $id";		
	$resultR= mysqli_query ($link,$sqlR) or die (mysqli_error ($link));
	$dataR = array();		
	while ($rowR=mysqli_fetch_object($resultR))
	{
		$dataR[]= $rowR;
	}	
	$row->products= $dataR;
	
	// enzyme
	$sqlE="SELECT DISTINCT EnzymeInBioSource.idEnzyme AS id FROM EnzymeInBioSource, Catalyses, ReactionInBioSource WHERE  EnzymeInBioSource.idBioSource = $P_idBioSource AND EnzymeInBioSource.id = Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource= ReactionInBioSource.id AND ReactionInBioSource.idReaction = $id";
	$resultE= mysqli_query ($link,$sqlE) or die (mysqli_error ($link));
	$dataE = array();		
	while ($rowE=mysqli_fetch_object($resultE))
	{
		//protein
		$id= $rowE->id;
		$sqlPr=	"SELECT DISTINCT Protein.id AS id FROM Protein, ProteinInBioSource, ProteinInEnzyme, EnzymeInBioSource WHERE  ProteinInBioSource.idBioSource = $P_idBioSource AND Protein.id = ProteinInBioSource.idProtein AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND ProteinInEnzyme.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.idEnzyme = $id";		
		$resultProtein= mysqli_query ($link,$sqlPr) or die (mysqli_error ($link));
		$dataPr = array();		
		while ($rowPr=mysqli_fetch_object($resultProtein))
		{
			//gene
			$id= $rowPr->id;		
			$sqlG= "SELECT DISTINCT Gene.id AS id FROM Gene, GeneInBioSource, GeneCodesForProtein, ProteinInBioSource WHERE GeneInBioSource.idBioSource = $P_idBioSource AND Gene.id = GeneInBioSource.idGene AND GeneInBioSource.id = GeneCodesForProtein.idGeneInBioSource AND GeneCodesForProtein.idProteinInBioSource= ProteinInBioSource.id AND ProteinInBioSource.idProtein = $id";
			$resultGene= mysqli_query ($link, $sqlG) or die (mysqli_error ($link));
			$dataG = array();		
			while ($rowG=mysqli_fetch_object($resultGene))
			{
				$dataG[]= $rowG; 	
			}
			$rowPr->genes= $dataG;				
			$dataPr[]= $rowPr; 	
		}
		$rowE->proteins= $dataPr;
		$dataE[]= $rowE;
	}
	$row->enzymes= $dataE;
	
	$data[] = $row;
}


echo json_encode($data);
?>
