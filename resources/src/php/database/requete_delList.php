<?php

// Del list of Id

$DEL_ListCompartInBioSource="DELETE FROM CompartmentInBioSource WHERE  CompartmentInBioSource.idCompartmentInBioSource IN ($P_idList)";
$DEL_ListPathway_id="DELETE FROM Pathway WHERE  Pathway.id IN ($P_idList)";
$DEL_ListReaction_id="DELETE FROM Reaction WHERE  Reaction.id IN ($P_idList)";
$DEL_ListMetabolite_id="DELETE FROM Metabolite WHERE  Metabolite.id IN ($P_idList)";
$DEL_ListEnzyme_id="DELETE FROM Enzyme WHERE  Enzyme.id IN ($P_idList)";
$DEL_ListProtein_id="DELETE FROM Protein WHERE  Protein.id IN ($P_idList)";
$DEL_ListGene_id="DELETE FROM Gene WHERE  Gene.id IN ($P_idList)";

?>
