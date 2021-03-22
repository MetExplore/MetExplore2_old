<?php
require_once("../database/connection.php");
require_once ('../config/server_variables.php');


$date =date( 'Ymd-Hi');
$filename = DATALOG_DIR."/MetaboliteIdentifiers_$date.csv";

echo "{\"success\":\"true\", \"message\":\"You will receive an email on the metexplore e-mail when the process will be finished\"}";

$sql='SELECT Metabolite.name as Name, Metabolite.chemicalFormula as Formula, inchiTab.inchi as InChI, KEGGTab.KEGG as KEGG
FROM Metabolite
INNER JOIN (

SELECT MI1.`extID` AS inchi, MI1.`idMetabolite` AS idMetab1
FROM MetaboliteIdentifiers MI1
WHERE MI1.`extDBName` =  "inchi"
Group by MI1.`extID`
) AS inchiTab ON ( inchiTab.idMetab1 = Metabolite.id ) 
LEFT OUTER JOIN (

SELECT MI2.`idMetabolite` AS idMetab2, GROUP_CONCAT( MI2.`extID` ) AS KEGG
FROM MetaboliteIdentifiers MI2
WHERE MI2.`extDBName` 
IN (
 "KEGG",  "keggid",  "kegg.compound"
)
GROUP BY MI2.`idMetabolite`
) AS KEGGTab ON ( KEGGTab.idMetab2 = Metabolite.id ) ';


$result=mysqli_query ($link, $sql);

$Mailsubject="";
$messageBody="";

if(! $result) {

	$Mailsubject = "[MetExploreAdmin Error] Error on Identifier Extraction";
	$messageBody = "Impossible to get the list of the Identifiers! Error on SQL Query" ;
	
	
}else{




	$handle = fopen($filename, "a"); //write only mode but pointer at the end of file

	$headers="Name\tFormula\tInChI\tKEGG\n";
	fwrite($handle, $headers);

	while ($tab=mysql_fetch_assoc($result))
	{
		$data=$tab["Name"]."\t".$tab["Formula"]."\t".$tab["InChI"]."\t".$tab["KEGG"]."\n";
		fwrite($handle, $data);
	
	}
	fclose($handle);
	
	$Mailsubject = "[MetExploreAdmin] Identifier Extraction finished";
	$messageBody = "CSV file created and available on the virtual machine here: \n\n$filename" ;
	
}




$cmd=JAVA_BIN."java -cp ".METEXPLOREJAVA_DIR."/metExploreJava.jar utils.SenMail -subject \"$Mailsubject\" -body \"$messageBody\" ";

$output;
$res = exec($cmd, $output);

if (!$output){
	//error_log("mail not sent");
}

?>
