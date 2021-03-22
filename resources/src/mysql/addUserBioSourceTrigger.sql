DELIMITER $$


CREATE TRIGGER `add_userBioSource` 
	BEFORE INSERT ON `UserBioSource`
		FOR EACH ROW
			BEGIN
				IF (NEW.Typ = '' AND New.Acces != '') THEN
					SET NEW.Typ = (SELECT status FROM Status WHERE idStatus = NEW.Acces);
				ELSEIF (NEW.Acces IN ('', 28) AND New.Typ != '') THEN
					SET NEW.Acces = (SELECT idStatus FROM Status WHERE status = New.Typ);
				END IF;
				
				SET @n = (SELECT COUNT(DISTINCT idProject) FROM BioSourceInProject WHERE idBioSource = NEW.idBioSource);

				IF (@n > 1) THEN
					IF ((SELECT DISTINCT UserInProject.idAccess FROM UserInProject, UserBioSource, BioSourceInProject WHERE UserBioSource.idBioSource = NEW.idBioSource AND UserInProject.idProject = BioSourceInProject.idProject AND BioSourceInProject.idBioSource = UserBioSource.idBioSource AND UserInProject.idUser = NEW.idUser) != NEW.Acces OR (SELECT FOUND_ROWS()) = 0) THEN
						SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: you cannot add a user to a BioSource that is in a project, with a different access.';
					END IF;
				END IF;
				IF (NEW.Typ = '' AND New.Acces != '') THEN
					SET NEW.Typ = (SELECT status FROM Status WHERE idStatus = NEW.Acces);
				ELSEIF (NEW.Acces IN ('', 27) AND New.Typ != '') THEN
					SET NEW.Acces = (SELECT idStatus FROM Status WHERE status = New.Typ);
				END IF;
			END;$$

DELIMITER ;