<?php

// ini_set('session.cookie_lifetime', 60 * 60 * 24 * 7);
// ini_set('session.gc_maxlifetime', 60 * 60 * 24 * 7);

session_start();
$name = isset($_POST["loginUsername"]) ? $_POST["loginUsername"] : "";
$pwd = isset($_POST["loginPassword"]) ? $_POST["loginPassword"] : "";

require './connection.php';

$req = "SELECT id, name, email, password FROM UserMet WHERE UserMet.username=\"$name\"";
$res = mysqli_query ( $link,$req );
$row = mysqli_fetch_array ( $res );

/*
 * print 'test: ' .  $row["password"][0] . "\n";
 * pour voir si reset password password dans nouveau joomla, je test si 1er carractere du password est $
 */
if ($row!=null & $row!=0 & ($row["id"]>=1109 | $row["password"][0]=="$")) {
    //nouvelle version joomla cryptage mot de passe different
    //require_once ("User/User.php");
    require './UserJoomla/PasswordHash.php';
    $hash = $row ['password'];

    $t_hasher = new PasswordHash(10, TRUE);
/*
   // $correct = 'correct password';
    //$hash = $t_hasher->HashPassword($correct);
    print 'Hash: ' . $hash . "\n";
    //Get password to check from get variable
    //$p=$_GET['p'];
    //check if is correct
*/
    $check = $t_hasher->CheckPassword($pwd, $hash);
    if ($check){
        $result["success"]= true;
        $result["idUser"]=$row["id"];
        $result["email"]=$row["email"];
        $_SESSION['idUser'] = $row["id"];
    }
    else {
        $result["success"]= false;
        echo "{success: false, errors: { reason: 'Login failed. Try again.' }}";
    }

} else {
    //ancienne version de joomla cryptage mot de passe different
    require ("userJoomla.php");
    $rescrypt= crypt_joomla_psw($pwd,'',$name,$row["password"]);
     if ($rescrypt=="ok") {
   // if ($row!=null & $row!=0) {
        $result["success"]= true;
        $result["idUser"]=$row["id"];
        $result["email"]=$row["email"];
        $_SESSION['idUser'] = $row["id"];


    } else 	{
        $result["success"]= false;
        echo "{success: false, errors: { reason: 'Login failed. Try again.' }}";
    }

}


echo json_encode($result);
?>