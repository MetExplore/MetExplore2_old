<?php
/***********************************************
 * Requete Coverage GROUP_CONCAT utilisees pour Coverage
 ***********************************************/
/************************
**	Pathway
************************/
$R_Pathway_ListidGene=			"SELECT DISTINCT Pathway.id AS id, GROUP_CONCAT(DISTINCT Gene.id) AS StringId, COUNT(DISTINCT Gene.id) AS nb FROM Pathway, ReactionInPathway, ReactionInBioSource, Catalyses, EnzymeInBioSource, ProteinInEnzyme, ProteinInBioSource, GeneCodesForProtein, GeneInBioSource WHERE  Pathway.id=ReactionInPathway.idPathway  AND ReactionInPathway.idReactionBioSource = ReactionInBioSource.id AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND GeneCodesForProtein.idProteinInBioSource = ProteinInBioSource.id AND GeneCodesForProtein.idGeneInBioSource = GeneInBioSource.id AND ReactionInBioSource.idBioSource = $P_idBioSource GROUP BY id";
$R_Pathway_ListidProtein=		"SELECT DISTINCT Pathway.id AS id, GROUP_CONCAT(DISTINCT Protein.id) AS StringId, COUNT(DISTINCT Protein.id) AS nb  FROM Pathway, ReactionInPathway, ReactionInBioSource, Catalyses, EnzymeInBioSource, ProteinInEnzyme, ProteinInBioSource WHERE  Pathway.id=ReactionInPathway.idPathway AND ReactionInPathway.idReactionBioSource = ReactionInBioSource.id AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND ProteinInEnzyme.idProteinInBioSource = ProteinInBioSource.id AND ReactionInBioSource.idBioSource = $P_idBioSource GROUP BY id";
$R_Pathway_ListidEnzyme=		"SELECT DISTINCT Pathway.id AS id, GROUP_CONCAT(DISTINCT Enzyme.id) AS StringId, COUNT(DISTINCT Enzyme.id) AS nb  FROM Pathway, ReactionInPathway, ReactionInBioSource, Catalyses, EnzymeInBioSource WHERE  Pathway.id=ReactionInPathway.idPathway AND ReactionInPathway.idReactionBioSource = ReactionInBioSource.id AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id AND ReactionInBioSource.idBioSource = $P_idBioSource GROUP BY id";
$R_Pathway_ListidMetabLeft=		"SELECT DISTINCT Pathway.id AS id, GROUP_CONCAT(DISTINCT LeftParticipant.idMetabolite) AS StringId, COUNT(DISTINCT LeftParticipant.idMetabolite) AS nb FROM Pathway, ReactionInPathway, ReactionInBioSource, Reaction, LeftParticipant,  Metabolite, MetaboliteInBioSource WHERE  Pathway.id=ReactionInPathway.idPathway AND ReactionInPathway.idReactionBioSource = ReactionInBioSource.id AND LeftParticipant.idMetabolite = Metabolite.id AND LeftParticipant.idReaction = Reaction.id AND ReactionInBioSource.idReaction = Reaction.id AND MetaboliteInBioSource.idMetabolite = Metabolite.id  AND ReactionInBioSource.idBioSource = $P_idBioSource GROUP BY id";
$R_Pathway_ListidMetabRight=	"SELECT DISTINCT Pathway.id AS id, GROUP_CONCAT(DISTINCT RightParticipant.idMetabolite) AS StringId, COUNT(DISTINCT RightParticipant.idMetabolite) AS nb FROM Pathway, ReactionInPathway, ReactionInBioSource, Reaction, RightParticipant, Metabolite, MetaboliteInBioSource WHERE  Pathway.id=ReactionInPathway.idPathway AND ReactionInPathway.idReactionBioSource = ReactionInBioSource.id AND RightParticipant.idMetabolite= Metabolite.id AND RightParticipant.idReaction= Reaction.id AND ReactionInBioSource.idReaction = Reaction.id AND MetaboliteInBioSource.idMetabolite = Metabolite.id  AND ReactionInBioSource.idBioSource = $P_idBioSource GROUP BY id";
$R_Pathway_ListidReaction=		"SELECT DISTINCT Pathway.id AS id, GROUP_CONCAT(DISTINCT Reaction.id) AS StringId, COUNT(DISTINCT Reaction.id) AS nb FROM Pathway, ReactionInPathway, ReactionInBioSource WHERE Pathway.id=ReactionInPathway.idPathway  AND ReactionInPathway.idReactionBioSource = ReactionInBioSource.id AND ReactionInBioSource.idBioSource = $P_idBioSource GROUP BY id";

