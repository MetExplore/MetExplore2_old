<?php

session_start();

require_once ("../database/connection.php");
require_once ('../config/server_variables.php');

require_once '../user/userFunctions.php';

$currentUser=getIdUser();

if(getBioSourceRights($currentUser, $idBiosource, $link) == "denied"){
	echo '{"success":false}';
	return;
}

#######
# Get Form values
#######

$params= json_decode($_POST['formVal'], $assoc=true);
extract ( $params, EXTR_OVERWRITE );

#checks if user is still connected
if(checkUserId($idUser)){
	
	#get the actual annotation data 
	$datas= json_decode($_POST['formData'], $assoc=true);
	extract ( $datas, EXTR_OVERWRITE );

	########
	# Save Annotation File on server
	########

	$md5=getUsermd5($idUser, $link);

	$date =date( 'Ymd_His');
	$directory=USERFILES_DIR."$md5/curationFiles/$idBioSource/";

	if(!file_exists($directory)){
		mkdir($directory, 0777, true);
	}

	$filename=$directory.$entry."File_".$date.".tsv";

	$handle = fopen($filename, "a"); //write only mode but pointer at the end of file

	$headers=implode("\t", $conf);
	fwrite($handle, $headers."\n");

	foreach($data as $records){

		$lineData=implode("\t", $records);
		fwrite($handle, $lineData."\n");

	}
	fclose($handle);


	#########
	# Launch Java app
	#########

	$cmd = JAVA_BIN."java -cp " . METEXPLOREJAVA_DIR . "/metExploreJava.jar metexplore.AnnotateMetExploreNetwork -printJson";

	$cmd .= " 2> /dev/null";

	$output = array ();

	$status = 1;

	$res = exec ( $cmd, $output );

	$jsonStr = "";

	for($i = 0; $i < count ( $output ); $i ++) {
		$jsonStr = $jsonStr . $output [$i];
	}

	$json = json_decode ( $jsonStr, true );

	$sendMail = false;
	if ($json ["send_mail"] == "true") {
		$sendMail = true;
	}
	# Java command with the MetExploreGuiFunction arguments
	$cmd = JAVA_BIN."java -cp ". METEXPLOREJAVA_DIR . "/metExploreJava.jar metexplore.AnnotateMetExploreNetwork -host \"$host\" -database \"$base\" -userMysql \"$userMySql\" -passwd \"$pwd\" -logPath " . DATALOG_DIR . " -tmpPath " . TMP_DIR . " -urlTmpPath " . TMP_URL;

	# Arguments for AnnotateMetExploreNetwork
	$cmd=$cmd." -idBiosource \"$idBioSource\" -idUser \"$idUser\" -mail \"$mail\"";

	# Arguments for annotationFileToBionetwork
	$cmd=$cmd." -tabfile \"$filename\"";

	if ($textSep=='"') {
		$cmd=$cmd." -textsep '$textSep'";
	}else{
		$cmd=$cmd." -textsep \"$textSep\"";
	}

	$cmd=$cmd." -irrRxn \"$irrReaction\" -revRxn \"$revReaction\" -pathwaySep \"$pathwaySep\" -pListSt \"$pListSt\" -pListEnd \"$pListEnd\"";

	if ($gprLogic){
		$cmd=$cmd." -gprLogic";
	}
	$cmd=$cmd." -gprStart \"$gprSt\" -gprEnd \"$gprEnd\" -entry \"$entry\"";

	if($hasCompart){
		$defaultComp="";
	}else{
		$cmd=$cmd." -noComp";
	}

	$cmd=$cmd." -defCompId \"$defaultComp\" -stCompart \"$stCompart\" -endCompart \"$endCompart\"";

	if($palsson){
		$cmd=$cmd." -usePalssonIds";
	}

	# Arguments for BionetworkUnion
	$cmd=$cmd." -mergetype \"$mergeRule\" -rxnMatch \"$rxnMatch\" -metMatch \"$metMatch\"";
	if ($suffix){
		$cmd=$cmd." -suffix \"$suffix\"";
	}
	if ($manual){
		$cmd=$cmd." -manual";
	}
	


	// error_log($cmd);

	$output = array ();
	$cmd .= " > /dev/null &";
	$res = exec ( $cmd, $output );

	print "{\"success\":\"true\", \"message\":\"You will receive an email when your annotation is finished\"}"; 

}else{
	print "{\"success\":\"false\", \"message\":\"Session expired. Please log back in to finish your annotation.\"}"; 
}
?>