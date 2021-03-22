<?php 

require_once('../config/server_variables.php');

$functionParam= json_decode($_POST['functionParam'], $assoc=true);

extract ( $functionParam, EXTR_OVERWRITE );

require_once '../user/userFunctions.php';

$currentUser=getIdUser();

if(getBioSourceRights($currentUser, $idBiosource, $link) == "denied"){
	echo '{"success":false}';
	return;
}

if ($status=="Private"){
	if ($oldStatus=="Private"){
		$cmd = JAVA_BIN."java -cp ".METEXPLOREJAVA_DIR."/metExploreJava.jar metexplore.gui.Admin.ChangeBioSourceStatus -idBioSource $bioSourceId -idUser $newuser ";
	}
	else{
		$cmd = JAVA_BIN."java -cp ".METEXPLOREJAVA_DIR."/metExploreJava.jar fr.inrae.toulouse.metexplore.metexplorejava.apps.gui.Admin.CopyBioSource -idBioSource $bioSourceId -idUser $newuser ";
	}
}
elseif ($status=="Public" && $oldStatus=="Private"){
	$cmd = JAVA_BIN."java -cp ".METEXPLOREJAVA_DIR."/metExploreJava.jar metexplore.gui.Admin.ChangeBioSourceStatus -idBioSource $bioSourceId";
}

// error_log($cmd);

$output = array();

$status = 1;

$cmd .= " > /dev/null &";

$res = exec($cmd, $output);

print "{\"success\":\"true\", \"message\":\"You will receive an email on the metexplore e-mail when the process will be finished\"}";

?>
