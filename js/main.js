// ---------------------------------------------------------------------------
// TypingTest - JavaScript Application
// Copyright 2015,  <Otakar Andrysek>
// Copyright 2016-2017,  <SST CTF>
// Usage: launch locally or remotely on a client
// Revision history:
// 2015-02-15 Created by first build ALPHA .1
// 2015-02-16 Tested ALPHA .2
// 2015-02-16 Bug-Fixed ALPHA .23
// 2016-11-03 Cleaned up code again
// ---------------------------------------------------------------------------

//Holds whether or not we have already started the first typing test or now
//	True = The test has already started
//	False = The test hasn't started yet
var hasStarted = false;

//strToTest is an array object that holds various strings to be used as the base typing test
//	- If you update the array, be sure to update the intToTestCnt with the number of ACTIVE testing strings
var intToTestCnt = 1;
var strToTest = new Array("ERROR 2");

var getOnPaste = function(field){
  if (typeof field.onpaste !== "function" && !!field.getAttribute("onpaste")) {
                field.onpaste = function () {
                        field.getAttribute("onpaste");
                };
            }

            if (typeof field.onpaste === "function") {
                var oninput = field.oninput;

                field.oninput = function () {
                    if (typeof oninput === "function") {
                        oninput.apply(this, arguments);
                    }

                    if (typeof this.previousValue === "undefined") {
                        this.previousValue = this.value;
                    }

                    var pasted = (Math.abs(this.previousValue.length - this.value.length) > 1 && this.value !== "");

                    if (pasted && !this.onpaste.apply(this, arguments)) {
                        this.value = this.previousValue;
                    }

                    this.previousValue = this.value;
                };

                if (field.addEventListener) {
                    field.addEventListener("input", field.oninput, false);
                } else if (field.attachEvent) {
                    field.attachEvent("oninput", field.oninput);
                }
            }
};

function readTextFile(file, arrayData)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status === 0)
            {
                var allText = rawFile.responseText;
                strToTest = new Array(allText);
            }
        }
    };
    rawFile.send(null);
    return arrayData;
}

readTextFile("file.txt");

var strToTestType = "";

var checkStatusInt;

//General functions to allow for left and right trimming / selection of a string
function Left(str, n) {
    if (n <= 0)
        return "";
    else if (n > String(str).length)
        return str;
    else
        return String(str).substring(0, n);
}

function Right(str, n) {
    if (n <= 0)
        return "";
    else if (n > String(str).length)
        return str;
    else {
        var iLen = String(str).length;
        return String(str).substring(iLen, iLen - n);
    }
}

//beginTest Function/Sub initializes the test and starts the timers to determine the WPM and Accuracy
function beginTest() {
    //We're starting the test, so set the variable to true
    hasStarted = true;

    //Generate a date value for the current time as a baseline
    day = new Date();

    //Count the number of valid words in the testing baseline string
    cnt = strToTestType.split(" ").length;

    //Set the total word count to the number of valid words that need to be typed
    word = cnt;
    //Set the exact time of day that the testing has started
    startType = day.getTime();

    //Disable the printing button (if used, in this download it's not included)
    document.getElementById("printB").disabled = true;

    calcStat();

    //Initialize the testing objects by setting the values of the buttons, what to type, and what is typed
    //document.JobOp.start.value = "-- Typing Test Started --";
    document.JobOp.start.disabled = true;
    document.JobOp.given.value = strToTestType;
    document.JobOp.typed.value = "";

    //Apply focus to the text box the user will type the test into
    document.JobOp.typed.focus();
    document.JobOp.typed.select();
}

//User to deter from Copy and Paste, also acting as a testing protection system
//	Is fired when the user attempts to click or apply focus to the text box containing what needs to be typed
function deterCPProtect() {
    document.JobOp.typed.focus();
}

// Register onpaste on inputs and textareas in browsers that don't natively support it.
(function stopCP () {
    var onload = window.onload;

    window.onload = function () {
        if (typeof onload === "function") {
            onload.apply(this, arguments);
        }

        var fields = [];
        var inputs = document.getElementsByTagName("input");
        var textareas = document.getElementsByTagName("textarea");

        for (var i = 0; i < inputs.length; i++) {
            fields.push(inputs[i]);
        }

        for (i = 0; i < textareas.length; i++) {
            fields.push(textareas[i]);
        }

        for (i = 0; i < fields.length; i++) {
            var field = fields[i];
          getOnPaste(field);
        }
    };
})();

