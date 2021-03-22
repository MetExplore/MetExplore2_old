<?php
/***********************************************
 * Requete Coverage GROUP_CONCAT utilisees pour Coverage
 ***********************************************/
/************************
**	Pathway
************************/
$R_Pathway_Gene=		"SELECT DISTINCT Pathway.id AS id, GROUP_CONCAT(DISTINCT GeneInBioSource.idGene) AS StringId, COUNT(DISTINCT GeneInBioSource.id) AS nb FROM Pathway, ReactionInPathway, ReactionInBioSource, Catalyses, EnzymeInBioSource, ProteinInEnzyme, ProteinInBioSource, GeneCodesForProtein, GeneInBioSource WHERE  Pathway.id=ReactionInPathway.idPathway  AND ReactionInPathway.idReactionBioSource = ReactionInBioSource.id AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND GeneCodesForProtein.idProteinInBioSource = ProteinInBioSource.id AND GeneCodesForProtein.idGeneInBioSource = GeneInBioSource.id AND ReactionInBioSource.idBioSource = $P_idBioSource GROUP BY id";
$R_Pathway_Protein=		"SELECT DISTINCT Pathway.id AS id, GROUP_CONCAT(DISTINCT ProteinInBioSource.idProtein) AS StringId, COUNT(DISTINCT ProteinInBioSource.idProtein) AS nb  FROM Pathway, ReactionInPathway, ReactionInBioSource, Catalyses, EnzymeInBioSource, ProteinInEnzyme, ProteinInBioSource WHERE  Pathway.id=ReactionInPathway.idPathway AND ReactionInPathway.idReactionBioSource = ReactionInBioSource.id AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND ProteinInEnzyme.idProteinInBioSource = ProteinInBioSource.id AND ReactionInBioSource.idBioSource = $P_idBioSource GROUP BY id";
$R_Pathway_Enzyme=		"SELECT DISTINCT Pathway.id AS id, GROUP_CONCAT(DISTINCT EnzymeInBioSource.idEnzyme) AS StringId, COUNT(DISTINCT EnzymeInBioSource.idEnzyme) AS nb  FROM Pathway, ReactionInPathway, ReactionInBioSource, Catalyses, EnzymeInBioSource WHERE  Pathway.id=ReactionInPathway.idPathway AND ReactionInPathway.idReactionBioSource = ReactionInBioSource.id AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id AND ReactionInBioSource.idBioSource = $P_idBioSource GROUP BY id";
$R_Pathway_MetabLeft=	"SELECT DISTINCT Pathway.id AS id, GROUP_CONCAT(DISTINCT LeftParticipant.idMetabolite) AS StringId, COUNT(DISTINCT LeftParticipant.idMetabolite) AS nb FROM Pathway, ReactionInPathway, ReactionInBioSource, Reaction, LeftParticipant,  Metabolite, MetaboliteInBioSource WHERE  Pathway.id=ReactionInPathway.idPathway AND ReactionInPathway.idReactionBioSource = ReactionInBioSource.id AND LeftParticipant.idMetabolite = Metabolite.id AND LeftParticipant.idReaction = Reaction.id AND ReactionInBioSource.idReaction = Reaction.id AND MetaboliteInBioSource.idMetabolite = Metabolite.id  AND ReactionInBioSource.idBioSource = $P_idBioSource GROUP BY id";
$R_Pathway_MetabRight=	"SELECT DISTINCT Pathway.id AS id, GROUP_CONCAT(DISTINCT RightParticipant.idMetabolite) AS StringId, COUNT(DISTINCT RightParticipant.idMetabolite) AS nb FROM Pathway, ReactionInPathway, ReactionInBioSource, Reaction, RightParticipant, Metabolite, MetaboliteInBioSource WHERE  Pathway.id=ReactionInPathway.idPathway AND ReactionInPathway.idReactionBioSource = ReactionInBioSource.id AND RightParticipant.idMetabolite= Metabolite.id AND RightParticipant.idReaction= Reaction.id AND ReactionInBioSource.idReaction = Reaction.id AND MetaboliteInBioSource.idMetabolite = Metabolite.id  AND ReactionInBioSource.idBioSource = $P_idBioSource GROUP BY id";
$R_Pathway_Reaction=	"SELECT DISTINCT Pathway.id AS id, GROUP_CONCAT(DISTINCT ReactionInBioSource.idReaction) AS StringId, COUNT(DISTINCT ReactionInBioSource.idReaction) AS nb FROM Pathway, ReactionInPathway, ReactionInBioSource WHERE Pathway.id=ReactionInPathway.idPathway  AND ReactionInPathway.idReactionBioSource = ReactionInBioSource.id AND ReactionInBioSource.idBioSource = $P_idBioSource GROUP BY id";

