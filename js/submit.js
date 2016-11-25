            (function saveData($) {
                var person = prompt("Please enter your name", "");
                $.ajax(
                {
                    type: "POST",
                    url: "http://sstctf.org/typing-test/backend.php",
                    data: { name: $("select[name='players']").val()},
                success:function( msg ) {
                alert( "Data Saved: " + msg );
                }
                });
            })(jQuery); 