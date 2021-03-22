<?php 
//
/*
 * $query  = "SELECT CURRENT_USER();";
$query .= "SELECT Name FROM City ORDER BY ID LIMIT 20, 5";

/* Exécution d'une requête multiple
if ($mysqli->multi_query($query)) {
 */
	require_once '../database/connection.php';
	require_once '../userAndProject/addHistoryItem.php';
	require_once '../user/userFunctions.php';
	$Reactions= json_decode($_POST['Reactions']);
	$P_idUser=getIdUser();
	$P_idBioSource= $_POST['idBioSource'];
	//echo $Reactions;

     if($P_idUser == -1){
        echo '{"success":false}';
        return;
    }
	//mise a jour de last modif une seule fois pour le biosource
	$query="UPDATE BioSource SET dateLastModif=\"" . date("Y-m-d H:i:s") ."\" WHERE id=$P_idBioSource;";
     $queryHistory= "";
     $nbreq= 0;
    foreach($Reactions as $element)
	{
//    	$id= mysqli_real_escape_string ( $link , $element[0] );
//    	$field= mysqli_real_escape_string ( $link , $element[2] );
        $id= $element->idMysql;
        $field=$element->field;
    	 
    	$value= $element->newV ;
    	if (($field == "reversible") OR ($field == "hole") OR ($field == "upperBound") OR ($field == "lowerBound")) {
    		if (($field == "reversible") OR ($field == "hole")) {
    			 if ($value== "true") {
                    $value=1;
                } else {
                    $value=0;
                }
    		};
            //$value= mysqli_real_escape_string ( $link , $value );
	    	$sql="UPDATE ReactionInBioSource SET `$field` = '$value' WHERE ReactionInBioSource.idReaction='$id';";
	    	$query .= $sql;

    	} else {
            //$value= mysqli_real_escape_string ( $link , $value );

	    	$sql="UPDATE Reaction SET `$field` = '$value' WHERE Reaction.id='$id';";
            $query .= $sql;
	   	}    			
    	//error_log($sql);
    	//$num_result=mysqli_query($link, $sql) or die('{success: false, message: "Error in SQL request n°1: update request"}');
        //$P_idUser= mysqli_real_escape_string ( $link , $P_idUser );

    	$sql="UPDATE Reaction SET `idLastAnnotator`='$P_idUser' WHERE Reaction.id='$id';";
        $query .= $sql;
    	//la date se met a jour sur le update

    	//$num_result=mysqli_query($link, $sql) or die('{success: false, message: "Error in SQL request n°2: update request"}');
    	
    	//Add to history:
//    	$action['action'] = "update reaction";
//    	$action['dbIdentifier'] = $element->dbIdentifier;
//    	$action['field'] = $field;
//    	$action['value'] = $value;
        $desc = "Update reaction \\\"$element->dbIdentifier\\\" : set  $field  =  $value";
        //error_log($desc);
        $sqlHistory = "INSERT INTO History (idUser, idBioSource, action) VALUES ($P_idUser, $P_idBioSource, \"$desc\");";
        //error_log($sql);
        $queryHistory .= $sqlHistory;

        //si nombre de requete >500 (j'arrive a en faire 960)
        $nbreq++;
        if ($nbreq>500) {
            //error_log($query);
            $nbreq=0;
            $link->multi_query($query);
            $link->close();
            $link = new mysqli( get_cfg_var("metexplore.cfg.DB_HOST"), get_cfg_var("metexplore.cfg.DB_USER"), get_cfg_var("metexplore.cfg.DB_PSWD"), get_cfg_var("metexplore.cfg.DB_NAME_DATA")) or die("Error " . mysqli_error($link));
            $link->multi_query($queryHistory);
            $link->close();
            $link = new mysqli( get_cfg_var("metexplore.cfg.DB_HOST"), get_cfg_var("metexplore.cfg.DB_USER"), get_cfg_var("metexplore.cfg.DB_PSWD"), get_cfg_var("metexplore.cfg.DB_NAME_DATA")) or die("Error " . mysqli_error($link));
            $query="";
            $queryHistory="";
        //$link = new mysqli( get_cfg_var("metexplore.cfg.DB_HOST"), get_cfg_var("metexplore.cfg.DB_USER"), get_cfg_var("metexplore.cfg.DB_PSWD"), get_cfg_var("metexplore.cfg.DB_NAME_DATA")) or die("Error " . mysqli_error($link));

//
        }
        //addHistoryItem($P_idBioSource, $P_idUser, $action, $link);
    	//$sql = "SELECT idBioSource FROM Reaction, ReactionInBioSource WHERE Reaction.id = ReactionInBioSource.idReaction AND Reaction.id = '$id'";

//    	$result = mysqli_query ( $link, $sql ) or die('{success: false, message: "Before history: Error in SQL request n°3 in getting idBioSource"}');
//    	if ($row = mysqli_fetch_object($result)) {
//    		$idbiosource = $row->idBioSource;
    		//addHistoryItem($P_idBioSource, $P_idUser, $action, $link);
 //   	}
	}

//error_log($query);
//$result = mysqli_query ( $link, $query );
$link->multi_query($query);
    $link->close();
$link = new mysqli( get_cfg_var("metexplore.cfg.DB_HOST"), get_cfg_var("metexplore.cfg.DB_USER"), get_cfg_var("metexplore.cfg.DB_PSWD"), get_cfg_var("metexplore.cfg.DB_NAME_DATA")) or die("Error " . mysqli_error($link));
$link->multi_query($queryHistory);
$link->close();

?>