/************************
**	Reaction
************************/
$R_Reaction_Gene=		"SELECT DISTINCT Reaction.id AS id, GROUP_CONCAT(DISTINCT GeneInBioSource.idGene) AS StringId, COUNT(DISTINCT GeneInBioSource.idGene) AS nb FROM Reaction, ReactionInBioSource, Catalyses, EnzymeInBioSource, ProteinInEnzyme, ProteinInBioSource, GeneCodesForProtein, GeneInBioSource WHERE  Reaction.id = ReactionInBioSource.idReaction AND ReactionInBioSource.idBioSource = $P_idBioSource AND ReactionInBioSource.id = Catalyses.idReactionInBioSource AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND GeneCodesForProtein.idProteinInBioSource = ProteinInBioSource.id AND GeneCodesForProtein.idGeneInBioSource = GeneInBioSource.id GROUP BY id";
$R_Reaction_Protein=	"SELECT DISTINCT Reaction.id AS id, GROUP_CONCAT(DISTINCT ProteinInBioSource.idProtein) AS StringId, COUNT(DISTINCT ProteinInBioSource.idProtein) AS nb FROM Reaction, ReactionInBioSource, Catalyses, EnzymeInBioSource, ProteinInEnzyme, ProteinInBioSource WHERE  Reaction.id = ReactionInBioSource.idReaction AND ReactionInBioSource.idBioSource = $P_idBioSource AND ReactionInBioSource.id = Catalyses.idReactionInBioSource AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND ProteinInEnzyme.idProteinInBioSource = ProteinInBioSource.id  GROUP BY id";
$R_Reaction_Enzyme=		"SELECT DISTINCT Reaction.id AS id, GROUP_CONCAT(DISTINCT EnzymeInBioSource.idEnzyme) AS StringId, COUNT(DISTINCT EnzymeInBioSource.idEnzyme) AS nb FROM Reaction, ReactionInBioSource, Catalyses, EnzymeInBioSource WHERE  Reaction.id = ReactionInBioSource.idReaction AND ReactionInBioSource.idBioSource = $P_idBioSource AND ReactionInBioSource.id = Catalyses.idReactionInBioSource AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id  GROUP BY id";
$R_Reaction_MetabLeft=	"SELECT DISTINCT Reaction.id AS id, GROUP_CONCAT(DISTINCT LeftParticipant.idMetabolite) AS StringId, COUNT(DISTINCT LeftParticipant.idMetabolite) AS nb FROM Reaction, ReactionInBioSource, Metabolite, LeftParticipant  WHERE  Reaction.id = ReactionInBioSource.idReaction AND ReactionInBioSource.idBioSource = $P_idBioSource AND Metabolite.id = LeftParticipant.idMetabolite  AND LeftParticipant.idReaction = Reaction.id  GROUP BY id";
$R_Reaction_MetabRight=	"SELECT DISTINCT Reaction.id AS id, GROUP_CONCAT(DISTINCT RightParticipant.idMetabolite) AS StringId, COUNT(DISTINCT RightParticipant.idMetabolite) AS nb FROM Reaction, ReactionInBioSource, Metabolite, RightParticipant WHERE  Reaction.id = ReactionInBioSource.idReaction AND ReactionInBioSource.idBioSource = $P_idBioSource AND Metabolite.id = RightParticipant.idMetabolite AND RightParticipant.idReaction = Reaction.id GROUP BY id";
$R_Reaction_Pathway=	"SELECT DISTINCT Reaction.id AS id, GROUP_CONCAT(DISTINCT ReactionInPathway.idPathway) AS StringId, COUNT(DISTINCT ReactionInPathway.idPathway) AS nb FROM Reaction, ReactionInBioSource, ReactionInPathway WHERE Reaction.id = ReactionInBioSource.idReaction AND ReactionInPathway.idReactionBioSource = ReactionInBioSource.id AND ReactionInBioSource.idReaction = Reaction.id  AND ReactionInBioSource.idBioSource = $P_idBioSource GROUP BY id";

