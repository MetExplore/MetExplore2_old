CREATE TRIGGER `delete_userBioSource` BEFORE DELETE ON `UserBioSource`
 FOR EACH ROW BEGIN

IF ((SELECT DISTINCT BioSourceInProject.idProject FROM BioSourceInProject, UserInProject WHERE idBioSource = OLD.idBioSource AND BioSourceInProject.idProject = UserInProject.idProject AND UserInProject.idUser = OLD.idUser) > 0)
THEN
SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: you cannot remove a user from a BioSource that is part of a project, if the user is in the project. Please remove user from corresponding project instead.';
END IF;
END