<?php

require_once '../config/server_variables.php';
require_once '../database/connection.php';
require_once "../utils/file_functions.php";
require_once "../user/userFunctions.php";

@apache_setenv('no-gzip', 1);
@ini_set('zlib.output_compression', 0);

extract($_POST, EXTR_OVERWRITE);

$response["success"] = false;

if (!isset($java_class)) {
   // error_log("Lacks the java_class arg");
    $response["message"] = "Problem in loading the application";
    die(json_encode($response));
}

$cmd = JAVA_BIN . "java -Dlog4j.configuration=log4jmet4j.properties -cp " . METEXPLOREJAVA_DIR . "/metExploreJava.jar $java_class -printJson";

$cmd .= " 2> /dev/null";

// error_log ( $cmd );

$output = array();

$status = 1;

$res = exec($cmd, $output);

$jsonStr = "";

for ($i = 0; $i < count($output); $i++) {
    $jsonStr = $jsonStr . $output[$i];
}

// error_log ( $jsonStr );

$json = json_decode($jsonStr, true);

$sendMail = false;
if ($json["send_mail"] == "true") {
    $sendMail = true;
}

$long_job = false;

if (isset($json["long_job"]) && $json["long_job"] == "true") {

    $today = date("Y-m-d H:i:s");

    $long_job = true;

    $idUser = getIdUser();

    if ($idUser != -1) {
        // The user is connected
        $user_dir = getUsermd5(getIdUser(), $link);

        $output_dir = USERFILES_DIR . "/" . $user_dir;

        $tempdir = createRandomFileName($output_dir, "results", "");

        mkdir($tempdir, 0777, true);

        $output_file = $tempdir . "/results.json";

        $title_file = $tempdir . "/title";

        $log_file = $tempdir . "/log";

        $resultType_file = $tempdir . "/resultType";

        $date_file = $tempdir . "/date";

        $target_bs = $tempdir . "/targetBS";

        file_put_contents($date_file, $today);

        file_put_contents($title_file, $analysis_title);

        file_put_contents($resultType_file, $json["resultType"]);

        if (isset($idBioSource)) {
            file_put_contents($target_bs, $idBioSource);
        }

        $output_url = USERFILES_URL . "/" . $user_dir . "/" . basename($tempdir) . "/results.json";
    } else {
        // The user is not connected : save the results in the session directory
        $output_dir = TMP_DIR . "/" . session_id();
        if (!is_dir($output_dir)) {
            mkdir($output_dir);
        }
        $tempdir = createRandomFileName($output_dir, "results", "");
        mkdir($tempdir);
        $output_file = $tempdir . "/results.json";

        $title_file = $tempdir . "/title";

        $log_file = $tempdir . "/log";

        $resultType_file = $tempdir . "/resultType";

        $date_file = $tempdir . "/date";

        $target_bs = $tempdir . "/targetBS";

        file_put_contents($date_file, $today);

        file_put_contents($title_file, $analysis_title);

        file_put_contents($resultType_file, $json["resultType"]);

        file_put_contents($target_bs, $idBioSource);

        $output_url = TMP_URL . "/" . session_id() . "/" . basename($tempdir) . "/results.json";
    }

} else {
    $tempdir = createRandomFileName(TMP_DIR, "results", "");
    mkdir($tempdir);
    $output_file = $tempdir . "/results.json";
    $log_file = $tempdir . "/log";
    $output_url = TMP_URL . "/" . basename($tempdir) . "/results.json";
}

$parameters = $json["parameters"];

$nParameters = count($parameters);

$pid_file = dirname($output_file) . "/PID";

$cmd = "cd $tempdir;" . JAVA_BIN . "java -Dlog4j.configuration=log4jmet4j.properties -Xms512M -Xmx2048M -Djava.library.path=" . D_JAVA_LIBRARY_PATH . "  -cp " . GLPK_JAR . ":" . METEXPLOREJAVA_DIR . "/metExploreJava.jar $java_class -dbConf " . php_ini_loaded_file() . " -logPath " . DATALOG_DIR . " -tmpPath " . TMP_DIR . " -urlTmpPath " . TMP_URL . " -jsonFile " . $output_file;

