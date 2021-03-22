<?php 
// 
	require_once '../database/connection.php';
	$Biosources= json_decode($_POST['Metabolites']);
	
	foreach($Biosources as $element){
		$bioid=$element[0] ;
		$table=$element[1] ;
		$oldStatus=$element[2] ;
		$newStatus=$element[3] ;
		$newUser=$element[4] ;

		// if used in the future, use 'mysqli_real_escape_string($link,  $newValue)' to escape SQL injection
		
		if ($oldStatus==$newStatus){
			if(($oldStatus=="Private") AND ($newUser!==null)){
				$sql= "INSERT INTO $table ( 'idUser', 'idBioSource', 'typ') VALUE ( \"$newUser\" , \"$bioid\", \"p\" );";
			}
			//else nothing => if public, pas dans Userbiosource, if no $newuser erreur
		}
		else{
			if ($newStatus=="Public"){
				$sql= "DELETE FROM $table WHERE $table.idBioSource=\"$bioid\";";			
			}
			elseif ($newStatus=="Private"){
				
			}
		}
	}

?>
