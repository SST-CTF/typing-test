// TEMPLATE CODE TO BE UPDATED

$page_id = mysql_real_escape_string(html_entities($_POST['page_id']));
$rating = mysql_real_escape_string(html_entities($_POST['rating']));

mysql_query(" UPDATE ratings(vote) VALUES ('$rating') WHERE id = '$page_id' ");