if ($long_job || $sendMail) {
    $cmd = "echo \"-1\" > $pid_file;tsp -S 2; tsp sh -c \"" . $cmd;
}

for ($i = 0; $i < $nParameters; $i++) {

    $parameter = $parameters[$i];

    $parameterName = $parameter["name"];
    $required = $parameter["required"];
    $type = $parameter["type"];
    $metaVar = $parameter["metaVar"];

    if ($metaVar == "file") {
        if ($required == "true" && !array_key_exists($parameterName, $_FILES)) {
           // error_log("Lacks the $parameterName file arg (required)");
            $response["message"] = "Lacks the required file parameter $parameterName";
            die(json_encode($response));
        }

        // Check the file size of the uploaded file. max file size: 80M
        $size = $_FILES[$parameterName]['size'];
        $error = $_FILES[$parameterName]['error'];

        if ($size > 83886080 || $error == 1 || $error == 2) //We accept only files that have a size of 500KO or less
        {
            die('{success: false, message: "Your SBML file size exceeds server uploading configuration (Max: 80Mo), please contact MetExplore team via e-mail: metexplore@listes.inra.fr."}');
        } elseif ($error > 0) {
            die('{success: false, message: "Error during uploading of file ' . $_FILES[$parameterName]['name'] . '"}');
        }

        $fileName = createRandomFileName(TMP_DIR, "upload", "xml");
        $tmpName = $_FILES[$parameterName]['tmp_name'];

        $err = move_uploaded_file($tmpName, $fileName);

        if (!$err) {
            $response["message"] = "Error while uploading the file";
            die(json_encode($response));
        }

        $convertCmd = "iconv -cs -f utf-8 -t utf-8 $fileName > $fileName.conv ; mv $fileName.conv $fileName;";

        exec("$convertCmd");

        $cmd .= " -$parameterName " . escapeshellarg($fileName);
    } else {

        if ($required == "true" && !array_key_exists($parameterName, $_POST)) {
           // error_log("Lacks the $parameterName arg (required)");
            $response["message"] = "Lacks the required parameter $parameterName";
            die(json_encode($response));
        }

        if (array_key_exists($parameterName, $_POST)) {

            if ($type == "boolean" || $type == "Boolean") {
                if ($_POST[$parameterName] == "true") {
                    $cmd .= " -$parameterName";
                }
            } else {

                if ($_POST[$parameterName] != "") {
                    if (is_array($_POST[$parameterName])) {
                        $value = join(",", $_POST[$parameterName]);
                        $cmd .= " -$parameterName " . escapeshellarg($value);
                    } else {
                        $cmd .= " -$parameterName " . escapeshellarg($_POST[$parameterName]);
                    }
                }
            }
        }
    }
}

$output = array();

$status = 1;

if ($sendMail) {

    $cmd .= " > /dev/null\"";
    $res = exec($cmd, $output);

    print "{\"success\":\"true\", \"message\":\"You will receive an email when the process will be finished\"}";
} else if ($long_job) {

    // $cmd .= " > $output_file";

    $tspOutput = $log_file . "_tspOutput.txt";

    $cmd = "$cmd  2> $log_file & pid=\\$! ; echo \\$! > $pid_file ; wait \$pid\"  > $tspOutput";

    exec($cmd, $output);

    print "{\"success\":\"true\", \"message\":\"Reload your job list to see the progress of your job\"}";

} else {
    // $cmd .= " > $output_file 2> $log_file";
    $cmd .= " 2> $log_file";

    $res = exec($cmd, $output);
    print "{\"success\":\"true\",  \"path\":\"$output_url\"}";
}