//The final call to end the test -- used when the user has completed their assignment
//	This function/sub is responsible for calculating the accuracy, and setting post-test variables
function endTest() {
    //Clear the timer that tracks the progress of the test, since it's complete
    clearTimeout(checkStatusInt);

    //Initialize an object with the current date/time so we can calculate the difference	
    eDay = new Date();
    endType = eDay.getTime();
    totalTime = ((endType - startType) / 1000);

    //Calculate the typing speed by taking the number of valid words typed by the total time taken and multiplying it by one minute in seconds (60)
    //***** 1A *************************************************************************************************************************** 1A *****
    //We also want to disregard if they used a double-space after a period, if we didn't then it would throw everything after the space off
    //Since we are using the space as the seperator for words; it's the difference between "Hey.  This is me." versus "Hey. This is me." and
    //Having the last three words reporting as wrong/errors due to the double space after the first period, see?
    //*********************************************************************************************************************************************
    wpmType = Math.round(((document.JobOp.typed.value.replace(/ {2}/g, " ").split(" ").length) / totalTime) * 60);

    //Set the start test button label and enabled state
    //document.JobOp.start.value = ">> Re-Start Typing Test <<";
    //document.JobOp.start.disabled = false;

    //Flip the starting and stopping buttons around since the test is complete
    document.JobOp.stop.style.display = "none";
    document.JobOp.start.style.display = "block";

    //Declare an array of valid words for what NEEDED to be typed and what WAS typed
    //Again, refer to the above statement on removing the double spaces globally (1A)	
    var typedValues = document.JobOp.typed.value.replace(/ {2}/g, " ");
    var neededValues = Left(document.JobOp.given.value, typedValues.length).replace(/  /g, " ").split(" ");
    typedValues = typedValues.split(" ");

    //Disable the area where the user types the test input
    document.JobOp.typed.disabled = true;

    //Declare variable references to various statistical layers
    var tErr = document.getElementById("stat_errors");
    var tscore = document.getElementById("stat_score");
    var tStat = document.getElementById("stat_wpm");
    var tTT = document.getElementById("stat_timeleft");

    var tArea = document.getElementById("TypeArea");
    var aArea = document.getElementById("AfterAction");
    var eArea = document.getElementById("expectedArea");

    //Initialize the counting variables for the good valid words and the bad valid words
    var goodWords = 0;
    var badWords = 0;

    //Declare a variable to hold the error words we found and also a detailed after action report
    var errWords = "";
    var aftReport = "<b>Detailed Summary:</b><br><font color=\"DarkGreen\">";

    //Enable the printing button
    document.getElementById("printB").disabled = false;

    //Loop through the valid words that were possible (those in the test baseline of needing to be typed)
    var str;
    for (var i = 0; i < word; i++) {
        //If there is a word the user typed that is in the spot of the expected word, process it
        if (typedValues.length > i) {
            //Declare the word we expect, and the word we recieved
            var neededWord = neededValues[i];
            var typedWord = typedValues[i];

            //Determine if the user typed the correct word or incorrect
            if (typedWord !== neededWord) {
                //They typed it incorrectly, so increment the bad words counter
                badWords = badWords + 1;
                errWords += typedWord + " = " + neededWord + "\n";
                aftReport += "<font color=\"Red\"><u>" + neededWord + "</u></font> ";
            } else {
                //They typed it correctly, so increment the good words counter
                goodWords = goodWords + 1;
                aftReport += neededWord + " ";
            }
        } else {
            // They didn't even type this word, so increment the bad words counter
            // Update: We don't want to apply this penalty because they may have chosen to end the test
            // and we only want to track what they DID type and score off of it.
            // badWords = badWords + 1;
        }
    }

    //Finalize the after action report variable with the typing summary at the beginning (now that we have the final good and bad word counts)
    aftReport += "</font>";
    aftReport = "<b>Typing Summary:</b><br>You typed " + (document.JobOp.typed.value.replace(/ {2}/g, " ").split(" ").length) + " words in " + totalTime + " seconds, a speed of about " + wpmType + " words per minute.\n\nYou also had " + badWords + " errors, and " + goodWords + " correct words, giving scoring of " + ((goodWords / (goodWords + badWords)) * 100).toFixed(2) + "%.<br><br>" + aftReport;

    //Set the statistical label variables with what we found (errors, words per minute, time taken, etc)	
    tErr.innerText = badWords + " Errors";
    tStat.innerText = (wpmType - badWords) + " WPM / " + wpmType + " WPM";
    tTT.innerText = totalTime.toFixed(2) + " sec. elapsed";

    //Calculate the accuracy score based on good words typed versus total expected words -- and only show the percentage as ###.##
    tscore.innerText = ((goodWords / (goodWords + badWords)) * 100).toFixed(2) + "%";

    //Flip the display of the typing area and the expected area with the after action display area
    aArea.style.display = "block";
    tArea.style.display = "none";
    eArea.style.display = "none";

    //Set the after action details report to the summary as we found; and in case there are more words found than typed
    //Set the undefined areas of the report to a space, otherwise we may get un-needed word holders
    aArea.innerHTML = aftReport.replace(/undefined/g, " ");

    //Notify the user of their testing status via a JavaScript Alert
    //Update: There isn't any need in showing this popup now that we are hiding the typing area and showing a scoring area
    //alert("You typed " + (document.JobOp.typed.value.split(" ").length) + " words in " + totalTime + " seconds, a speed of about " + wpmType + " words per minute.\n\nYou also had " + badWords + " errors, and " + goodWords + " correct words, giving scoring of " + ((goodWords / (goodWords+badWords)) * 100).toFixed(2) + "%.");
}