/************************
**	Reaction
************************/
$R_Reaction_ListidGene=			"SELECT DISTINCT Reaction.id AS id, GROUP_CONCAT(DISTINCT Gene.id) AS StringId, COUNT(DISTINCT Gene.id) AS nb FROM Reaction, ReactionInBioSource, Catalyses, EnzymeInBioSource, ProteinInEnzyme, ProteinInBioSource, GeneCodesForProtein, GeneInBioSource WHERE  Reaction.id = ReactionInBioSource.idReaction AND ReactionInBioSource.idBioSource = $P_idBioSource AND ReactionInBioSource.id = Catalyses.idReactionInBioSource AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND GeneCodesForProtein.idProteinInBioSource = ProteinInBioSource.id AND GeneCodesForProtein.idGeneInBioSource = GeneInBioSource.id GROUP BY id";
$R_Reaction_ListidProtein=		"SELECT DISTINCT Reaction.id AS id, GROUP_CONCAT(DISTINCT Protein.id) AS StringId, COUNT(DISTINCT Protein.id) AS nb FROM Reaction, ReactionInBioSource, Catalyses, EnzymeInBioSource, ProteinInEnzyme, ProteinInBioSource WHERE  Reaction.id = ReactionInBioSource.idReaction AND ReactionInBioSource.idBioSource = $P_idBioSource AND ReactionInBioSource.id = Catalyses.idReactionInBioSource AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND ProteinInEnzyme.idProteinInBioSource = ProteinInBioSource.id  GROUP BY id";
$R_Reaction_ListidEnzyme=		"SELECT DISTINCT Reaction.id AS id, GROUP_CONCAT(DISTINCT Enzyme.id) AS StringId, COUNT(DISTINCT Enzyme.id) AS nb FROM Reaction, ReactionInBioSource, Catalyses, EnzymeInBioSource WHERE  Reaction.id = ReactionInBioSource.idReaction AND ReactionInBioSource.idBioSource = $P_idBioSource AND ReactionInBioSource.id = Catalyses.idReactionInBioSource AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id  GROUP BY id";
$R_Reaction_ListidMetabLeft=	"SELECT DISTINCT Reaction.id AS id, GROUP_CONCAT(DISTINCT LeftParticipant.idMetabolite) AS StringId, COUNT(DISTINCT LeftParticipant.idMetabolite) AS nb FROM Reaction, ReactionInBioSource, Metabolite, LeftParticipant  WHERE  Reaction.id = ReactionInBioSource.idReaction AND ReactionInBioSource.idBioSource = $P_idBioSource AND Metabolite.id = LeftParticipant.idMetabolite  AND LeftParticipant.idReaction = Reaction.id  GROUP BY id";
$R_Reaction_ListidMetabRight=	"SELECT DISTINCT Reaction.id AS id, GROUP_CONCAT(DISTINCT RightParticipant.idMetabolite) AS StringId, COUNT(DISTINCT RightParticipant.idMetabolite) AS nb FROM Reaction, ReactionInBioSource, Metabolite, RightParticipant WHERE  Reaction.id = ReactionInBioSource.idReaction AND ReactionInBioSource.idBioSource = $P_idBioSource AND Metabolite.id = RightParticipant.idMetabolite AND RightParticipant.idReaction = Reaction.id GROUP BY id";
$R_Reaction_ListidPathway=		"SELECT DISTINCT Reaction.id AS id, GROUP_CONCAT(DISTINCT Pathway.id) AS StringId, COUNT(DISTINCT Pathway.id) AS nb FROM Reaction, ReactionInBioSource, ReactionInPathway WHERE Reaction.id = ReactionInBioSource.idReaction AND ReactionInPathway.idReactionBioSource = ReactionInBioSource.id AND ReactionInBioSource.idReaction = Reaction.id  AND ReactionInBioSource.idBioSource = $P_idBioSource GROUP BY id";

