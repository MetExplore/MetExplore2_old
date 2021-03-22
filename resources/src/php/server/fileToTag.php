<?php
//require_once("../config/server_variables.php");
// error_log($_POST['functionParam']);
$functionParam= json_decode($_POST['functionParam'], $assoc=true);
$tagVs= $functionParam['tagVs'];
$files= $functionParam['files'];
// error_log($tagVs);
//error_log($files);
// extract ( $functionParam, EXTR_OVERWRITE );

// $Mailsubject="[MetExplore Error] Error on Tag directory Creation";
// //$messageBody="The MetExplore Administrator $Admin tried to create the tag $tagVs, but an error occured.\nPlease check the Application\n\nThis is an automatic e-mail, do not reply.";

$response["success"] = true;
$response["message"]="You will receive an email when the copy is complete.";

// $outputTag;

// echo json_encode($response);
$cmd="sudo ".SHELLSCRIPT_DIR."filetotag.sh $tagVs $files  > /dev/null & ";
// error_log($cmd);
/*
$max = sizeof($files);

for ($i=0 ; $i<$max ; $i++) {
	$name= $files[$i];
	//error_log($name);
	$cmd="svn delete https://svn.code.sf.net/p/metexplore/code/tags/".$tagVs."/".$name." -m trunk_to_tag";
	//error_log($cmd);
	$res = exec($cmd, $outputTag);
	//error_log($outputTag);
	//$output=array();
	$cmd="svn cp https://svn.code.sf.net/p/metexplore/code/trunk/".$name." https://svn.code.sf.net/p/metexplore/code/tags/".$tagVs."/".$name." -m trunk_to_tag";	
	//$cmd="sudo ".SHELLSCRIPT_DIR."filetotag.sh $name $tagVs > /dev/null & ";
	//error_log($cmd);
	$res = exec($cmd, $outputTag);
}
*/
// if($outputTag!=0){

	// $response["success"] = true;

	// $Mailsubject="[MetExplore] Copy files in tag";

	// $messageBody="\nThe MetExplore Administrator $Admin has copy files in the SVN repository.\nTag number: v$tagVs\n\nThis is an automatic e-mail, do not reply.";
// }
// $cmd=JAVA_BIN."java -cp ".METEXPLOREJAVA_DIR."/metExploreJava.jar utils.SenMail -subject \"$Mailsubject\" -body \"$messageBody\" ";

// $output;
// $res = exec($cmd, $output);

// $output;
// if (!$output){
	// error_log("File Copy: mail not sent");
// }


?>
