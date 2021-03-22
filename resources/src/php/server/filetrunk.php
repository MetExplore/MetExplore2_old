<?php
require_once("../config/server_variables.php");
$dir=$_GET['dir'];
$response["success"] = false;


/**
mettre a la main fichier index.html & app.js
*/
$results=array();
if ($dir == '/') {
	$res=array();
	$res["nameFile"]='index.html';
	$res["nameFolder"]='';
	array_push($results, $res);
	$res["nameFile"]='app.js';
	$res["nameFolder"]='';
	array_push($results, $res);
} else if ($dir == 'php') {
			$cmd="svn list --recursive https://svn.code.sf.net/p/metexplore/code/trunk/resources/src/php/";
			$output=array();
			$do = exec($cmd, $output);

			foreach ($output as $dirfile){
				$dirfile= '/'.$dirfile;
				$pos= strrpos($dirfile, '/');
				$file = substr($dirfile, $pos);
				if ($file != '/') {	
					$sousdir = substr($dirfile, 0, $pos+1);
					$res["nameFile"]= substr($file, 1);
					$res["nameFolder"]="resources/src/php/".$sousdir;
					array_push($results, $res);
				}
			}	
		} else
		{
			$cmd="svn list --recursive https://svn.code.sf.net/p/metexplore/code/trunk/src/app/".$dir;
			$output=array();
			$do = exec($cmd, $output);

			foreach ($output as $dirfile){
				$dirfile= '/'.$dirfile;
				$pos= strrpos($dirfile, '/');
				$file = substr($dirfile, $pos);
				if ($file != '/') {	
					$sousdir = substr($dirfile, 0, $pos+1);
					$res["nameFile"]= substr($file, 1);
					$res["nameFolder"]="src/app/".$dir.$sousdir;		
					array_push($results, $res);
				}
			}
		}
/*
pour test en local*
$res["nameFile"]='C_dataBiosource.js';
$res["nameFolder"]='src/app/controller/windowInfo/';
array_push($results, $res);
$res["nameFile"]='C_panelVotes.js';
$res["nameFolder"]='src/app/controller/windowInfo/';
array_push($results, $res);
$res["nameFile"]='C_DetailsAttachment.js';
$res["nameFolder"]='src/app/controller/comments/';
array_push($results, $res);
$res["nameFile"]='C_updateBioSource.js';
$res["nameFolder"]='src/app/controller/';
array_push($results, $res);
*
//recuperer tous les fichiers du dossier app


//recuperer tous les fichiers du dossier php
$cmd="svn list --recursive https://svn.code.sf.net/p/metexplore/code/trunk/src/php";
$output=array();
$do = exec($cmd, $output);

foreach ($output as $dirfile){
	$pos= strrpos($dirfile, '/');
	$file = substr($dirfile, $pos);
	
	if ($file != '/') {
	
		$dir = substr($dirfile, 0,$pos+1);
		$res["nameFile"]= substr($file, 1);
		$res["nameFolder"]="resources/src/php/".$dir;
		
		array_push($results, $res);
	}

}*/


$response["success"] = true;
$response["results"] = $results;

echo json_encode($response);

?>
