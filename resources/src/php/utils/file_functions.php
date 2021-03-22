<?php
// Retourne un nom de fichier aleatoire s'il n'existe pas encore
function createRandomFileName($rep, $pre, $ext) {

	if($ext != "") {
		$ext = ".$ext";
	}

	if($rep!="") {
		$filename = $rep."/".$pre."_".rand()."$ext";
	}
	else {
		$filename = $pre."_".rand()."$ext";
	}

	while(file_exists($filename)) {
		if($rep!="") {
			$filename = $rep."/".$pre."_".rand()."$ext";
		}
		else {
			$filename = $pre."_".rand()."$ext";
		}
	}

	return $filename;

}

function jsonToCsv ($json, $csvFilePath = false, $boolOutputFile = false) {

    // See if the string contains something
    if (empty($json)) {
        die("The JSON string is empty!");
    }

    // If passed a string, turn it into an array
    if (is_array($json) === false) {
        $json = json_decode($json, true);
    }

    // If a path is included, open that file for handling. Otherwise, use a temp file (for echoing CSV string)
    if ($csvFilePath !== false) {
        $f = fopen($csvFilePath,'w');
        if ($f === false) {
            die("Couldn't create the file to store the CSV, or the path is invalid. Make sure you're including the full path, INCLUDING the name of the output file (e.g. '../save/path/csvOutput.csv')");
        }
    }
    else {
        $boolEchoCsv = true;
        if ($boolOutputFile === true) {
            $boolEchoCsv = false;
        }
        $strTempFile = 'csvOutput' . date("U") . ".csv";
        $f = fopen($strTempFile,"w+");
    }

    $firstLineKeys = false;
    foreach ($json as $line) {
        if (empty($firstLineKeys)) {
            $firstLineKeys = array_keys($line);
            //error_log($firstLineKeys);
            fputcsv($f, $firstLineKeys,"\t");
            $firstLineKeys = array_flip($firstLineKeys);
        }

        // Using array_merge is important to maintain the order of keys acording to the first element
        fputcsv($f, array_merge($firstLineKeys, $line),"\t");
    }
    fclose($f);
    return($f);

//    // Take the file and put it to a string/file for output (if no save path was included in function arguments)
//    if ($boolOutputFile === true) {
//        if ($csvFilePath !== false) {
//            $file = $csvFilePath;
//        }
//        else {
//            $file = $strTempFile;
//        }
//
//        // Output the file to the browser (for open/save)
//        if (file_exists($file)) {
//            header('Content-Type: text/csv');
//            header('Content-Disposition: attachment; filename='.basename($file));
//            header('Content-Length: ' . filesize($file));
//            readfile($file);
//        }
//    }
//    elseif ($boolEchoCsv === true) {
//        if (($handle = fopen($strTempFile, "r")) !== FALSE) {
//            while (($data = fgetcsv($handle)) !== FALSE) {
//                echo implode(",",$data);
//                echo "<br />";
//            }
//            fclose($handle);
//        }
//    }
//
//    // Delete the temp file
//    unlink($strTempFile);

}

?>