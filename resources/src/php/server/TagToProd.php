<?php
require_once("../config/server_variables.php");

$functionParam= json_decode($_POST['functionParam'], $assoc=true);

extract ( $functionParam, EXTR_OVERWRITE );

$Mailsubject="[MetExplore Error] Error on Production Version change";
$messageBody="The MetExplore Administrator $Admin tried to change the production with the tag $tagVs, but an error occured.\nPlease check the Application\n\nThis is an automatic e-mail, do not reply.";

$response["success"] = true;
$response["message"]="You will receive an email when the production version is updated with the tag $tagVs.\n\nThe Web site will be unavailable during the update process.";

echo json_encode($response);


$index = fopen("../../../index.html", "r+");

while( ($buffer = fgets($handle)) !== false){
	if (stristr($buffer,'<head>')===TRUE){
		fwrite($index, '<meta http-equiv="refresh" content="0; URL=http://http://metexplore.toulouse.inra.fr/metexplore2/indexMaintenance.html">\n');
		break 1;
	}
}
fclose($index);



$outputProd;

$cmd="sudo ".SHELLSCRIPT_DIR."tagToProd.sh $tagVs  > /dev/null & ";
// error_log($cmd);

$res = exec($cmd, $outputProd);

if($outputProd){

	$response["success"] = true;

	$Mailsubject="[MetExplore] Update of Metexplore production version";

	$messageBody="\nThe MetExplore Administrator $Admin has updated the production version with the tag directory $tagVs in the SVN repository.\n\nThis is an automatic e-mail, do not reply.";
}
$cmd=JAVA_BIN."java -cp ".METEXPLOREJAVA_DIR."/metExploreJava.jar utils.SenMail -subject \"$Mailsubject\" -body \"$messageBody\" ";

$output;
$res = exec($cmd, $output);

if (!$output){
	//error_log("mail not sent");
}


?>