/************************
**	Metabolite Left
************************/
$R_MetabLeft_Gene=		"SELECT DISTINCT LeftParticipant.idMetabolite AS id, GROUP_CONCAT(DISTINCT GeneInBioSource.idGene) AS StringId, COUNT(DISTINCT GeneInBioSource.idGene) AS nb FROM Metabolite, MetaboliteInBioSource, LeftParticipant, Reaction, ReactionInBioSource, Catalyses, EnzymeInBioSource, ProteinInEnzyme, ProteinInBioSource, GeneCodesForProtein, GeneInBioSource WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND LeftParticipant.idReaction = Reaction.id AND LeftParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource AND LeftParticipant.idReaction = Reaction.id AND Reaction.id = ReactionInBioSource.idReaction AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND GeneCodesForProtein.idProteinInBioSource = ProteinInBioSource.id AND GeneCodesForProtein.idGeneInBioSource = GeneInBioSource.id GROUP BY id";
$R_MetabLeft_Protein=	"SELECT DISTINCT LeftParticipant.idMetabolite AS id, GROUP_CONCAT(DISTINCT ProteinInBioSource.idProtein) AS StringId, COUNT(DISTINCT ProteinInBioSource.idProtein) AS nb  FROM Metabolite, MetaboliteInBioSource, LeftParticipant, Reaction, ReactionInBioSource, Catalyses, EnzymeInBioSource, ProteinInEnzyme, ProteinInBioSource WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND LeftParticipant.idMetabolite = Metabolite.id AND LeftParticipant.idReaction = Reaction.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource AND LeftParticipant.idReaction = Reaction.id AND Reaction.id = ReactionInBioSource.idReaction AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource GROUP BY id";
$R_MetabLeft_Enzyme=	"SELECT DISTINCT LeftParticipant.idMetabolite AS id, GROUP_CONCAT(DISTINCT EnzymeInBioSource.idEnzyme) AS StringId, COUNT(DISTINCT EnzymeInBioSource.idEnzyme)  AS nb FROM Metabolite, MetaboliteInBioSource, LeftParticipant, Reaction, ReactionInBioSource, Catalyses, EnzymeInBioSource WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND LeftParticipant.idMetabolite = Metabolite.id AND LeftParticipant.idReaction = Reaction.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource AND LeftParticipant.idReaction = Reaction.id AND Reaction.id = ReactionInBioSource.idReaction AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id  GROUP BY id";
$R_MetabLeft_Reaction=	"SELECT DISTINCT LeftParticipant.idMetabolite AS id, GROUP_CONCAT(DISTINCT ReactionInBioSource.idReaction) AS StringId, COUNT(DISTINCT ReactionInBioSource.idReaction) AS nb FROM Metabolite, MetaboliteInBioSource, LeftParticipant WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND LeftParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource  GROUP BY id";
$R_MetabLeft_Pathway=	"SELECT DISTINCT LeftParticipant.idMetabolite AS id, GROUP_CONCAT(DISTINCT ReactionInPathway.idPathway) AS StringId, COUNT(DISTINCT ReactionInPathway.idPathway) AS nb FROM Metabolite, MetaboliteInBioSource, LeftParticipant, Reaction, ReactionInBioSource, ReactionInPathway WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND LeftParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource AND LeftParticipant.idReaction = Reaction.id AND LeftParticipant.idReaction = Reaction.id AND Reaction.id = ReactionInBioSource.idReaction AND ReactionInBioSource.id=ReactionInPathway.idReactionBioSource GROUP BY id";

