    
<?php
/**
 * Created by IntelliJ IDEA.
 * User: MaxChaza
 * Date: 10/03/2017
 * Time: 09:23
 */
require_once ('../config/server_variables.php');
require_once ('../database/connection.php');
require_once ("../utils/file_functions.php");
require_once ("../user/userFunctions.php");

@apache_setenv ( 'no-gzip', 1 );
@ini_set ( 'zlib.output_compression', 0 );

$network =  json_decode($_POST["network"]);
$metabolites = json_decode($_POST["metabolites"], false);
$idBioSource = json_decode($_POST["idBioSource"], false);
$title = $_POST["title"];

    $today = date("Y-m-d H:i:s");

    $idUser = getIdUser ();
    if ($idUser != - 1) {
        // The user is connected
        $user_dir = getUsermd5 ( getIdUser (), $link );

        $output_dir = USERFILES_DIR . "/" . $user_dir;

    $tempdir = createRandomFileName($output_dir, "ranks", "");

        mkdir($tempdir , 0777, true);

        $output_file = $tempdir . "/results.json";

        $fileSeeds = $tempdir . "/seeds.tab";
        
    foreach ($metabolites as $key => $value) {
        if(!file_put_contents($fileSeeds, $key."\t".$value."\n", FILE_APPEND)) {
            echo "{$key} not saved";
        }
    }
    $file = $tempdir . "/networkForRank.txt";
    $jsondata = json_encode($network, JSON_ERROR_NONE );

    //write json data into data.json file
    if(!file_put_contents($file, $jsondata)) {
        echo 'networkForRank not saved';
    }

        $fileSeedsReturned = $tempdir . "/seedslist";

        $title_file = $tempdir . "/title";

        $log_file = $tempdir . "/log";

        $resultType_file = $tempdir . "/resultType";

        $date_file = $tempdir . "/date";

        $target_bs = $tempdir . "/targetBS";

        file_put_contents($date_file, $today);

        file_put_contents($fileSeedsReturned, json_encode($metabolites, JSON_ERROR_NONE ));

        file_put_contents($title_file, $title);

        file_put_contents($resultType_file, "pagerank");

        file_put_contents($target_bs, $idBioSource);

        $output_url = USERFILES_URL . "/" . $user_dir . "/" . basename ( $tempdir ) . "/results.json";
    }
    else {
        // The user is not connected : save the results in the session directory
        $output_dir = TMP_DIR . "/" . session_id();
        if(! is_dir($output_dir))
        {
            mkdir ($output_dir);
        }
       
    $tempdir = createRandomFileName($output_dir, "ranks", "");

        mkdir($tempdir , 0777, true);

        $output_file = $tempdir . "/results.json";

        $fileSeeds = $tempdir . "/seeds.tab";
        
    foreach ($metabolites as $key => $value) {
        if(!file_put_contents($fileSeeds, $key."\t".$value."\n", FILE_APPEND)) {
            echo "{$key} not saved";
        }
    }
    $file = $tempdir . "/networkForRank.txt";
    $jsondata = json_encode($network, JSON_ERROR_NONE );

    //write json data into data.json file
    if(!file_put_contents($file, $jsondata)) {
        echo 'networkForRank not saved';
    }

        $fileSeedsReturned = $tempdir . "/seedslist";

        $title_file = $tempdir . "/title";

        $log_file = $tempdir . "/log";

        $resultType_file = $tempdir . "/resultType";

        $date_file = $tempdir . "/date";

        $target_bs = $tempdir . "/targetBS";

        file_put_contents($date_file, $today);

        file_put_contents($fileSeedsReturned, json_encode($metabolites, JSON_ERROR_NONE ));

        file_put_contents($title_file, $title);

        file_put_contents($resultType_file, "pagerank");
        file_put_contents($target_bs, $idBioSource);
        $output_url = TMP_URL . "/" . session_id() . "/" . basename ( $tempdir ) . "/results.json";
    }

    //write json data into data.json file
    //    $cmd = JAVA_BIN."java -cp {$java}/met4j-binding.jar fr.inra.toulouse.metexplore.App -network c:/wamp64/www/MetExplore2Conf/temp/test.txt -edgeWeights c:/wamp64/www/MetExplore2Conf/atomMapping/testRun-AAM-weights.tab -metabolites c$
    $cmd = JAVA_BIN."java -cp ./met4j-binding.jar fr.inra.toulouse.metexplore.Bind2DRank -network ./".basename($file)." -edgeWeights ./".$idBioSource."-AAM-weights.tab -metabolites ./".basename($fileSeeds);

//    -network "c:/wamp64/www/MetExplore2Conf/temp/test.txt"
//    -edgeWeights "c:/wamp64/www/MetExplore2Conf/atomMapping/testRun-AAM-weights.tab"
//    -metabolites "c:/wamp64/www/MetExplore2Conf/temp/testSeedRun.tab"
//    -resultsPath "c:/wamp64/www/MetExplore2Conf/temp/Ranks/"
//    java -cp c:/wamp64/www/MetExplore2/lib/Java/met4j-binding.jar fr.inra.toulouse.metexplore.App -network c:/wamp64/www/MetExplore2Conf/temp/test.txt -edgeWeights c:/wamp64/www/MetExplore2Conf/atomMapping/testRun-AAM-weights.tab -met$
    //$cmd .= " 2>/dev/null";

    $status = 1;

    //$cmd .= " > $output_file";
    //$cmd = "nice -19 $cmd  2> $log_file & echo $!;";

    $job = "sh ".WEB_DIR."/resources/jobScripts/createAndLaunchMetaboRank.sh -m \"".METEXPLOREJAVA_DIR."\" -r $tempdir -j ".basename($tempdir)." -a \"".ATOMMAPPING_DIR."\" -c "."\"$cmd\"";
    exec ( $job );

    print "{\"success\":\"true\", \"message\":\"Reload your job list to see the progress of your job\"}";
?>



