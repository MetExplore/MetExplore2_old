BEGIN

UPDATE UserBioSource 
SET Acces=NEW.idAccess 
WHERE idUser = NEW.idUser
AND idBioSource IN (SELECT idBioSource FROM BioSourceInProject WHERE idProject=New.idProject);
END