/************************
**	Metabolite Right
************************/
$R_MetabRight_Gene=		"SELECT DISTINCT RightParticipant.idMetabolite AS id, GROUP_CONCAT(DISTINCT GeneInBioSource.idGene) AS StringId, COUNT(DISTINCT GeneInBioSource.idGene) AS nb FROM Metabolite, MetaboliteInBioSource, RightParticipant, Reaction, ReactionInBioSource, Catalyses, EnzymeInBioSource, ProteinInEnzyme, ProteinInBioSource, GeneCodesForProtein, GeneInBioSource WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND RightParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource AND RightParticipant.idReaction = Reaction.id AND Reaction.id = ReactionInBioSource.idReaction AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND GeneCodesForProtein.idProteinInBioSource = ProteinInBioSource.id AND GeneCodesForProtein.idGeneInBioSource = GeneInBioSource.id GROUP BY id";
$R_MetabRight_Protein=	"SELECT DISTINCT RightParticipant.idMetabolite AS id, GROUP_CONCAT(DISTINCT ProteinInBioSource.idProtein) AS StringId, COUNT(DISTINCT ProteinInBioSource.idProtein) AS nb  FROM Metabolite, MetaboliteInBioSource, RightParticipant, Reaction, ReactionInBioSource, Catalyses, EnzymeInBioSource, ProteinInEnzyme, ProteinInBioSource WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND RightParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource AND RightParticipant.idReaction = Reaction.id AND Reaction.id = ReactionInBioSource.idReaction AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource GROUP BY id";
$R_MetabRight_Enzyme=	"SELECT DISTINCT RightParticipant.idMetabolite AS id, GROUP_CONCAT(DISTINCT EnzymeInBioSource.idEnzyme) AS StringId, COUNT(DISTINCT EnzymeInBioSource.idEnzyme)  AS nb FROM Metabolite, MetaboliteInBioSource, RightParticipant, Reaction, ReactionInBioSource, Catalyses, EnzymeInBioSource WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND RightParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource AND RightParticipant.idReaction = Reaction.id AND Reaction.id = ReactionInBioSource.idReaction AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id GROUP BY id";
$R_MetabRight_Reaction=	"SELECT DISTINCT RightParticipant.idMetabolite AS id, GROUP_CONCAT(DISTINCT ReactionInBioSource.idReaction) AS StringId, COUNT(DISTINCT ReactionInBioSource.idReaction) AS nb FROM Metabolite, MetaboliteInBioSource, RightParticipant WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND RightParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource GROUP BY id";
$R_MetabRight_Pathway=	"SELECT DISTINCT RightParticipant.idMetabolite AS id, GROUP_CONCAT(DISTINCT ReactionInPathway.idPathway) AS StringId, COUNT(DISTINCT ReactionInPathway.idPathway) AS nb FROM Metabolite, MetaboliteInBioSource, RightParticipant, Reaction, ReactionInBioSource, ReactionInPathway WHERE  MetaboliteInBioSource.idMetabolite = Metabolite.id AND RightParticipant.idMetabolite = Metabolite.id AND MetaboliteInBioSource.idBioSource = $P_idBioSource AND RightParticipant.idReaction = Reaction.id AND Reaction.id = ReactionInBioSource.idReaction AND ReactionInBioSource.id=ReactionInPathway.idReactionBioSource GROUP BY id";

