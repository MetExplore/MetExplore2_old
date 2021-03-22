<?php
function CallAPI($method, $url, $data = false)
{
    $curl = curl_init();

    switch ($method)
    {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);

            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_PUT, 1);
            break;
        default:
            if ($data)
                $url = sprintf("%s?%s", $url, http_build_query($data));
    }


    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($curl);

    curl_close($curl);

    return $result;
}

function testJSON($string){
   return is_string($string) && is_valid_xml($string) ? "true" : "false";
}

function is_valid_xml ( $xml ) {
    libxml_use_internal_errors( true );

    $doc = new DOMDocument('1.0', 'utf-8');

    $doc->loadXML( $xml );

    $errors = libxml_get_errors();

    return empty( $errors );
}
$res=CallAPI("GET", "http://metab2mesh.ncibi.org/fetch?compound=methylmalonic+acid&publimit=1&limit=1");

echo testJSON("$res");
?>







