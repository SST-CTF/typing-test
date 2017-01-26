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