/************************
**	Enzyme 
************************/
$R_Enzyme_Gene=			"SELECT DISTINCT Enzyme.id AS id, GROUP_CONCAT(DISTINCT GeneInBioSource.idGene) AS StringId, COUNT(DISTINCT GeneInBioSource.idGene) AS nb FROM Enzyme, EnzymeInBioSource, ProteinInEnzyme, ProteinInBioSource, GeneCodesForProtein, GeneInBioSource WHERE EnzymeInBioSource.idBioSource = $P_idBioSource AND Enzyme.id = EnzymeInBioSource.idEnzyme  AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND ProteinInEnzyme.idProteinInBioSource = ProteinInBioSource.id AND ProteinInBioSource.id = GeneCodesForProtein.idProteinInBioSource AND GeneCodesForProtein.idGeneInBioSource = GeneInBioSource.id GROUP BY id";
$R_Enzyme_Protein=		"SELECT DISTINCT Enzyme.id AS id, GROUP_CONCAT(DISTINCT ProteinInBioSource.idProtein)  AS StringId, COUNT(DISTINCT ProteinInBioSource.idProtein) AS nb FROM Enzyme, EnzymeInBioSource, ProteinInEnzyme, ProteinInBioSource WHERE  EnzymeInBioSource.idBioSource = $P_idBioSource AND Enzyme.id = EnzymeInBioSource.idEnzyme  AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND ProteinInEnzyme.idProteinInBioSource = ProteinInBioSource.id GROUP BY id";
$R_Enzyme_MetabLeft=	"SELECT DISTINCT Enzyme.id AS id, GROUP_CONCAT(DISTINCT LeftParticipant.idMetabolite) AS StringId, COUNT(DISTINCT LeftParticipant.idMetabolite) AS nb FROM Enzyme, EnzymeInBioSource, Reaction, LeftParticipant, ReactionInBioSource, Catalyses WHERE  EnzymeInBioSource.idBioSource = $P_idBioSource AND Enzyme.id = EnzymeInBioSource.idEnzyme  AND EnzymeInBioSource.id = Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource= ReactionInBioSource.id AND ReactionInBioSource.idReaction = Reaction.id  AND Reaction.id = LeftParticipant.idReaction GROUP BY id";
$R_Enzyme_MetabRight=	"SELECT DISTINCT Enzyme.id AS id, GROUP_CONCAT(DISTINCT RightParticipant.idMetabolite) AS StringId, COUNT(DISTINCT RightParticipant.idMetabolite) AS nb FROM Enzyme, EnzymeInBioSource, Reaction, RightParticipant, ReactionInBioSource, Catalyses WHERE  EnzymeInBioSource.idBioSource = $P_idBioSource AND Enzyme.id = EnzymeInBioSource.idEnzyme  AND EnzymeInBioSource.id = Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource= ReactionInBioSource.id AND ReactionInBioSource.idReaction = Reaction.id  AND Reaction.id = RightParticipant.idReaction GROUP BY id";
$R_Enzyme_Reaction=		"SELECT DISTINCT Enzyme.id AS id, GROUP_CONCAT(DISTINCT ReactionInBioSource.idReaction) AS StringId, COUNT(DISTINCT ReactionInBioSource.idReaction) AS nb FROM Enzyme, EnzymeInBioSource, Catalyses, ReactionInBioSource WHERE  EnzymeInBioSource.idBioSource = $P_idBioSource AND Enzyme.id = EnzymeInBioSource.idEnzyme  AND EnzymeInBioSource.id = Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource= ReactionInBioSource.id GROUP BY id";
$R_Enzyme_Pathway=		"SELECT DISTINCT Enzyme.id AS id, GROUP_CONCAT(DISTINCT ReactionInPathway.idPathway) AS StringId, COUNT(DISTINCT ReactionInPathway.idPathway) AS nb FROM Enzyme, EnzymeInBioSource, Catalyses, ReactionInBioSource, ReactionInPathway WHERE  EnzymeInBioSource.idBioSource = $P_idBioSource AND Enzyme.id = EnzymeInBioSource.idEnzyme  AND EnzymeInBioSource.id = Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource= ReactionInBioSource.id AND ReactionInBioSource.id = ReactionInPathway.idReactionBioSource GROUP BY id";

