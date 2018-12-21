function updateOptions() {
	// Since we're dealing with such small amounts of text, we're going to store it all in javascript (Yes. Punish me.)
	if($j('#siteselect').val() == "mal"){
		var imP = "To export your viewed list from MAL visit <a href=\"http:\/\/myanimelist.net/panel.php?go=export\">the export page</a>. After downloading be sure to un(g)zip the file. Now you've got the XML to be uploaded to AB.";
		var imC = '<input name="xmlfile" id="xmlfile" size="50" type="file">';
	}else if($j('#siteselect').val() == "anidb"){
		var imP = "To export your viewed list from AniDB visit <a href=\"http:\/\/anidb.net/perl-bin/animedb.pl?show=export\">the export page</a>. Select the export template \"xml-mystatus\". AniDB takes some time for the export to happen, so you might have to wait 24-48 hours. After you've gotten it, unzip the file and upload the mylist.xml.";
		var imC = '<input name="xmlfile" id="xmlfile" size="50" type="file">';
	}else if($j('#siteselect').val() == "ap"){
		// Anime-Planet
		var imP = 'All which is required to gather data from Anime-Planet is your username on Anime-Planet.';
		var imC = '<input name="profile" type="text" id="profile" size="50"/>';
	}
	$j('#importp').html(imP);
	$j('#importcontent').html(imC);	
}

function reattachEvents() {
	$j('.deleteButton').click(function() {
		var items = $j($j(this).parents('tr')).andSelf();

		$j(items).each(function(k, v) {
			$j(v).fadeOut('fast', function() {
				$j(v).remove();
			});
		});
		return false;
	});
}
$j(document).ready(reattachEvents);