/************************
**	Metabolite Left
************************/
$R_MetabLeft_ListidGene=		"SELECT DISTINCT LeftParticipant.idMetabolite AS id, GROUP_CONCAT(DISTINCT Gene.id) AS StringId, COUNT(DISTINCT Gene.id) AS nb FROM Metabolite, MetaboliteInBioSource, LeftParticipant, Reaction, ReactionInBioSource, Catalyses, EnzymeInBioSource, ProteinInEnzyme, ProteinInBioSource, GeneCodesForProtein, GeneInBioSource WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND LeftParticipant.idReaction = Reaction.id AND LeftParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource AND LeftParticipant.idReaction = Reaction.id AND Reaction.id = ReactionInBioSource.idReaction AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND GeneCodesForProtein.idProteinInBioSource = ProteinInBioSource.id AND GeneCodesForProtein.idGeneInBioSource = GeneInBioSource.id GROUP BY id";
$R_MetabLeft_ListidProtein=		"SELECT DISTINCT LeftParticipant.idMetabolite AS id, GROUP_CONCAT(DISTINCT Protein.id) AS StringId, COUNT(DISTINCT Protein.id) AS nb  FROM Metabolite, MetaboliteInBioSource, LeftParticipant, Reaction, ReactionInBioSource, Catalyses, EnzymeInBioSource, ProteinInEnzyme, ProteinInBioSource WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND LeftParticipant.idMetabolite = Metabolite.id AND LeftParticipant.idReaction = Reaction.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource AND LeftParticipant.idReaction = Reaction.id AND Reaction.id = ReactionInBioSource.idReaction AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource GROUP BY id";
$R_MetabLeft_ListidEnzyme=		"SELECT DISTINCT LeftParticipant.idMetabolite AS id, GROUP_CONCAT(DISTINCT Enzyme.id) AS StringId, COUNT(DISTINCT Enzyme.id) FROM Metabolite, MetaboliteInBioSource, LeftParticipant, Reaction, ReactionInBioSource, Catalyses, EnzymeInBioSource WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND LeftParticipant.idMetabolite = Metabolite.id AND LeftParticipant.idReaction = Reaction.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource AND LeftParticipant.idReaction = Reaction.id AND Reaction.id = ReactionInBioSource.idReaction AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id  GROUP BY id";
$R_MetabLeft_ListidReaction=	"SELECT DISTINCT LeftParticipant.idMetabolite AS id, GROUP_CONCAT(DISTINCT Reaction.id) AS StringId, COUNT(DISTINCT Reaction.id) AS nb FROM Metabolite, MetaboliteInBioSource, LeftParticipant WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND LeftParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource  GROUP BY id";
$R_MetabLeft_ListidPathway=		"SELECT DISTINCT LeftParticipant.idMetabolite AS id, GROUP_CONCAT(DISTINCT Pathway.id) AS StringId, COUNT(DISTINCT Pathway.id) AS nb FROM Metabolite, MetaboliteInBioSource, LeftParticipant, Reaction, ReactionInBioSource, ReactionInPathway WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND LeftParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource AND LeftParticipant.idReaction = Reaction.id AND LeftParticipant.idReaction = Reaction.id AND Reaction.id = ReactionInBioSource.idReaction AND ReactionInBioSource.id=ReactionInPathway.idReactionBioSource GROUP BY id";