/************************
**	Protein 
************************/
$R_Protein_Gene=		"SELECT DISTINCT Protein.id AS id, GROUP_CONCAT(DISTINCT GeneInBioSource.idGene) AS StringId, COUNT(DISTINCT GeneInBioSource.idGene) AS nb FROM Protein, ProteinInBioSource, GeneCodesForProtein, GeneInBioSource WHERE  ProteinInBioSource.idBioSource = $P_idBioSource AND Protein.id = ProteinInBioSource.idProtein AND ProteinInBioSource.id = GeneCodesForProtein.idProteinInBioSource  AND GeneCodesForProtein.idGeneInBioSource = GeneInBioSource.id GROUP BY id";
$R_Protein_Enzyme=		"SELECT DISTINCT Protein.id AS id, GROUP_CONCAT(DISTINCT EnzymeInBioSource.idEnzyme) AS StringId, COUNT(DISTINCT EnzymeInBioSource.idEnzyme) AS nb FROM Protein, ProteinInBioSource, ProteinInEnzyme, EnzymeInBioSource WHERE  ProteinInBioSource.idBioSource = $P_idBioSource AND Protein.id = ProteinInBioSource.idProtein AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND ProteinInEnzyme.idEnzymeInBioSource = EnzymeInBioSource.id GROUP BY id";
$R_Protein_MetabLeft=	"SELECT DISTINCT Protein.id AS id, GROUP_CONCAT(DISTINCT LeftParticipant.idMetabolite) AS StringId, COUNT(DISTINCT LeftParticipant.idMetabolite) AS nb FROM Protein, ProteinInBioSource, Reaction, LeftParticipant, ReactionInBioSource, Catalyses, EnzymeInBioSource, ProteinInEnzyme WHERE  ProteinInBioSource.idBioSource = $P_idBioSource AND Protein.id = ProteinInBioSource.idProtein AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND ProteinInEnzyme.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id =Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND ReactionInBioSource.idReaction = Reaction.id AND Reaction.id = LeftParticipant.idReaction GROUP BY id";
$R_Protein_MetabRight=	"SELECT DISTINCT Protein.id AS id, GROUP_CONCAT(DISTINCT RightParticipant.idMetabolite) AS StringId, COUNT(DISTINCT RightParticipant.idMetabolite) AS nb FROM Protein, ProteinInBioSource, Reaction, RightParticipant, ReactionInBioSource, Catalyses, EnzymeInBioSource, ProteinInEnzyme WHERE  ProteinInBioSource.idBioSource = $P_idBioSource AND Protein.id = ProteinInBioSource.idProtein AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND ProteinInEnzyme.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id =Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND ReactionInBioSource.idReaction = Reaction.id AND Reaction.id = RightParticipant.idReaction GROUP BY id";
$R_Protein_Reaction=	"SELECT DISTINCT Protein.id AS id, GROUP_CONCAT(DISTINCT ReactionInBioSource.idReaction) AS StringId, COUNT(DISTINCT ReactionInBioSource.idReaction) AS nb FROM Protein, ProteinInBioSource, ProteinInEnzyme, EnzymeInBioSource, Catalyses, ReactionInBioSource WHERE  ProteinInBioSource.idBioSource = $P_idBioSource AND Protein.id = ProteinInBioSource.idProtein AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND ProteinInEnzyme.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id =Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource = ReactionInBioSource.id GROUP BY id";
$R_Protein_Pathway=		"SELECT DISTINCT Protein.id AS id, GROUP_CONCAT(DISTINCT ReactionInPathway.idPathway) AS StringId, COUNT(DISTINCT ReactionInPathway.idPathway) AS nb FROM Protein, ProteinInBioSource, ProteinInEnzyme, EnzymeInBioSource, Catalyses, ReactionInBioSource, ReactionInPathway WHERE  ProteinInBioSource.idBioSource = $P_idBioSource AND Protein.id = ProteinInBioSource.idProtein AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND ProteinInEnzyme.idEnzymeInBioSource = EnzymeInBioSource.id AND EnzymeInBioSource.id =Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND ReactionInBioSource.id = ReactionInPathway.idReactionBioSource GROUP BY id";

