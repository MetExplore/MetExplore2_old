<?php
extract ( $_POST, EXTR_OVERWRITE );

$response ["success"] = false;

if (! isset ( $jsonIn ) && ! isset ( $svgIn )) {
	//error_log ( "Lacks inputs arg" );
	$response ["message"] = "Problem in loading the application";
	die ( json_encode ( $response ) );
}

$cmd = JAVA_BIN."java -cp " . METEXPLOREJAVA_DIR . "/metExploreJava.jar metexplore.XgmmlExporter -svg ".escapeshellarg($svgIn)." -json ".escapeshellarg($jsonIn);
$cmd .= " 2> /dev/null";

$output = array ();
$status = 1;
$res = exec ( $cmd, $output, $status);

if($status == 0){
	$response ["success"] = true;
	$response ["message"] = $output[0];
}else{
	die ( json_encode ( $response ) );
}

$xgmml = "";
for($i = 0; $i < count ( $output ); $i ++) {
	$xgmml = $xgmml . $output [$i];
}

$response["xgmml"] = $xgmml;
echo(json_encode ( $response ));

?>
