<!DOCTYPE html>
<html>
<body>

<h1>My First Heading</h1>

<p>My first paragraph.</p>
    
    
<?php

    $message = "PHP LOADED";
    echo "<script type='text/javascript'>alert('$message');</script>";
    
    // Escape user input
    $person = mysql_real_escape_string(html_entities($_POST['person']));

    // Connection variables
    $subject = 'SST CTF Subscription Verification';
    $servername = "localhost";
    $username = "www";
    $password = "gfFIw{NHpwCF67";   // TODO: Remove password from index.php by calling password from another file
    $dbname = "typing_test";
    $err = False;
    
    // Filter people 
    if (!$_POST["person"] || !filter_var($_POST["person"], FILTER_VALIDATE_EMAIL)) {

        $err = True;
        $newsresult = '<div class="alert alert-success">This is not a valid name.</div>';

    } 
    // Everything is clear, do the mysql magic
    else 
    {
        // Create Connection
        $conn = new mysqli($servername, $username, $password, $dbname);
    
        // Check Connection
        if ($conn->connect_error) 
        {
            die("Connection failed: " . $conn->connect_error);
            $err = True; 
        }     
        // SQL magic
        if (!$err) 
        {
            // Check if not duplicate name
            $sql = "SELECT name FROM test WHERE name = ('$person')";
            if ($conn->query($sql) === FALSE) {
                $err = True;
            }
            $sql = "INSERT INTO test (name) VALUES('$person')";
            if ($conn->query($sql) === FALSE) {
                $err = True;
            }
        }
    }
?>

    </body>
</html>