/************************
**	Gene
************************/
$R_Gene_Protein=		"SELECT DISTINCT Gene.id AS id, GROUP_CONCAT(DISTINCT ProteinInBioSource.idProtein) AS StringId, COUNT(DISTINCT ProteinInBioSource.idProtein) AS nb FROM Gene, GeneInBioSource, GeneCodesForProtein, ProteinInBioSource WHERE GeneInBioSource.idBioSource = $P_idBioSource AND Gene.id = GeneInBioSource.idGene AND GeneInBioSource.id = GeneCodesForProtein.idGeneInBioSource AND GeneCodesForProtein.idProteinInBioSource= ProteinInBioSource.id GROUP BY id";
$R_Gene_Enzyme=			"SELECT DISTINCT Gene.id AS id, GROUP_CONCAT(DISTINCT EnzymeInBioSource.idEnzyme) AS StringId, COUNT(DISTINCT EnzymeInBioSource.idEnzyme) AS nb FROM Gene, GeneInBioSource, GeneCodesForProtein, ProteinInBioSource, ProteinInEnzyme, EnzymeInBioSource WHERE GeneInBioSource.idBioSource = $P_idBioSource AND Gene.id = GeneInBioSource.idGene AND GeneInBioSource.id = GeneCodesForProtein.idGeneInBioSource AND GeneCodesForProtein.idProteinInBioSource= ProteinInBioSource.id AND ProteinInBioSource.id=ProteinInEnzyme.idProteinInBioSource AND ProteinInEnzyme.idEnzymeInBioSource=EnzymeInBioSource.id GROUP BY id";
$R_Gene_MetabLeft=		"SELECT DISTINCT Gene.id AS id, GROUP_CONCAT(DISTINCT LeftParticipant.idMetabolite) AS StringId, COUNT(DISTINCT LeftParticipant.idMetabolite) AS nb FROM Gene, GeneInBioSource, GeneCodesForProtein, ProteinInBioSource, ProteinInEnzyme, EnzymeInBioSource, Catalyses, ReactionInBioSource, Reaction, LeftParticipant WHERE  GeneInBioSource.idBioSource = $P_idBioSource AND GeneInBioSource.idGene = Gene.id AND GeneInBioSource.id = GeneCodesForProtein.idGeneInBioSource AND GeneCodesForProtein.idProteinInBioSource = ProteinInBioSource.id AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND EnzymeInBioSource.id = Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND Reaction.id = ReactionInBioSource.idReaction AND LeftParticipant.idReaction = Reaction.id GROUP BY id";
$R_Gene_MetabRight=		"SELECT DISTINCT Gene.id AS id, GROUP_CONCAT(DISTINCT RightParticipant.idMetabolite) AS StringId, COUNT(DISTINCT RightParticipant.idMetabolite) AS nb FROM Gene, GeneInBioSource, GeneCodesForProtein, ProteinInBioSource, ProteinInEnzyme, EnzymeInBioSource, Catalyses, ReactionInBioSource, Reaction, RightParticipant WHERE  GeneInBioSource.idBioSource = $P_idBioSource AND GeneInBioSource.idGene = Gene.id AND GeneInBioSource.id = GeneCodesForProtein.idGeneInBioSource AND GeneCodesForProtein.idProteinInBioSource = ProteinInBioSource.id AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND EnzymeInBioSource.id = Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND Reaction.id = ReactionInBioSource.idReaction AND RightParticipant.idReaction = Reaction.id GROUP BY id";
$R_Gene_Reaction=		"SELECT DISTINCT Gene.id AS id, GROUP_CONCAT(DISTINCT ReactionInBioSource.idReaction) AS StringId, COUNT(DISTINCT ReactionInBioSource.idReaction) AS nb FROM Gene, GeneInBioSource, GeneCodesForProtein, ProteinInBioSource, ProteinInEnzyme, EnzymeInBioSource, Catalyses, ReactionInBioSource WHERE  GeneInBioSource.idBioSource = $P_idBioSource AND GeneInBioSource.idGene = Gene.id AND GeneInBioSource.id = GeneCodesForProtein.idGeneInBioSource AND GeneCodesForProtein.idProteinInBioSource = ProteinInBioSource.id AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND EnzymeInBioSource.id = Catalyses.idEnzymeInBioSource AND Catalyses.idReactionInBioSource = ReactionInBioSource.id GROUP BY id";
$R_Gene_Pathway=		"SELECT DISTINCT Gene.id AS id, GROUP_CONCAT(DISTINCT ReactionInPathway.idPathway) AS StringId, COUNT(DISTINCT ReactionInPathway.idPathway) AS nb FROM Gene, GeneInBioSource, GeneCodesForProtein, ProteinInBioSource, ProteinInEnzyme, EnzymeInBioSource, Catalyses, ReactionInBioSource, ReactionInPathway WHERE  GeneInBioSource.idBioSource = $P_idBioSource AND GeneInBioSource.idGene = Gene.id AND GeneCodesForProtein.idGeneInBioSource = GeneInBioSource.id AND GeneCodesForProtein.idProteinInBioSource = ProteinInBioSource.id AND ProteinInBioSource.id = ProteinInEnzyme.idProteinInBioSource AND EnzymeInBioSource.id = ProteinInEnzyme.idEnzymeInBioSource AND Catalyses.idEnzymeInBioSource = EnzymeInBioSource.id AND Catalyses.idReactionInBioSource = ReactionInBioSource.id AND ReactionInPathway.idReactionBioSource = ReactionInBioSource.id GROUP BY id";
?>