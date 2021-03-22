<?php
/* traitement du bouton login avec renvoi du div Welcome */
require_once ("login.common.php");

function loginForm($aFormValues)
{
	require_once ("userJoomla.php");
	$objResponse = new xajaxResponse();
	
	$bError = false;
	if (trim($aFormValues['username']) == "")
	{
		$objResponse->alert("Please enter a User Name.");
		$bError = true;
	}
	if (trim($aFormValues['password']) == "")
	{
		$objResponse->alert("You may not have a blank password.");
		$bError = true;
	}
	if (!$bError)
	{
		//$_SESSION = array();
		//$_SESSION['newaccount']['username'] = trim($aFormValues['username']);
		$name= trim($aFormValues['username']);
		$pwd= trim($aFormValues['password']);
		//Si password correct alors je met rien dans la div login-box (donc je l’efface) et je met message de bienvenue dans la div logged 
		//Sinon j'envoi un message alert		
		if (crypt_joomla_psw($pwd,'',$name))
		{
			$objResponse->assign("login-box","innerHTML","");
			$objResponse->assign("logged","innerHTML","Welcome ".$aFormValues['username']);					
		}
		else 
		{
			$objResponse->alert("user name or password not valid");				
		}
	}
	
	return $objResponse;
}


$xajax->processRequest();
?>