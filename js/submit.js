(function saveData($) {
	var person = prompt('Please enter your name', '');
	$.ajax({
		type: 'POST',
		url: './backend.php2',
		data: { name: $("select[name='players']").val() },
		success: function (msg) {
			alert('Data Saved: ' + msg);
		}
	});
}(jQuery));

(function sendWPM($) {
	var person = prompt('Please enter your name', '');
	$.ajax({
		type: 'POST',
		url: './backend.php2',
		data: { wpm: $("select[wpm='players']").val() },
		success: function (msg) {
			alert('Data Saved: ' + msg);
		}
	});
}(jQuery));

(function sendIssues($) {
	var totalTime = prompt('Please enter your name', '');
	$.ajax({
		type: 'POST',
		url: './backend.php2',
		data: { issues: $("select[issues='players']").val() },
		success: function (msg) {
			alert('Data Saved: ' + msg);
		}
	});
}(jQuery));

(function sendAccuracy($) {
	var  = prompt('Please enter your name', '');
	$.ajax({
		type: 'POST',
		url: './backend.php2',
		data: { accuracy: $("select[accuracy='players']").val() },
		success: function (msg) {
			alert('Data Saved: ' + msg);
		}
	});
}(jQuery));
