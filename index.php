<script src="./js/main.js"></script>
<script src="./js/jquery-3.1.1.min.js"></script>

<!DOCTYPE html>
<html>
<title>SST Typing Competition</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="css/stylesheet.css">
<link rel="stylesheet" href="fonts/raleway.css">
<link rel="stylesheet" href="fonts/font-awesome.min.css">
<style>
    html,
    body,
    h1,
    h2,
    h3,
    h4,
    h5 {
        font-family: "Raleway", sans-serif
    }
</style>

        <?php
    // Include Password File
include 'password.php';
    
// define variables and set to empty values
$nameErr = $emailErr = $genderErr = $websiteErr = "";
$name = $email = $gender = $comment = $website = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  if (empty($_POST["name"])) {
    $nameErr = "Name is required";
  } else {
    $name = test_input($_POST["name"]);
    // check if name only contains letters and whitespace
    if (!preg_match("/^[a-zA-Z ]*$/",$name)) {
      $nameErr = "Only letters and white space allowed"; 
    }
  }
}

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
?>
    
<body class="sst-light-grey">

    <!-- Top container -->
    <div class="sst-container sst-top sst-black sst-large sst-padding" style="z-index:4">
        <span class="sst-right"><a href="http://sstctf.org" style="text-decoration: none">SST CTF</a></span>
    </div>

    <!-- Overlay effect when opening sidenav on small screens -->
    <div class="sst-overlay sst-hide-large sst-animate-opacity" onclick="sst_close()" style="cursor:pointer" title="close side menu" id="myOverlay"></div>

    <!-- PAGE CONTENT -->
    <div class="sst-main" style="margin-left:10px;margin-top:43px;margin-right:10px;">

        <!-- Header -->
        <header class="sst-container" style="padding-top:6px">
            <h5><b><i class="fa fa-dashboard"></i> 2017 SST Typing Competition</b></h5>
        </header>
        <div class="sst-row-padding sst-margin-bottom">
            <div class="sst-quarter">
                <div class="sst-container sst-blue sst-padding-16">
                    <div class="sst-left"><i class="fa fa-calculator sst-xxxlarge"></i></div>
                    <div class="sst-right">
                        <h3>Net/Gross WPM</h3>
                    </div>
                    <div class="sst-clear"></div>
                    <h4>
                        <div id="stat_wpm">Not Started</div>
                    </h4>
                </div>
            </div>
            <div class="sst-quarter">
                <div class="sst-container sst-red sst-padding-16">
                    <div class="sst-left"><i class="fa fa-exclamation-triangle sst-xxxlarge"></i></div>
                    <div class="sst-right">
                        <h3>Entry Errors</h3>
                    </div>
                    <div class="sst-clear"></div>
                    <h4>
                        <div id="stat_errors">Waiting...</div>
                    </h4>
                </div>
            </div>
            <div class="sst-quarter">
                <div class="sst-container sst-teal sst-padding-16">
                    <div class="sst-left"><i class="fa fa-bullseye sst-xxxlarge"></i></div>
                    <div class="sst-right">
                        <h3>Accuracy</h3>
                    </div>
                    <div class="sst-clear"></div>
                    <h4>
                        <div id="stat_score">Waiting...</div>
                    </h4>
                </div>
            </div>
            <div class="sst-quarter">
                <div class="sst-container sst-orange sst-text-white sst-padding-16">
                    <div class="sst-left"><i class="fa fa-clock-o sst-xxxlarge"></i></div>
                    <div class="sst-right">
                        <h3>Remaining Time</h3>
                    </div>
                    <div class="sst-clear"></div>
                    <h4>
                        <div id="stat_timeleft">0:00</div>
                    </h4>
                </div>
            </div>
        </div>


        <!-- Begin Old Code -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td style="padding: 10px" class="bodya" colspan="2">
                    <FORM name="JobOp">
                        <table border="0" cellpadding="5" width="100%">
                                    <div id="expectedArea" style="display:block">
                                        <p style="margin-top: 0; margin-bottom: 0">
                                                <textarea name="given" cols=53 rows=12 wrap=on onFocus="deterCPProtect();" style="width: 100%; border: 1px solid #344270; padding: 2px; font-size:12pt" onpaste="return false;">If you see this something broke.</textarea>
                                    </div>
                                <input style="display:none" type="hidden" name="start" onType="beginTest()">
                                <input style="display:none" type="hidden" name="stop" onEnd="endTest()" >
                            <table type="hidden" id="stProg" style="display:none">
                                                <div type="hidden" id="myBar" style="display:none">
                                                <div type="hidden" id="thisProg" style="display:none"></div>
                                                </div>
                            </table>
                            
                            <tr>
                                <td style="padding: 10px" class="bodya" colspan="2">
                                    <div id="typeArea" style="display:block">
                                        <p style="margin-top: 0; margin-bottom: 0">
                                                <textarea type="hidden" onkeypress="doCheck();" onkeydown="//calcStat()" name="typed" cols=53 rows=12 wrap=on onFocus="deterCPProtect();" style="width: 100%; border: 1px solid #344270; padding: 2px; font-size:12pt" onpaste="return false;"></textarea>
                                    </div>
                                    <div id="afterAction" style="display:none"></div>
                                </td>
                            </tr>
                            <script>
                                randNum = Math.floor((Math.random() * 10)) % intToTestCnt;
                                strToTestType = strToTest[randNum];
                                document.JobOp.given.value = strToTestType;
                                document.JobOp.typed.focus();
                            </script>
                        </table>
                    </FORM>
                </td>
            </tr>
        </table>
        <!-- End Old Code -->

        <!-- Submit Results to Database -->
        <form align: center; method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
            Name: 
            <input type="text" name="name" value="<?php echo $name;?>">
            <input type="submit" name="submit" value="Submit">
        </form>
        
        
        <!-- Footer -->
        <footer class="sst-container sst-padding-16 sst-light-grey">
            <br>
            <h4>FOOTER</h4>
            <p>Powered by <a href="http://sstctf.org" target="_blank">SST CTF</a></p>
            <p>Find project on <a href="http://sstctf.org" target="_blank">GitHub</a></p>
            <br>
            <input disabled id="printB" onclick="window.print();" type="button" value="Print Results" name="printB">
        </footer>
        <!-- End page content -->

        <!-- These scripts are useful if we need to implement navigation in the future. For now deprecated. -->
    </div>
    <script>
        // Get the Sidenav
        var mySidenav = document.getElementById("mySidenav");

        // Get the DIV with overlay effect
        var overlayBg = document.getElementById("myOverlay");

        // Toggle between showing and hiding the sidenav, and add overlay effect
        function sst_open() {
            if (mySidenav.style.display === 'block') {
                mySidenav.style.display = 'none';
                overlayBg.style.display = "none";
            } else {
                mySidenav.style.display = 'block';
                overlayBg.style.display = "block";
            }
        }

        // Close the sidenav with the close button
        function sst_close() {
            mySidenav.style.display = "none";
            overlayBg.style.display = "none";
        }
    </script>
</body>
    
    <?php
        //$message = "PHP LOADED";
        //echo "<script type='text/javascript'>alert('$message');</script>";
        
        echo "<h2>Your Input:</h2>";
        echo $name;
        echo $person;
        echo "\n";

$servername = "localhost";
$username = "www";
$dbname = "typing_test";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "INSERT INTO results (name, net_wpm, gross_wpm, error, accuracy)
VALUES ('$name', '0', '0', '0', '0')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
        
        
        ?>
    
</html>
