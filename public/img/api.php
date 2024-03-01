<?php

include('config.php');
// array holding allowed Origin domains
$allowedOrigins = array(
  '(http(s)://)?(www\.)?my\-domain\.com'
);
 
if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] != '') {
  foreach ($allowedOrigins as $allowedOrigin) {
    if (preg_match('#' . $allowedOrigin . '#', $_SERVER['HTTP_ORIGIN'])) {
      header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
      header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
      header('Access-Control-Max-Age: 1000');
      header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
      break;
    }
  }
}
$dup = 0;
if(isset($_GET["api"])) {
        if($_GET["api"] == 'logs'){
        
        if ($db->connect_errno) {
            printf("Failed to connect to database");
            exit();
        }
        $result = $db->query("SELECT * FROM logs ORDER BY id DESC");
        $dbdata = array();
        while ( $row = $result->fetch_assoc())  {
            $dbdata[]=$row;
        }
        echo json_encode($dbdata);

    }  elseif($_GET["api"] == 'lastcontacts') {
        if ($db->connect_errno) {
            printf("Failed to connect to database");
            exit();
        }
        $result = $db->query("SELECT * FROM logs ORDER BY id DESC LIMIT 10");
        $dbdata = array();
        while ( $row = $result->fetch_assoc())  {
            $dbdata[]=$row;
        }
        echo json_encode($dbdata);
        

    
    
    }  elseif($_GET["api"] == 'datacheck') {

        $callsign = mysqli_real_escape_string($db, $_GET['callsign']);
        $band = mysqli_real_escape_string($db, $_GET['band']);
        $mode = mysqli_real_escape_string($db, $_GET['mode']);

        if ($db->connect_errno) {
            printf("Failed to connect to database");
            exit();
        }
        $result = $db->query("SELECT * FROM logs WHERE callsign ='$callsign' AND band ='$band' AND mode = '$mode'");
        $dbdata = array();
        while ( $row = $result->fetch_assoc())  {
            $dbdata []=$row;
        }
        echo json_encode($dbdata);


    }elseif($_GET["api"] == 'counts') {

        $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUsername, $dbPassword);

        // Prepare and execute the SQL queries
        $sql1 = "SELECT year, COALESCE(COUNT(*), 0) AS count FROM logs WHERE year = '2023' GROUP BY year";
        $stmt1 = $pdo->prepare($sql1);
        $stmt1->execute();
        $results1 = $stmt1->fetchAll(PDO::FETCH_ASSOC);

        $sql2 = "SELECT 'ssb' AS mode, COALESCE(COUNT(*), 0) AS ssb FROM logs WHERE year = '2023' and mode = 'ssb'";
        $stmt2 = $pdo->prepare($sql2);
        $stmt2->execute();
        $results2 = $stmt2->fetchAll(PDO::FETCH_ASSOC);

        $sql3 = "SELECT 'cw' AS mode, COALESCE(COUNT(*), 0) AS cw FROM logs WHERE year = '2023' and mode = 'cw'";
        $stmt3 = $pdo->prepare($sql3);
        $stmt3->execute();
        $results3 = $stmt3->fetchAll(PDO::FETCH_ASSOC);

        $sql4 = "SELECT 'digital' AS mode, COALESCE(COUNT(*), 0) AS digital FROM logs WHERE year = '2023' and mode = 'digital'";
        $stmt4 = $pdo->prepare($sql4);
        $stmt4->execute();
        $results4 = $stmt4->fetchAll(PDO::FETCH_ASSOC);

        // Combine the results into one array
        $results = array_merge($results1, $results2, $results3, $results4);

        // Convert the results array to JSON
        $json = json_encode($results);

        // Output the JSON
        header('Content-Type: application/json');
        echo $json;             

    

    }  elseif($_GET["api"] == 'logcontact') {

                $callsign = mysqli_real_escape_string($db, $_GET['callsign']);
                $class = mysqli_real_escape_string($db, $_GET['class']);
                $section = mysqli_real_escape_string($db, $_GET['section']);
                $band = mysqli_real_escape_string($db, $_GET['band']);
                $mode = mysqli_real_escape_string($db, $_GET['mode']);
                $operator = mysqli_real_escape_string($db, $_GET['operator']);
                $lat = mysqli_real_escape_string($db, $_GET['lat']);
                $lng = mysqli_real_escape_string($db, $_GET['lng']);
                $name = mysqli_real_escape_string($db, $_GET['name']);

                if (mysqli_connect_errno()) { 
                    echo "Database connection failed."; 
                } 

                // Check if section exists in the sections table
                $sectionQuery = "SELECT * FROM sections WHERE section = '$section' AND year = '2023'";
                $sectionResult = mysqli_query($db, $sectionQuery);

                if (mysqli_num_rows($sectionResult) == 0) {
                    // Section doesn't exist, insert it into the sections table
                    $sectionInsertQuery = "INSERT INTO sections (section, operator) VALUES ('$section', '$operator')";
                    mysqli_query($db, $sectionInsertQuery);
                }

                // Insert data into the logs table
                $query = "INSERT INTO logs (id, callsign, class, section, operator, mode, band, lat, lng, name, year) VALUES (NULL, '$callsign', '$class', '$section', '$operator', '$mode', '$band', '$lat', '$lng', '$name', '2023')";

                $result = mysqli_query($db, $query);
                if ($result) {
                    $row = mysqli_affected_rows($db);
                    printf($row);
                    mysqli_free_result($result);
                }

                mysqli_close($db);


    }  elseif($_GET["api"] == 'check') {

        $callsign = mysqli_real_escape_string($db, $_GET['callsign']);
        $band = mysqli_real_escape_string($db, $_GET['band']);
        $mode = mysqli_real_escape_string($db, $_GET['mode']);
        if (mysqli_connect_errno()) 
        { 
            echo "Database connection failed."; 
        } 
        $query = "SELECT * FROM logs WHERE callsign ='$callsign' AND band ='$band' AND mode = '$mode' AND year='2023'"; 

        $result = mysqli_query($db, $query); 
        if($result) 
        {    
            $row = mysqli_num_rows($result); 
            //printf($row); 
            $xml = simplexml_load_file('https://xmldata.qrz.com/xml/current/?username=kd9hae;password=ArmY1234$$') or die("Error");
       
                $ApiKey = $xml->Session[0]->Key;
                //echo $ApiKey;
                $url = "https://xmldata.qrz.com/xml/current/?s=" . $ApiKey .";callsign=". $callsign;
                
                $xml1 = simplexml_load_file($url) or die ("Error");
                $name = $xml1->Callsign[0]->name_fmt;
                $name = str_replace('"', "|", $name);
                $lat = $xml1->Callsign[0]->lat;
                $lon = $xml1->Callsign[0]->lon;
                $state = $xml1->Callsign[0]->state;
                $country = $xml1->Callsign[0]->country;

                if($row == 0) {
                $myoutput = '{"status":"New Contact","name":"' . $name . '","lat":"' . $lat . '","lon":"'. $lon .'","country":"' . $country . '","state":"' . $state . '"}';
                echo $myoutput;
                } else {
                $myoutput = '{"status":"Duplicate Contact","name":"' . $name . '","lat":"' . $lat . '","lon":"'. $lon .'","country":"' . $country . '","state":"' . $state . '"}';
                echo $myoutput;
                }
            mysqli_free_result($result); 
        }
        mysqli_close($db); 
    } elseif($_GET["api"] == 'checklogfile') {

        $callsign = mysqli_real_escape_string($db, $_GET['callsign']);
        $band = mysqli_real_escape_string($db, $_GET['band']);
        $mode = mysqli_real_escape_string($db, $_GET['mode']);
        $callclass = mysqli_real_escape_string($db, $_GET['class']);
        $operator = mysqli_real_escape_string($db, $_GET['operator']);
        $section = mysqli_real_escape_string($db, $_GET['section']);

        if (mysqli_connect_errno()) 
        { 
            echo "Database connection failed."; 
        } 
        $query = "SELECT * FROM logs WHERE callsign ='$callsign' AND band ='$band' AND mode = '$mode'"; 

        $result = mysqli_query($db, $query); 
        if($result) 
        {    
            $row = mysqli_num_rows($result); 
            //printf($row); 
            $xml = simplexml_load_file('https://xmldata.qrz.com/xml/current/?username=kd9hae;password=ArmY1234$$') or die("Error");
       
                $ApiKey = $xml->Session[0]->Key;
                //echo $ApiKey;
                $url = "https://xmldata.qrz.com/xml/current/?s=" . $ApiKey .";callsign=". $callsign;
                
                $xml1 = simplexml_load_file($url) or die ("Error");
                $name = $xml1->Callsign[0]->name_fmt;
                $name = str_replace('"', "|", $name);
                $lat = $xml1->Callsign[0]->lat;
                $lon = $xml1->Callsign[0]->lon;
                $state = $xml1->Callsign[0]->state;
                $country = $xml1->Callsign[0]->country;

                if($row == 0) {
                $myoutput = '{"status":"New Contact","name":"' . $name . '","lat":"' . $lat . '","lon":"'. $lon .'","callsign":"' . $callsign . '","section":"' . $section . '","class":"' . $callclass . '","mode":"' . $mode . '","operator":"' . $operator . '","band":"' . $band .'"}';
                echo $myoutput;
                } else {
                $myoutput = '{"status":"Duplicate Contact","name":"' . $name . '","lat":"' . $lat . '","lon":"'. $lon .'","callsign":"' . $callsign . '","section":"' . $section . '","class":"' . $callclass . '","mode":"' . $mode . '","operator":"' . $operator . '","band":"' . $band .'"}';
                echo $myoutput;
                }
            mysqli_free_result($result); 
        }
        mysqli_close($db); 

    } else {
        echo "Route Not Found!";
    }
}
?>
