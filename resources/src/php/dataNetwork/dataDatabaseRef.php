<?php

$sqlDB = "SELECT DatabaseRef.id AS id, DatabaseRef.type AS type, DatabaseRef.url AS url, DatabaseRef.name AS name"
		." FROM DatabaseRef, BioSource"
		." WHERE BioSource.id = $P_idBioSource"
		." AND DatabaseRef.id = BioSource.idDB";
$resultDB=mysqli_query($link,$sqlDB) or die('{success: false, message: "error while retrieving database url"}');
$rowDB=mysqli_fetch_object($resultDB);

?>