/************************
**	Metabolite Right
************************/
$R_MetabRight_ListidGene=		"SELECT DISTINCT RightParticipant.idMetabolite AS id, GROUP_CONCAT(DISTINCT Gene.id) AS StringId, COUNT(DISTINCT Gene.id) AS nb FROM Metabolite, MetaboliteInBioSource, RightParticipant, Reaction, ReactionInBioSource, Catalyses, EnzymeInBioSource, ProteinInEnzyme, ProteinInBioSource, GeneCodesForProtein, GeneInBioSource WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND RightParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource AND RightParticipant.idReaction = Reaction.id AND Reaction.id = ReactionInBioSource.idReaction AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND GeneCodesForProtein.idProteinInBioSource = ProteinInBioSource.id AND GeneCodesForProtein.idGeneInBioSource = GeneInBioSource.id GROUP BY id";
$R_MetabRight_ListidProtein=	"SELECT DISTINCT RightParticipant.idMetabolite AS id, GROUP_CONCAT(DISTINCT Protein.id) AS StringId, COUNT(DISTINCT Protein.id) AS nb  FROM Metabolite, MetaboliteInBioSource, RightParticipant, Reaction, ReactionInBioSource, Catalyses, EnzymeInBioSource, ProteinInEnzyme, ProteinInBioSource WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND RightParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource AND RightParticipant.idReaction = Reaction.id AND Reaction.id = ReactionInBioSource.idReaction AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource GROUP BY id";
$R_MetabRight_ListidEnzyme=		"SELECT DISTINCT RightParticipant.idMetabolite AS id, GROUP_CONCAT(DISTINCT Enzyme.id) AS StringId, COUNT(DISTINCT Enzyme.id) FROM Metabolite, MetaboliteInBioSource, RightParticipant, Reaction, ReactionInBioSource, Catalyses, EnzymeInBioSource WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND RightParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource AND RightParticipant.idReaction = Reaction.id AND Reaction.id = ReactionInBioSource.idReaction AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id GROUP BY id";
$R_MetabRight_ListidReaction=	"SELECT DISTINCT RightParticipant.idMetabolite AS id, GROUP_CONCAT(DISTINCT Reaction.id) AS StringId, COUNT(DISTINCT Reaction.id) AS nb FROM Metabolite, MetaboliteInBioSource, RightParticipant WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND RightParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource GROUP BY id";
$R_MetabRight_ListidPathway=	"SELECT DISTINCT RightParticipant.idMetabolite AS id, GROUP_CONCAT(DISTINCT Pathway.id) AS StringId, COUNT(DISTINCT Pathway.id) AS nb FROM Metabolite, MetaboliteInBioSource, RightParticipant, Reaction, ReactionInBioSource, ReactionInPathway WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND RightParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource AND RightParticipant.idReaction = Reaction.id AND Reaction.id = ReactionInBioSource.idReaction AND ReactionInBioSource.id=ReactionInPathway.idReactionBioSource GROUP BY id";

