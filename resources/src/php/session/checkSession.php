<?php

require_once ("sessionFunctions.php");


if(is_session_active()){
	print "{\"success\":\"true\", \"expired\":false}";
}else{
	print "{\"success\":\"true\", \"expired\":true}";
}
?>