//calcStat is a function called as the user types to dynamically update the statistical information
function calcStat() {
    //If something goes wrong, we don't want to cancel the test -- so fallback error proection (in a way, just standard error handling)
    try {
        //Reset the timer to fire the statistical update function again in 250ms
        //We do this here so that if the test has ended (below) we can cancel and stop it
        checkStatusInt = setTimeout(calcStat, 250);

        //Declare reference variables to the statistical information labels
        var tStat = document.getElementById("stat_wpm");
        var tTT = document.getElementById("stat_timeleft");

        var tProg = document.getElementById("stProg");
        var tProgt = document.getElementById("thisProg");

        var tArea = document.getElementById("TypeArea");
        var aArea = document.getElementById("AfterAction");
        var eArea = document.getElementById("expectedArea");

        //Refer to 1A (above) for details on why we are removing the double space
        var thisTyped = document.JobOp.typed.value.replace(/  /g, " ");

        //Create a temp variable with the current time of day to calculate the WPM
        eDay = new Date();
        endType = eDay.getTime();
        totalTime = ((endType - startType) / 1000);

        //Calculate the typing speed by taking the number of valid words typed by the total time taken and multiplying it by one minute in seconds (60)
        wpmType = Math.round(((thisTyped.split(" ").length) / totalTime) * 60);

        //Set the words per minute variable on the statistical information block
        tStat.innerText = wpmType + " WPM";

        //The test has started apparantly, so disable the stop button
        document.JobOp.stop.disabled = false;

        //Flip the stop and start button display status
        document.JobOp.stop.style.display = "block";
        document.JobOp.start.style.display = "none";

        //Calculate and show the time taken to reach this point of the test and also the remaining time left in the test
        //Colorize it based on the time left (red if less than 5 seconds, orange if less than 15)
        if (Number(3600 - totalTime) < 5) {
            tTT.innerHTML = "<font color=\"Red\">" + String(totalTime.toFixed(2)) + " sec. / " + String(Number(3600 - totalTime).toFixed(2)) + " sec.</font>";
        } else {
            if (Number(3600 - totalTime) < 15) {
                tTT.innerHTML = "<font color=\"Orange\">" + String(totalTime.toFixed(2)) + " sec. / " + String(Number(3600 - totalTime).toFixed(2)) + " sec.</font>";
            } else {
                tTT.innerHTML = String(totalTime.toFixed(2)) + " sec. / " + String(Number(3600 - totalTime).toFixed(2)) + " sec.";
            }
        }

        //Determine if the user has typed all of the words expected
        if ((((thisTyped.split(" ").length) / word) * 100).toFixed(2) >= 100) {
            tProg.width = "100%";
            tProgt.innerText = "100%";
        } else {
            //Set the progress bar with the exact percentage of the test completed
            tProg.width = String((((thisTyped.split(" ").length) / word) * 100).toFixed(2)) + "%";
            tProgt.innerText = tProg.width;
        }

        //Determine if the test is complete based on them having typed everything exactly as expected
        if (thisTyped.value === document.JobOp.given.value) {
            endTest();
        }

        //Determine if the test is complete based on whether or not they have typed exactly or exceeded the number of valid words (determined by a space)
        if (word <= (thisTyped.split(" ").length)) {
            endTest();
        }

        //Check the timer; stop the test if we are at or exceeded 3600 seconds
        if (totalTime >= 3600) {
            endTest();
        }

        //Our handy error handling
    } catch (e) {var why = function(){};}
}

// Takes name from prompt, ready to store into MYSQL
function myFunction() 
{
    var person = prompt("Please enter your name", "");
    // Profanity Filter (if there is a better way to do this LMK)
    if (
        person.search("ota") === - 1 && 
        person.search("Ota") === - 1 && 
        person.search("fruhwirth") === - 1 && 
        person.search("Fruhwirth") === - 1 && 
        person.search("morales") === - 1 && 
        person.search("Morales") === - 1 && 
        person.search("cena") === - 1 && 
        person.search("Cena") === - 1
       ) 
    {
        alert("Invalid option");
    }
    
    else
    {
        // SQL
        // MAGIC
        // GOES
        // HERE
    }
}

// Simply does a check on focus to determine if the test has started
function doCheck() {
    if (hasStarted === false) {
        // The test has not started, but the user is typing already -- maybe we should start?
        beginTest(); // Yes, we should -- consider it done!
    }
}