/************************
**	Enzyme 
************************/
$R_Enzyme_ListidGene=			"SELECT DISTINCT Enzyme.id AS id, GROUP_CONCAT(DISTINCT Gene.id) AS StringId, COUNT(DISTINCT Gene.id) AS nb FROM Enzyme, EnzymeInBioSource, ProteinInEnzyme, ProteinInBioSource, GeneCodesForProtein, GeneInBioSource WHERE EnzymeInBioSource.idBioSource = $P_idBioSource AND Enzyme.id = EnzymeInBioSource.idEnzyme  AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND ProteinInEnzyme.idProteinInBioSource = ProteinInBioSource.id AND ProteinInBioSource.id = GeneCodesForProtein.idProteinInBioSource AND GeneCodesForProtein.idGeneInBioSource = GeneInBioSource.id GROUP BY id";
$R_Enzyme_ListidProtein=		"SELECT DISTINCT Enzyme.id AS id, GROUP_CONCAT(DISTINCT Protein.id)  AS StringId, COUNT(DISTINCT Protein.id) AS nb FROM Enzyme, EnzymeInBioSource, ProteinInEnzyme, ProteinInBioSource WHERE  EnzymeInBioSource.idBioSource = $P_idBioSource AND Enzyme.id = EnzymeInBioSource.idEnzyme  AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND ProteinInEnzyme.idProteinInBioSource = ProteinInBioSource.id GROUP BY id";
$R_Enzyme_ListidMetabLeft=		"SELECT DISTINCT Enzyme.id AS id, GROUP_CONCAT(DISTINCT LeftParticipant.idMetabolite) AS StringId, COUNT(DISTINCT LeftParticipant.idMetabolite) AS nb FROM Enzyme, EnzymeInBioSource, Reaction, LeftParticipant, ReactionInBioSource, Catalyses WHERE  EnzymeInBioSource.idBioSource = $P_idBioSource AND Enzyme.id = EnzymeInBioSource.idEnzyme  AND EnzymeInBioSource.id = Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource= ReactionInBioSource.id AND ReactionInBioSource.idReaction = Reaction.id  AND Reaction.id = LeftParticipant.idReaction GROUP BY id";
$R_Enzyme_ListidMetabRight=		"SELECT DISTINCT Enzyme.id AS id, GROUP_CONCAT(DISTINCT RightParticipant.idMetabolite) AS StringId, COUNT(DISTINCT RightParticipant.idMetabolite) AS nb FROM Enzyme, EnzymeInBioSource, Reaction, RightParticipant, ReactionInBioSource, Catalyses WHERE  EnzymeInBioSource.idBioSource = $P_idBioSource AND Enzyme.id = EnzymeInBioSource.idEnzyme  AND EnzymeInBioSource.id = Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource= ReactionInBioSource.id AND ReactionInBioSource.idReaction = Reaction.id  AND Reaction.id = RightParticipant.idReaction GROUP BY id";
$R_Enzyme_ListidReaction=		"SELECT DISTINCT Enzyme.id AS id, GROUP_CONCAT(DISTINCT Reaction.id) AS StringId, COUNT(DISTINCT Reaction.id) AS nb FROM Enzyme, EnzymeInBioSource, Catalyses, ReactionInBioSource WHERE  EnzymeInBioSource.idBioSource = $P_idBioSource AND Enzyme.id = EnzymeInBioSource.idEnzyme  AND EnzymeInBioSource.id = Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource= ReactionInBioSource.id GROUP BY id";
$R_Enzyme_ListidPathway=		"SELECT DISTINCT Enzyme.id AS id, GROUP_CONCAT(DISTINCT Pathway.id) AS StringId, COUNT(DISTINCT Pathway.id) AS nb FROM Enzyme, EnzymeInBioSource, Catalyses, ReactionInBioSource, ReactionInPathway WHERE  EnzymeInBioSource.idBioSource = $P_idBioSource AND Enzyme.id = EnzymeInBioSource.idEnzyme  AND EnzymeInBioSource.id = Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource= ReactionInBioSource.id AND ReactionInBioSource.id = ReactionInPathway.idReactionBioSource GROUP BY id";

