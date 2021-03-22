CREATE TRIGGER `add_biosourceInProject` AFTER INSERT ON `BioSourceInProject`
 FOR EACH ROW BEGIN

INSERT INTO UserBioSource (idUser, idBioSource, Acces) 
SELECT UserInProject.idUser, NEW.idBioSource, UserInProject.idAccess FROM UserInProject WHERE idProject = NEW.idProject
ON DUPLICATE KEY UPDATE Acces = UserInProject.idAccess;
END