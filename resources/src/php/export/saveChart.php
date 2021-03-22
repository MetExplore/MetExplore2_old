<?php

$svg = $_POST['svg'];
if (isset($_POST['width']) && isset($_POST['height'])) {
	$width = $_POST['width'];
	$height = $_POST['height'];
}
$type = $_POST['type'];

$im = "";
$ext = "png";

if ($type == "image/png") {
	$im = new Imagick();
	$im->setBackgroundColor(new ImagickPixel('transparent'));
	$im->setResolution(300, 300); // for 300 DPI
	$im->readImageBlob($svg);
	$im->setImageFormat("png");
}
elseif($type == "image/svg+xml") {
	$im = $svg;
	$ext = "svg";
}

header('Content-Type: ' . $type);
header('Content-Disposition: attachment; filename="' . 'chart.' . $ext . '"');
header('Content-Transfer-Encoding: binary');
header('Accept-Ranges: bytes');
header('Cache-Control: private');
header('Pragma: private');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
echo $im;

?>