<?php
$DEL_BioSource_id="DELETE FROM BioSource WHERE  BioSource.id = $P_id";
$DEL_Catalyses="DELETE FROM Catalyses WHERE  Catalyses.idReactionInBioSource = $P_idReactionInBioSource AND Catalyses.idEnzymeInBioSource = $P_idEnzymeInBioSource";
$DEL_CompartInBioSource="DELETE FROM CompartmentInBioSource WHERE  CompartmentInBioSource.idCompartmentInBioSource = $P_idCompartInBioSource";
$DEL_Enzym_id="DELETE FROM Enzyme WHERE  Enzyme.id = $P_id";
$DEL_GeneCodesForProtein="DELETE FROM GeneCodesForProtein WHERE  GeneCodesForProtein.idGeneInBioSource = $P_idGeneInBioSource AND GeneCodesForProtein.idProteinInBioSource = $P_idProteinInBioSource";
$DEL_Gene_id="DELETE FROM Gene WHERE  Gene.id = $P_id";
$DEL_LeftParticipant="DELETE FROM LeftParticipant WHERE  LeftParticipant.idReaction = $P_idReaction AND LeftParticipant.idMetabolite = $P_idMetabolite";
$DEL_MetaboliteInBioSource="DELETE FROM MetaboliteInBioSource WHERE  MetaboliteInBioSource.idBioSource = $P_idBioSource AND MetaboliteInBioSource.idMetabolite = $P_idMetabolite";
$DEL_MetaboliteInCompart="DELETE FROM MetaboliteInCompartment WHERE  MetaboliteInCompartment.idMetabolite = $P_idMetabolite AND MetaboliteInCompartment.idCompartmentInBioSource = $P_idCompInBioSource";
$DEL_Metabolite_id="DELETE FROM Metabolite WHERE  Metabolite.id = $P_id";
$DEL_Pathway_id="DELETE FROM Pathway WHERE  Pathway.id = $P_id";
$DEL_ProteinInEnzyme="DELETE FROM ProteinInEnzyme WHERE  ProteinInEnzyme.idProteinInBioSource = $P_idProteinInBioSource AND ProteinInEnzyme.idEnzymeInBioSource = $P_idEnzymeInBioSource";
$DEL_Protein_id="DELETE FROM Protein WHERE  Protein.id = $P_id";
$DEL_ReactionInBioSOurce="DELETE FROM ReactionInBioSource WHERE  ReactionInBioSource.idReaction IN ($P_lstIdReaction) AND ReactionInBioSource.idBioSource = $P_idBioSource";
$DEL_ReactionInCompart="DELETE FROM ReactionInCompartment WHERE  ReactionInCompartment.idReaction = $P_idReaction AND ReactionInCompartment.idCompartmentInBioSource = $P_idCompInBioSource AND ReactionInCompartment.idUser = $P_idUser";
$DEL_ReactionInPathway="DELETE FROM ReactionInPathway WHERE  ReactionInPathway.idPathway = $P_idPathway AND ReactionInPathway.idReactionBioSource = $P_idReactionBioSource";
$DEL_Reaction_id="DELETE FROM Reaction WHERE  Reaction.id = $P_id";
$DEL_RightParticipant="DELETE FROM RightParticipant WHERE  RightParticipant.idReaction = $P_idReaction AND RightParticipant.idMetabolite = $P_idMetabolite";
$DEL_UserAnnot="DELETE FROM userannot WHERE  userannot.id = $P_idUserAnnot";
$DEL_UserBioSource="DELETE FROM UserBioSource WHERE  UserBioSource.idUser = $P_idUser AND UserBioSource.idBioSource = $P_idBioSource";
$DEL_UserBioSource_id="DELETE FROM UserBioSource WHERE  UserBioSource.id = $P_id";
$DEL_UserBioSource_idBioSource="DELETE FROM UserBioSource WHERE  UserBioSource.idBioSource = $P_idBioSource";
?>