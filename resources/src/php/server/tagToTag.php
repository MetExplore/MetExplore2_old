<?php
require_once("../config/server_variables.php");

$functionParam= json_decode($_POST['functionParam'], $assoc=true);

extract ( $functionParam, EXTR_OVERWRITE );

$Mailsubject="[MetExplore Error] Error on Tag directory Creation";
$messageBody="The MetExplore Administrator $Admin tried to create the tag $newVs, but an error occured.\nPlease check the Application\n\nThis is an automatic e-mail, do not reply.";

$response["success"] = true;
$response["message"]="You will receive an email when the tag creation is complete.";

$outputTag;

echo json_encode($response);

$cmd="sudo ".SHELLSCRIPT_DIR."tagtotag.sh $tagVs $newVs  > /dev/null & ";
// error_log($cmd);

$res = exec($cmd, $outputTag);

if($outputTag!=0){

	$response["success"] = true;

	$Mailsubject="[MetExplore] New Tag directory";

	$messageBody="\nThe MetExplore Administrator $Admin has created a new tag directory in the SVN repository.\nTag number: v$newVs\n\nThis is an automatic e-mail, do not reply.";
}
$cmd=JAVA_BIN."java -cp ".METEXPLOREJAVA_DIR."/metExploreJava.jar utils.SenMail -subject \"$Mailsubject\" -body \"$messageBody\" ";

$output;
$res = exec($cmd, $output);

$output;
if (!$output){
	//error_log("Tag Creation: mail not sent");
}


?>
