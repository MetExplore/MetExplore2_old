<?php
require_once("../config/server_variables.php");

$functionParam= json_decode($_POST['functionParam'], $assoc=true);
extract ( $functionParam, EXTR_OVERWRITE );


$Mailsubject="[MetExplore] Update of Metexplore Test version";

$response["success"] = true;
$response["message"]="You will receive an email when the update of the Test version is complete.";

echo json_encode($response);


$outUpdate;
$cmd="sudo ".SHELLSCRIPT_DIR."upMTest.sh  > /dev/null &";
$res = exec($cmd, $outUpdate);

if($outUpdate!=0){

	$ShortResult;
	$ShortResult['Added']=0;
	$ShortResult['Deleted']=0;
	$ShortResult['Updated']=0;
	$ShortResult['Conflict']=0;
	$ShortResult['Merged']=0;
	$ShortResult['Existed']=0;
	$ShortResult['Replaced']=0;
		
	foreach($outUpdate as $string){
	
// 	error_log($string);
/*
		$ShortResult['Added']+=substr_count ( $string , "A");
		$ShortResult['Deleted']+=substr_count ( $string , "D");
		$ShortResult['Updated']+=substr_count ( $string , "U");
		$ShortResult['Conflict']+=substr_count ( $string , "C");
		$ShortResult['Merged']+=substr_count ( $string , "G");
		$ShortResult['Existed']+=substr_count ( $string , "E");
		$ShortResult['Replaced']+=substr_count ( $string , "R");*/
	}

	$messageBody="\nThe MetExplore Administrator $Admin has updated the MetExploreTest on our server.";

	$array=array_keys ($ShortResult);
/*
	foreach($array as $key){
		$number=$ShortResult["$key"];
		$messageBody.="$key : $number \n";
	}
*/	
	$response["success"] = true;

}else{
	$Mailsubject="[MetExplore Error] Error on Update of Metexplore Test";
	$messageBody="The MetExplore Administrator $Admin tried to update the MetExploreTest directory, but an error occured.\nPlease check the Application";
}



$cmd=JAVA_BIN."java -cp ".METEXPLOREJAVA_DIR."/metExploreJava.jar utils.SenMail -subject \"$Mailsubject\" -body \"$messageBody\" ";

$output;
$res = exec($cmd, $output);

if (!$output){
	//error_log("mail not sent");
}


?>
