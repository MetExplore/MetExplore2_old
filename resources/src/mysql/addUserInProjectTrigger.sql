CREATE TRIGGER `add_userInProject` AFTER INSERT ON `UserInProject`
 FOR EACH ROW BEGIN

INSERT INTO UserBioSource (idUser, idBioSource, Acces) 
SELECT NEW.idUser, BioSourceInProject.idBioSource, NEW.idAccess FROM BioSourceInProject WHERE idProject = NEW.idProject
ON DUPLICATE KEY UPDATE Acces = NEW.idAccess;
END