<?php 
// 
	require_once '../database/connection.php';
	require_once '../userAndProject/addHistoryItem.php';
	require_once '../user/userFunctions.php';
	$Metabolites= json_decode($_POST['Metabolites']);
    $P_idUser= $_POST['idUser'];
    $P_idBioSource= $_POST['idBioSource'];
	//$P_idUser= getIdUser();;
	//echo $P_idBioSource;
	//echo $P_idUser;

    if($P_idUser == -1){
        echo '{"success":false}';
        return;
    }
    $metab= array();
    $gitOrigin= array();
    $pos= -1;

	foreach($Metabolites as $element) {

        $id = mysqli_real_escape_string($link, $element[0]);
        $field = mysqli_real_escape_string($link, $element[2]);
        //$origin = $element[8];
        $pos= strpos($element[8], "git");
        //error_log($pos);
        if ($pos > -1) {
            //origin : git
            $origin= substr($element[8],3);
            $res['origin']= $origin;
            $res['dbIdentifier']= $element[7];
            $res['field'] = $field;
            $res['value'] = $element[6];
            $metab[]= $res;
            $gitOrigin[]= $origin;

        } else {

            $value = $element[6];
            if (($field == "boundaryCondition") OR ($field == "sideCompound")) {

                if ($value == "true") {
                    $value = 1;
                } else {
                    $value = 0;
                };

                $value = mysqli_real_escape_string($link, $value);


                $sql = "UPDATE MetaboliteInBioSource SET `$field` = '$value' WHERE MetaboliteInBioSource.idMetabolite='$id';";
            } else {
                $value = mysqli_real_escape_string($link, $value);

                $sql = "UPDATE Metabolite SET `$field` = '$value' WHERE Metabolite.id='$id';";
            }
            $num_result = mysqli_query($link, $sql) or die('{success: false, message: "Error in SQL request n°1: update request"}');

            //Add to history:
            $action['action'] = "update metabolite";
            $action['dbIdentifier'] = $element[7];
            $action['field'] = $field;
            $action['value'] = $value;

            addHistoryItem($P_idBioSource, $P_idUser, $action, $link);


        }
    }
    $tabOrigin=  array_unique($gitOrigin);
    if ($pos > -1) addGit_updateDB($P_idBioSource, $P_idUser, $metab, $tabOrigin , $link);
?>