<?php 
// 
$P_idBioSource=$_POST['idBioSource'];
//$sql=$_POST['req'];
$P_Listid=$_POST['id'];
$tabMetab= explode(",",$P_Listid);
$P_id=0;

require_once '../database/connection.php';
require_once '../user/userFunctions.php';

$currentUser=getIdUser();

if(getBioSourceRights($currentUser, $P_idBioSource, $link) == "denied"){
	echo '{"success":false}';
	return;
}


$query = 'SET GLOBAL group_concat_max_len=20000';
mysqli_query($link, $query);

$R_Reaction_ListidMetabLeft=	"SELECT Reaction.id AS id FROM Reaction, ReactionInBioSource, Metabolite, LeftParticipant  WHERE  Reaction.id = ReactionInBioSource.idReaction AND ReactionInBioSource.idBioSource = $P_idBioSource AND Metabolite.id = LeftParticipant.idMetabolite  AND LeftParticipant.idReaction = Reaction.id  AND Metabolite.id IN ($P_Listid)";
$R_Reaction_ListidMetabRight=	"SELECT Reaction.id AS id FROM Reaction, ReactionInBioSource, Metabolite, RightParticipant WHERE  Reaction.id = ReactionInBioSource.idReaction AND ReactionInBioSource.idBioSource = $P_idBioSource AND Metabolite.id = RightParticipant.idMetabolite AND RightParticipant.idReaction = Reaction.id AND Metabolite.id IN ($P_Listid)";
if(isset($R_Reaction_ListidMetabLeft) && isset($R_Reaction_ListidMetabRight)) {
	$R_Reaction_ListidMetabolite=	"$R_Reaction_ListidMetabLeft UNION $R_Reaction_ListidMetabRight";
}
$sql= "$R_Reaction_ListidMetabolite";
//for ($i = 0 ; $i < 20 ; $i++) echo('tabmetab0 '.$tabMetab[$i]);

$response ["success"] = false;

$result = mysqli_query ($link, $sql );

if (! $result) {
	$response ["message"] = "Impossible to get the list of the reactions!";
	mysql_error ();
	die ( json_encode ( $response ) );
}

$data = array();
$ListIdReaction="";

while ( $row = mysqli_fetch_object ( $result ))  {

	$P_idReaction = $row->id;
	$present= true;
	$sqlL = "SELECT LeftParticipant.idMetabolite AS id FROM LeftParticipant WHERE LeftParticipant.idReaction= $P_idReaction";
	//error_log('LeftP '. $sqlL);
	$resultleft = mysqli_query ( $link, $sqlL);
	//$idSubstrates= array();
	
	while ( ($rowL = mysqli_fetch_object ( $resultleft )) && $present) {
		//error_log('idMetL '. $rowL->id);
		$present= in_array($rowL->id,$tabMetab);
		//if (!in_array($rowL->id,$tabMetab)) $present=false;		
	}	
	/*
	transformer id Metabolite recu en post en tableau
	tester si idSubstrates sont tous dans ce tableau Metabolite
	si oui faire products sinon rien
	*/
	if ($present) {
		$sqlR = "SELECT RightParticipant.idMetabolite AS id FROM RightParticipant WHERE RightParticipant.idReaction= $P_idReaction";
		//error_log('RigtP '. $sqlR);
		$resultright = mysqli_query ( $link, $sqlR ) ;
		//$idProducts= array();
		
		while ( ($rowR = mysqli_fetch_object ( $resultright )) && $present) {
			//echo('idMetR '. $rowR->id);
			$present=in_array($rowR->id,$tabMetab);			
		}
		if ($present) {
			if (strlen($ListIdReaction)==0) $ListIdReaction=$P_idReaction;
			else $ListIdReaction= $ListIdReaction.','.$P_idReaction;			
		}
	}
	
}
echo json_encode($ListIdReaction);

?>
