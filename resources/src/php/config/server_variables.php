<?php
// reads the conf file and creates the corresponding global variables
// Open conf File in read-only mode
$myfile = fopen ( "/var/shared/met.conf", "r" );

if ($myfile) {
	
	while ( ! feof ( $myfile ) ) {
		
		$line = fgets ( $myfile );
		
		// If line is not empty and is not commented, it is a conf variable
		if (! strlen ( $line ) == 0 && substr ( $line, 0, 1 ) != "#") {
			$stringArray = explode ( "=", $line, 2 );
			
			if (sizeof ( $stringArray ) > 1) {
				// strip the \n at the end of the line
				define ( $stringArray [0], substr ( $stringArray [1], 0, strlen ( $stringArray [1] ) - 1 ) );
			}
		}
	}
	
	fclose ( $myfile );
} else {
	//error_log ( "[BIG ERROR] no conf file" );
}
?>
