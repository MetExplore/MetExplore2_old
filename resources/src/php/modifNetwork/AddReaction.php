<?php
require_once("../database/connection.php");
require_once("../LogBioSourceUpdate.php");
require_once ("../userAndProject/addHistoryItem.php");

$functionParam= json_decode($_POST['functionParam'], $assoc=true);

//error_log("functionParam");
//error_log( print_R($functionParam,TRUE) );

extract ( $functionParam, EXTR_OVERWRITE );

require_once '../user/userFunctions.php';

$currentUser=getIdUser();

if(getBioSourceRights($currentUser, $idBiosource, $link) == "denied"){
	echo '{"success":false}';
	return;
}

/////////////////////////////////////////////
//	ADD Reaction in database 
/////////////////////////////////////////////

$name=mysqli_real_escape_string ( $link , $name );
$generic=mysqli_real_escape_string ( $link , $generic );
$EC=mysqli_real_escape_string ( $link , $EC );
$idDB=mysqli_real_escape_string ( $link , $idDB );
$dbIdentifier=mysqli_real_escape_string ( $link , $dbIdentifier );
$go=mysqli_real_escape_string ( $link , $go );
$goName=mysqli_real_escape_string ( $link , $goName );

// Check if the dbIdentifier already exists

$sqlCheck = "SELECT r.dbIdentifier ".
			"FROM Reaction r INNER JOIN ReactionInBioSource rib ON r.id=rib.idReaction ".
			"WHERE r.dbIdentifier='$dbIdentifier' AND rib.idBioSource='$idBiosource'";

$res=mysqli_query($link, $sqlCheck) or die('{success: "false", message: "Error in Mysql Query: '.mysqli_error ($link).'"}');

$num_result = $res->num_rows;

if($num_result > 0)
{
	die('{success: "false", message: "Reaction can\'t be added. Reaction with same id already exists."}');
} 



$sqlReaction="INSERT INTO Reaction (name, generic, type, ec, idDB, dbIdentifier, go, goName) VALUES ('$name', '$generic', 'small', '$EC', '$idDB', '$dbIdentifier', '$go', '$goName');";

$num_result=mysqli_query($link, $sqlReaction) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
$idReaction= mysqli_insert_id($link);

		AddSQLtoBioSourceLog($idBiosource,$sqlReaction,$iduser);

/////////////////////////////////////////////
// ADD Reaction in Biosource
/////////////////////////////////////////////

$idReaction=mysqli_real_escape_string ( $link , $idReaction );
$idBiosource=mysqli_real_escape_string ( $link , $idBiosource );
$reversible=mysqli_real_escape_string ( $link , $reversible );
$hole=mysqli_real_escape_string ( $link , $hole );
$ubound=mysqli_real_escape_string ( $link , $ubound );
$lbound=mysqli_real_escape_string ( $link , $lbound );
$fast=mysqli_real_escape_string ( $link , $fast );
//$klaw=mysqli_real_escape_string ( $link , $klaw );

$sqlReactionInBioSource="INSERT INTO ReactionInBioSource (idReaction, idBioSource, reversible, hole, upperBound, lowerBound, fast) VALUES ('$idReaction', '$idBiosource','$reversible', '$hole', '$ubound', '$lbound', '$fast')";

$num_result=mysqli_query($link, $sqlReactionInBioSource) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
$idReactionInBioSource= mysqli_insert_id($link);

		$action = array(
			"action" => "add reaction form",
			"dbIdentifier" => $dbIdentifier,
			"data" => $functionParam,
			"idReaction" => $idReaction
		);

		AddSQLtoBioSourceLog($idBiosource,$sqlReactionInBioSource,$iduser, $action, $link);

/////////////////////////////////////////////
//	ADD LParticipant of the reaction (if any)
/////////////////////////////////////////////