/************************
**	Protein 
************************/
$R_Protein_ListidGene=			"SELECT DISTINCT Protein.id AS id, GROUP_CONCAT(DISTINCT Gene.id) AS StringId, COUNT(DISTINCT Gene.id) AS nb FROM Protein, ProteinInBioSource, GeneCodesForProtein, GeneInBioSource WHERE  ProteinInBioSource.idBioSource = $P_idBioSource AND Protein.id = ProteinInBioSource.idProtein AND ProteinInBioSource.id = GeneCodesForProtein.idProteinInBioSource  AND GeneCodesForProtein.idGeneInBioSource = GeneInBioSource.id GROUP BY id";
$R_Protein_ListidEnzyme=		"SELECT DISTINCT Protein.id AS id, GROUP_CONCAT(DISTINCT Enzyme.id) AS StringId, COUNT(DISTINCT Enzyme.id) AS nb FROM Protein, ProteinInBioSource, ProteinInEnzyme, EnzymeInBioSource WHERE  ProteinInBioSource.idBioSource = $P_idBioSource AND Protein.id = ProteinInBioSource.idProtein AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND ProteinInEnzyme.idEnzymeInBioSource = EnzymeInBioSource.id GROUP BY id";
$R_Protein_ListidMetabLeft=		"SELECT DISTINCT Protein.id AS id, GROUP_CONCAT(DISTINCT LeftParticipant.idMetabolite) AS StringId, COUNT(DISTINCT LeftParticipant.idMetabolite) AS nb FROM Protein, ProteinInBioSource, Reaction, LeftParticipant, ReactionInBioSource, Catalyses, EnzymeInBioSource, ProteinInEnzyme WHERE  ProteinInBioSource.idBioSource = $P_idBioSource AND Protein.id = ProteinInBioSource.idProtein AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND ProteinInEnzyme.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id =Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND ReactionInBioSource.idReaction = Reaction.id AND Reaction.id = LeftParticipant.idReaction GROUP BY id";
$R_Protein_ListidMetabRight=	"SELECT DISTINCT Protein.id AS id, GROUP_CONCAT(DISTINCT RightParticipant.idMetabolite) AS StringId, COUNT(DISTINCT RightParticipant.idMetabolite) AS nb FROM Protein, ProteinInBioSource, Reaction, RightParticipant, ReactionInBioSource, Catalyses, EnzymeInBioSource, ProteinInEnzyme WHERE  ProteinInBioSource.idBioSource = $P_idBioSource AND Protein.id = ProteinInBioSource.idProtein AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND ProteinInEnzyme.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id =Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND ReactionInBioSource.idReaction = Reaction.id AND Reaction.id = RightParticipant.idReaction GROUP BY id";
$R_Protein_ListidReaction=		"SELECT DISTINCT Protein.id AS id, GROUP_CONCAT(DISTINCT Reaction.id) AS StringId, COUNT(DISTINCT Reaction.id) AS nb FROM Protein, ProteinInBioSource, ProteinInEnzyme, EnzymeInBioSource, Catalyses, ReactionInBioSource WHERE  ProteinInBioSource.idBioSource = $P_idBioSource AND Protein.id = ProteinInBioSource.idProtein AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND ProteinInEnzyme.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id =Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource = ReactionInBioSource.id GROUP BY id";
$R_Protein_ListidPathway=		"SELECT DISTINCT Protein.id AS id, GROUP_CONCAT(DISTINCT Pathway.id) AS StringId, COUNT(DISTINCT Pathway.id) AS nb FROM Protein, ProteinInBioSource, ProteinInEnzyme, EnzymeInBioSource, Catalyses, ReactionInBioSource, ReactionInPathway WHERE  ProteinInBioSource.idBioSource = $P_idBioSource AND Protein.id = ProteinInBioSource.idProtein AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND ProteinInEnzyme.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id =Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND ReactionInBioSource.id = ReactionInPathway.idReactionBioSource GROUP BY id";

