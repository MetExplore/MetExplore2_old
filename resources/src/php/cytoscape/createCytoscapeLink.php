<?php
require_once ("../utils/file_functions.php");
require_once ("../config/server_variables.php");

// Creates the jnlp file and the attributes files needed to launch a Cytoscape Web start session

extract ( $_POST, EXTR_OVERWRITE );

$response ["success"] = false;

//error_log("sif path : $sif_path");

if (! isset ( $sif_path )) {
	$response ["message"] = "Lacks the sif_path argument";
	die ( json_encode ( $response ) );
}

if (! file_exists ( $sif_path )) {
	$response ["message"] = "The sif_path is not a valid path";
	die ( json_encode ( $response ) );
}

if (! isset ( $json_attribute_file )) {
	$response ["message"] = "Lacks the json_attribute_file argument";
	die ( json_encode ( $response ) );
}

if (! file_exists ( $sif_path )) {
	$response ["message"] = "The json_attribute_file is not a valid path";
	die ( json_encode ( $response ) );
}

// Jnlp file template
$base_jnlp = WEB_DIR . "/resources/cytoscape/data/cybase.jnlp";

// error_log ( $base_jnlp );

$domCy = new DomDocument ();

$domCy->preserveWhiteSpace = false;

$domCy->load ( $base_jnlp );

$domCy->formatOutput = true;

$jnlp = $domCy->getElementsByTagName ( 'jnlp' )->item ( 0 );

$cytmp = createRandomFileName ( TMP_DIR, "cy", "jnlp" );

$jnlp->setAttribute ( 'href', TMP_URL . basename ( $cytmp ) );
$jnlp->setAttribute ( 'codebase', BASE_URL . "/resources/cytoscape/code" );

$appli = $domCy->getElementsByTagName ( 'application-desc' )->item ( 0 );

$elt = $domCy->createElement ( "argument", "-V" );
$appli->appendChild ( $elt );
$elt = $domCy->createElement ( "argument", BASE_URL . "/resources/cytoscape/data/visu.props" );
$appli->appendChild ( $elt );

$elt = $domCy->createElement ( "argument", "-N" );
$appli->appendChild ( $elt );
$elt = $domCy->createElement ( "argument", TMP_URL . "/" . basename ( $sif_path ) );
// $elt = $domCy->createElement("argument", "147.99.104.233/symbiocyc/Data/BioCyc/BioCyc12.5/WithClasses/BUCAIREVISED/allCpdsMetabSmmReactionsCompounds.sif");
$appli->appendChild ( $elt );

// Reads the attribute_json_file, creates each attribute file and fills the jnlp file

$json_str = file_get_contents ( $json_attribute_file );

$json_obj = json_decode ( $json_str );

if ($json_obj == null) {
	$response ["message"] = "attribute json file badly formatted";
	die ( json_encode ( $response ) );
}

$attributes = $json_obj;

foreach ( $attributes as $attribute ) {
	
	$attribute_name = $attribute->{"name"};
	
	$attribute_type = $attribute->{"type"};
	
	// Create the attribute file
	$attribute_file_name = createRandomFileName ( TMP_DIR, str_replace ( " ", "_", $attribute_name ), "attr" );
	
	$elt = $domCy->createElement ( "argument", "-n" );
	$appli->appendChild ( $elt );
	$elt = $domCy->createElement ( "argument", TMP_URL . "/" . basename ( $attribute_file_name ) );
	$appli->appendChild ( $elt );
	
	$fh = fopen ( $attribute_file_name, 'w' ) or die ( json_encode ( $response ) );
	
	fwrite ( $fh, $attribute_name . " (class=" . $attribute_type . ")\n" );
	
	$values = $attribute->{"key_values"};
	
	foreach ( $values as $pair ) {
		
		$id = $pair->{"id"};
		
		$value = $pair->{"value"};
		
		// replace the " = " by _
		$value = str_replace ( " = ", "_", $value );
				
		// replace all the html tags
		$value = strip_tags(htmlspecialchars_decode(html_entity_decode  ( $value ), ENT_QUOTES));
		
		if(! substr($value, 0, 1) == "("  && strlen($value) > 100) {
			$value = substr_replace($value, "[...]", 100);
		}

		fwrite ( $fh, $id . " = " . $value . "\n" );
	}
	
	fclose ( $fh );
}

$domCy->save ( $cytmp );

$response ["success"] = true;
$response ["url"] = TMP_URL . "/" . basename ( $cytmp );

print (json_encode ( $response )) ;

?>