if (count($Substrate) > 0) {

	$sqlLPart="INSERT INTO LeftParticipant (idReaction, idMetabolite, coeff,  side) VALUES";
	
	$lMetabolites = array();
	
	foreach ($Substrate as $lpart){
		
		$idMetabolite=mysqli_real_escape_string ( $link ,$lpart["idMetabolite"]);
		$coeff=mysqli_real_escape_string ( $link ,$lpart["coeff"]);
		//$cofactor=mysqli_real_escape_string ( $link ,$lpart["cofactor"]);
		$side=mysqli_real_escape_string ( $link ,$lpart["side"]);
		//$constantCoeff=mysqli_real_escape_string ( $link ,$lpart["constantCoeff"]);
	
		$sqlLPart.=" ('$idReaction', '$idMetabolite',  '$coeff', '$side'),";
		
		$lMetabolites[$idMetabolite] = $lpart;
	}
	$sqlLPart=substr($sqlLPart,0, strlen($sqlLPart)-1);
	
	//error_log($sqlLPart);
	$num_result=mysqli_query($link, $sqlLPart) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
	
			AddSQLtoBioSourceLog($idBiosource,$sqlLPart,$iduser);
}

/////////////////////////////////////////////
//	ADD RParticipant of the reaction (if any)
/////////////////////////////////////////////

if (count($Product) > 0) {

	$sqlRPart="INSERT INTO RightParticipant (idReaction, idMetabolite, coeff, side) VALUES";
	
	$rMetabolites = array();
	
	foreach ($Product as $rpart){
	
		$idMetabolite=mysqli_real_escape_string ( $link ,$rpart["idMetabolite"]);
		$coeff=mysqli_real_escape_string ( $link ,$rpart["coeff"]);
		//$cofactor=mysqli_real_escape_string ( $link ,$rpart["cofactor"]);
		$side=mysqli_real_escape_string ( $link ,$rpart["side"]);
		//$constantCoeff=mysqli_real_escape_string ( $link ,$rpart["constantCoeff"]);
	
		$sqlRPart.=" ('$idReaction', '$idMetabolite',  '$coeff', '$side'),";
		
		$rMetabolites[$idMetabolite] = $rpart;
	}
	$sqlRPart=substr($sqlRPart,0, strlen($sqlRPart)-1);
	
	$num_result=mysqli_query($link, $sqlRPart) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
	
			AddSQLtoBioSourceLog($idBiosource,$sqlRPart,$iduser);
}

//Add metabolites to history:
if (count($lMetabolites) > 0 || count($rMetabolites) > 0) {
	$action = array(
		"action" => "add metabolites to reaction",
		"idReaction" => $idReaction,
		"dbIdentifier" => $dbIdentifier,
		"lMetabolites" => $lMetabolites,
		"rMetabolites" => $rMetabolites
	);
	addHistoryItem($idBiosource, $iduser, $action, $link);
}
		
/////////////////////////////////////////////
// ADD Reaction to Pathway (if defined)
/////////////////////////////////////////////
$idReactionInBioSource=mysqli_real_escape_string ( $link , $idReactionInBioSource );
if ($pathway != ""){

	

	$pathwayList = array();
	
	$sqlReactionInPathway="INSERT INTO ReactionInPathway (idPathway, idReactionBioSource) VALUES";
	foreach ($pathway as $path){

		$pathc=mysqli_real_escape_string ( $link , $path );

		$sqlReactionInPathway.=" ('$pathc', '$idReactionInBioSource'),";
		array_push($pathwayList, $pathc);
	}
	$sqlReactionInPathway=substr($sqlReactionInPathway,0, strlen($sqlReactionInPathway)-1);
	$num_result=mysqli_query($link, $sqlReactionInPathway) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
	
	$action = array(
			"action" => "add reaction to pathways",
			"dbIdentifier" => $dbIdentifier,
			"pathways" => $pathwayList,
			"idReaction" => $idReaction
	);
	
			AddSQLtoBioSourceLog($idBiosource,$sqlReactionInPathway,$iduser, $action, $link);
}

