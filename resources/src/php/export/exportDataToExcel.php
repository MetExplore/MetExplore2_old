<?php 

require_once '../../../lib/php/PHPExcel/PHPExcel.php';
require_once '../utils/file_functions.php';
require_once '../config/server_variables.php';

if (isset($_POST['data'])) {
	$data = json_decode($_POST['data'], true);
}
else {
	die('{success: false, message:"Data not found!"}');
}
if (isset($_POST['title'])) {
	$title = $_POST['title'];
}
else {
	$title = "MetExplore export";
}

// Create new PHPExcel object
$objPHPExcel = new PHPExcel();

//PHPExcel_Shared_Font::setAutoSizeMethod(PHPExcel_Shared_Font::AUTOSIZE_METHOD_EXACT);

$objPHPExcel->getDefaultStyle()->getFont()->setName('Arial');

// Set document properties
$objPHPExcel->getProperties()->setCreator("MetExplore")
->setLastModifiedBy("MetExplore")
->setTitle($title);


$alphabet = array();
foreach (range('A', 'Z') as $char) {
	array_push($alphabet, $char);
}
foreach (range('A', 'Z') as $char1) {
	foreach (range('A', 'Z') as $char2) {
		array_push($alphabet, $char1 . $char2);
	}
}

$sheetNb = 0;
foreach($data as $sheet) {
	if ($sheetNb > 0) { //Create new sheet
		$objPHPExcel->createSheet(NULL, $sheetNb);
	}
	//Select current sheet:
	$objPHPExcel->setActiveSheetIndex($sheetNb);
	//Set sheet name
	$title = $sheet["title"];
	$title = preg_replace("/\//", "|", $sheet["title"]); //Replace "/" (forbidden) by "|"
	//$title = preg_replace("/[\[\]\*\?\:\\/", "", $title); //Remove other forbidden chars if present
	
	// The length of the title is limited to 31
	$title = substr($title, 0, 30);
	
	$objPHPExcel->getActiveSheet()->setTitle($title);
	
	//Set values
	$len = count($sheet["data"][$sheet["colIndexForName"][$sheet["columns"][0]]]);
	$colNb = 0;
	$objPHPExcel->getActiveSheet()->getStyle("A1:Z1")->getFont()->setBold(true);
	foreach($sheet["columns"] as $col) {
		$colId = $alphabet[$colNb];
		$objPHPExcel->setActiveSheetIndex($sheetNb)
			->setCellValue($colId . "1", $col);
		$maxString = $col; //Stores the biggest string of the column
		$lineNb = 2;
		foreach($sheet["data"][$sheet["colIndexForName"][$col]] as $cell) {
			$objPHPExcel->setActiveSheetIndex($sheetNb)
				->setCellValue($colId . strval($lineNb), strip_tags($cell, '<->')); //Remove HTML tags
			if (strlen($cell) > strlen($maxString))
				$maxString = $cell;
			$lineNb++;
		}
		$objPHPExcel->getActiveSheet()
			->getColumnDimension($colId)
			->setWidth(min(sizeTextInExcelFormat(strval($maxString)), 100)); //Set column size with a max size
		$colNb++;
		if ($colNb >= 702) { //If Nathalie is too greedy (trop de colonnes par rapport a ce qui est supporte actuellement)
			die('{success: false, message: "a grid of your Network contains more than 702 columns, so it can\'t be exported for now. Please contact an administrator at metexplore@toulouse.inra.fr" }');
		}
	}
	$objPHPExcel->getActiveSheet()->freezePane('A2');
	$sheetNb++;
}

// Set active sheet index to the first sheet, so Excel opens this as the first sheet
$objPHPExcel->setActiveSheetIndex(0);


$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
$filename = createRandomFileName(TMP_DIR . '/', "exportExcel", "xls");
$objWriter->save($filename);

echo '{success: true, file:"' . str_replace(TMP_DIR, TMP_URL, $filename) . '"}';

/*// Redirect output to a client’s web browser (Excel-xls)
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="excelExport.xls"');
header('Cache-Control: max-age=0');
// If you're serving to IE 9, then the following may be needed
header('Cache-Control: max-age=1');

// If you're serving to IE over SSL, then the following may be needed
header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); // always modified
header ('Cache-Control: cache, must-revalidate'); // HTTP/1.1
header ('Pragma: public'); // HTTP/1.0

$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
$objWriter->save('php://output');*/

exit;

function sizeTextInExcelFormat($text) {
	list($left,, $right) = imageftbbox( 11, 0, '../../../lib/php/PHPExcel/PHPExcel/Shared/fonts/arial.ttf', $text);	
	$width = (($right - $left) * 0.6) / 4.5;
	return $width;
}

?>