<?php
require_once ("userFunctions.php");

$currentIdUser=$_POST['currentIdUser'];

if(checkUserId($currentIdUser)){

	print "{\"success\":\"true\", \"loggedUser\":true}";
}else{
	print "{\"success\":\"true\", \"loggedUser\":false}";
}


?>