/////////////////////////////////////////////
// ADD Enzyme to Reaction (if defined)
/////////////////////////////////////////////
if ($enzymes != ""){
	$sqlEnzymeCatalyses="INSERT INTO Catalyses (idReactionInBioSource, idEnzymeInBioSource) VALUES";
	
	$enzymesList = array();
	
	foreach ($enzymes as $enz){
		$enzc=mysqli_real_escape_string ( $link , $enz );

		$sqlEnzymeCatalyses.=" ('$idReactionInBioSource', '$enzc'),";
		array_push($enzymesList, $enzc);
	}
	$sqlEnzymeCatalyses=substr($sqlEnzymeCatalyses,0, strlen($sqlEnzymeCatalyses)-1);
	$num_result=mysqli_query($link, $sqlEnzymeCatalyses) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
	
	$action = array(
		"action" => "add enzymes to reaction",
		"dbIdentifier" => $dbIdentifier,
		"enzymes" => $enzymesList,
		"idReaction" => $idReaction
	);
	
			AddSQLtoBioSourceLog($idBiosource,$sqlEnzymeCatalyses,$iduser, $action, $link);
}


/////////////////////////////////////////////
// ADD Reaction Status (if defined)
/////////////////////////////////////////////

if ($idstatus != ""){

	$idstatus=mysqli_real_escape_string ( $link , $idstatus );

	$sqlReactionStatus="INSERT INTO ReactionHasStatus (idReaction, idStatus) VALUES ('$idReaction', '$idstatus')";
	
	$num_result=mysqli_query($link, $sqlReactionStatus) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
	
			AddSQLtoBioSourceLog($idBiosource,$sqlReactionStatus,$iduser);
}

/////////////////////////////////////////////
// ADD Reaction Biblio (if defined)
/////////////////////////////////////////////
$BiblioIds=array();

foreach ($Biblio as $ref){


	$PMID=$ref["pubmedid"];
	$title=$ref["title"];
	$authors=$ref["authors"];
	$Journal=$ref["Journal"];
	$Year=$ref["Year"];
	
	$shortRef="";

	$authorsList=explode (',', $authors);
	if (count($authorsList)>1){
		$shortRef=$authorsList[0]." et al., ".$Year;
	}else{
		$shortRef=$authorsList[0].", ".$Year;
	}

	$PMID=mysqli_real_escape_string ( $link , $PMID );
	$title=mysqli_real_escape_string ( $link , $title );
	$authors=mysqli_real_escape_string ( $link , $authors );
	$Journal=mysqli_real_escape_string ( $link , $Journal );
	$Year=mysqli_real_escape_string ( $link , $Year );
	$shortRef=mysqli_real_escape_string ( $link , $shortRef );
	
	$sqlReactionBiblio="INSERT INTO Biblio (pubmedid,title,authors,Journal,Year,ShortRef) VALUES ('$PMID', '$title', '$authors', '$Journal', '$Year','$shortRef')";
	$num_result=mysqli_query($link, $sqlReactionBiblio) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
	array_push($BiblioIds,mysqli_insert_id($link));
	
			AddSQLtoBioSourceLog($idBiosource,$sqlReactionBiblio,$iduser);
}

if (sizeof($BiblioIds) > 0) {

	$sqlReactionHasRef="INSERT INTO ReactionHasReference (idReaction,idBiblio) VALUES";

	foreach ($BiblioIds as $id){

		$idc=mysqli_real_escape_string ( $link , $id );

		$sqlReactionHasRef.=" ($idReaction,$idc),";
	}
	$sqlReactionHasRef=substr($sqlReactionHasRef,0, strlen($sqlReactionHasRef)-1);
	
	
	$num_result=mysqli_query($link, $sqlReactionHasRef) or die('{success: false, message: "Error in Mysql Query: '.mysqli_error ($link).'"}');
	
	AddSQLtoBioSourceLog($idBiosource,$sqlReactionHasRef,$iduser);

}
echo "{\"success\":\"true\"}";

?>