/************************
**	Gene
************************/
$R_Gene_ListidProtein=			"SELECT DISTINCT Gene.id AS id, GROUP_CONCAT(DISTINCT Protein.id) AS StringId, COUNT(DISTINCT Protein.id) FROM Gene, GeneInBioSource, GeneCodesForProtein, ProteinInBioSource WHERE GeneInBioSource.idBioSource = $P_idBioSource AND Gene.id = GeneInBioSource.idGene AND GeneInBioSource.id = GeneCodesForProtein.idGeneInBioSource AND GeneCodesForProtein.idProteinInBioSource= ProteinInBioSource.id GROUP BY id";
$R_Gene_ListidEnzyme=			"SELECT DISTINCT Gene.id AS id, GROUP_CONCAT(DISTINCT Enzyme.id) AS StringId, COUNT(DISTINCT Enzyme.id) FROM Gene, GeneInBioSource, GeneCodesForProtein, ProteinInBioSource, ProteinInEnzyme, EnzymeInBioSource WHERE GeneInBioSource.idBioSource = $P_idBioSource AND Gene.id = GeneInBioSource.idGene AND GeneInBioSource.id = GeneCodesForProtein.idGeneInBioSource AND GeneCodesForProtein.idProteinInBioSource= ProteinInBioSource.id AND ProteinInBioSource.id=ProteinInEnzyme.idProteinInBioSource AND ProteinInEnzyme.idEnzymeInBioSource=EnzymeInBioSource.id GROUP BY id";
$R_Gene_ListidMetabLeft=		"SELECT DISTINCT Gene.id AS id, GROUP_CONCAT(DISTINCT LeftParticipant.idMetabolite) AS StringId, COUNT(DISTINCT LeftParticipant.idMetabolite) AS nb FROM Gene, GeneInBioSource, GeneCodesForProtein, ProteinInBioSource, ProteinInEnzyme, EnzymeInBioSource, Catalyses, ReactionInBioSource, Reaction, LeftParticipant WHERE  GeneInBioSource.idBioSource = $P_idBioSource AND GeneInBioSource.idGene = Gene.id AND GeneInBioSource.id = GeneCodesForProtein.idGeneInBioSource AND GeneCodesForProtein.idProteinInBioSource = ProteinInBioSource.id AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND EnzymeInBioSource.id = Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND Reaction.id = ReactionInBioSource.idReaction AND LeftParticipant.idReaction = Reaction.id GROUP BY id";
$R_Gene_ListidMetabRight=		"SELECT DISTINCT Gene.id AS id, GROUP_CONCAT(DISTINCT RightParticipant.idMetabolite) AS StringId, COUNT(DISTINCT RightParticipant.idMetabolite) AS nb FROM Gene, GeneInBioSource, GeneCodesForProtein, ProteinInBioSource, ProteinInEnzyme, EnzymeInBioSource, Catalyses, ReactionInBioSource, Reaction, RightParticipant WHERE  GeneInBioSource.idBioSource = $P_idBioSource AND GeneInBioSource.idGene = Gene.id AND GeneInBioSource.id = GeneCodesForProtein.idGeneInBioSource AND GeneCodesForProtein.idProteinInBioSource = ProteinInBioSource.id AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND EnzymeInBioSource.id = Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND Reaction.id = ReactionInBioSource.idReaction AND RightParticipant.idReaction = Reaction.id GROUP BY id";
$R_Gene_ListidReaction=			"SELECT DISTINCT Gene.id AS id, GROUP_CONCAT(DISTINCT Reaction.id) AS StringId, COUNT(DISTINCT Reaction.id) AS nb FROM Gene, GeneInBioSource, GeneCodesForProtein, ProteinInBioSource, ProteinInEnzyme, EnzymeInBioSource, Catalyses, ReactionInBioSource WHERE  GeneInBioSource.idBioSource = $P_idBioSource AND GeneInBioSource.idGene = Gene.id AND GeneInBioSource.id = GeneCodesForProtein.idGeneInBioSource AND GeneCodesForProtein.idProteinInBioSource = ProteinInBioSource.id AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND EnzymeInBioSource.id = Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource = ReactionInBioSource.id GROUP BY id";
$R_Gene_ListidPathway=			"SELECT DISTINCT Gene.id AS id, GROUP_CONCAT(DISTINCT Pathway.id) AS StringId, COUNT(DISTINCT Pathway.id) AS nb FROM Gene, GeneInBioSource, GeneCodesForProtein, ProteinInBioSource, ProteinInEnzyme, EnzymeInBioSource, Catalyses, ReactionInBioSource, ReactionInPathway WHERE  GeneInBioSource.idBioSource = $P_idBioSource AND GeneInBioSource.idGene = Gene.id AND GeneCodesForProtein.idGeneInBioSource = GeneInBioSource.id AND GeneCodesForProtein.idProteinInBioSource = ProteinInBioSource.id AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND ReactionInPathway.idReactionBioSource = ReactionInBioSource.id GROUP BY id";
?>