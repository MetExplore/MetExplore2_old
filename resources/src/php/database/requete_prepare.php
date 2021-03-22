<?php
//$link = new mysqli($host,$userMySql,$pwd,$base)
require_once('connection.php');
$dbh = new PDO('mysql:host=localhost;dbname=metexplore', $userMySql, $pwd);
/************************
**	Pathway
************************/
//$R_PathwayFromReaction="SELECT DISTINCT Pathway.id AS idInBio, Pathway.id AS id, Pathway.name AS name, Pathway.dbIdentifier AS dbIdentifier FROM Pathway, ReactionInPathway, ReactionInBioSource WHERE Pathway.id=ReactionInPathway.idPathway  AND ReactionInPathway.idReactionBioSource = ReactionInBioSource.id AND ReactionInBioSource.idBioSource = $P_idBioSource";
$R_Pathway= $dbh->prepare("SELECT DISTINCT Pathway.id AS idInBio, Pathway.id AS id, Pathway.name AS name, Pathway.dbIdentifier AS dbIdentifier FROM Pathway, PathwayInBioSource WHERE Pathway.id=PathwayInBioSource.idPathway AND PathwayInBioSource.idBioSource=?");

//$R_Pathway="($R_PathwayFromReaction) UNION ($R_PathwayInBioSource)";

/************************
**	Reaction
************************/
$R_Reaction= $dbh->prepare("SELECT ReactionInBioSource.id AS idInBio, Reaction.id AS id, Reaction.name AS name, Reaction.ec AS ec, Reaction.dbIdentifier AS dbIdentifier, ReactionInBioSource.reversible AS reversible, ReactionInBioSource.hole AS hole, ReactionInBioSource.upperBound AS upperBound, ReactionInBioSource.lowerBound AS lowerBound, ReactionInBioSource.inConflictWith AS inConflictWith FROM Reaction, ReactionInBioSource  WHERE  Reaction.id = ReactionInBioSource.idReaction AND ReactionInBioSource.idBioSource = ?");

/************************
**	Metabolite Left
************************/
$R_MetabLeft= $dbh->prepare("SELECT DISTINCT Metabolite.id AS idInBio, Metabolite.id AS id, Metabolite.name AS name, Metabolite.chemicalFormula AS chemicalFormula, Metabolite.dbIdentifier AS dbIdentifier, Metabolite.smiles AS smiles, Metabolite.caas AS caas, Metabolite.weight AS weight, Metabolite.generic AS generic, MetaboliteInBioSource.sideCompound AS sideCompound FROM Metabolite, MetaboliteInBioSource, LeftParticipant WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND LeftParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = ?");

/************************
**	Metabolite Right
************************/
$R_MetabRight=	$dbh->prepare("SELECT DISTINCT Metabolite.id AS idInBio, Metabolite.id AS id, Metabolite.name AS name, Metabolite.chemicalFormula AS chemicalFormula, Metabolite.dbIdentifier AS dbIdentifier, Metabolite.smiles AS smiles, Metabolite.caas AS caas, Metabolite.weight AS weight, Metabolite.generic AS generic, MetaboliteInBioSource.sideCompound AS sideCompound FROM Metabolite, MetaboliteInBioSource, RightParticipant WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND RightParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = ?");

/************************
**	Metabolite 
************************/

$R_Metabolite= $dbh->prepare("SELECT DISTINCT Metabolite.id AS idInBio, Metabolite.id AS id, Metabolite.name AS name, Metabolite.chemicalFormula AS chemicalFormula, Metabolite.dbIdentifier AS dbIdentifier, Metabolite.smiles AS smiles, Metabolite.caas AS caas, Metabolite.weight AS weight, Metabolite.exactNeutralMass AS monoIsoNeutralMass, Metabolite.averageMass AS averageMass, Metabolite.generic AS generic, MetaboliteInBioSource.sideCompound AS sideCompound, MetaboliteInBioSource.inConflictWith AS inConflictWith FROM Metabolite, MetaboliteInBioSource WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = ?");


/************************
**	Enzyme 
************************/
$R_Enzyme=	$dbh->prepare("SELECT DISTINCT EnzymeInBioSource.id AS idInBio, Enzyme.id AS id, Enzyme.name AS name, Enzyme.dbIdentifier AS dbIdentifier, EnzymeInBioSource.inConflictWith AS inConflictWith FROM Enzyme, EnzymeInBioSource WHERE Enzyme.id = EnzymeInBioSource.idEnzyme  AND EnzymeInBioSource.idBioSource =?");

/************************
**	Protein 
************************/
$R_Protein=	$dbh->prepare("SELECT DISTINCT ProteinInBioSource.id AS idInBio, Protein.id AS id, Protein.name AS name, Protein.dbIdentifier AS dbIdentifier, ProteinInBioSource.inConflictWith AS inConflictWith FROM Protein, ProteinInBioSource WHERE  ProteinInBioSource.idProtein = Protein.id AND ( ProteinInBioSource.idBioSource = ? )");

/************************
**	Gene
************************/
$R_Gene=	$dbh->prepare("SELECT DISTINCT GeneInBioSource.id AS idInBio, Gene.id AS id, Gene.name AS name, Gene.dbIdentifier AS dbIdentifier, GeneInBioSource.inConflictWith AS inConflictWith FROM Gene, GeneInBioSource WHERE  GeneInBioSource.idGene = Gene.id AND ( GeneInBioSource.idBioSource = ? )");

/***********************
 * Compartment
 ************************/
$R_Compartment=	$dbh->prepare("SELECT DISTINCT CompartmentInBioSource.idCompartmentInBioSource AS id ,CompartmentInBioSource.idCompartment AS idCompartment ,CompartmentInBioSource.identifier AS identifier, Compartment.name AS name FROM CompartmentInBioSource, Compartment WHERE CompartmentInBioSource.idCompartment= Compartment.idCompartment AND CompartmentInBioSource.idBioSource= ? ORDER BY identifier");




?>
