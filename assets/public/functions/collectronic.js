
String.prototype.startsWith = function(what) {
	return (this.indexOf(what) === 0);
}
var Collectronic = function(root, artist_id, known_format_bitrate) {
	var $root = $(root);
	var collectronic = this;

	var selectedFormats = [];

	var $formatList = $root.find(".ct_format_list");
	var $preferList = $root.find(".ct_prefer");
	$preferList.sortable({
		scroll: false
	}).disableSelection();

	$root.find(".ct_format option").each(function() {
		var $this = $(this);

		var encoding = $this.attr('data-encoding');
		if (!encoding) return; // probably the first one

		// is this a known format for this artist?
		if (!known_format_bitrate.hasOwnProperty(encoding)) {
			// no, it isn't
			console.log('kfb does not contain encoding', known_format_bitrate, encoding);
			$this.remove();
			return;
		}

		if (!$this.attr('data-bitrate')) return; // we're done

		var allowedBitrates = known_format_bitrate[encoding];
		var myBitrateMask = $this.attr('data-bitrate');
		var myBitrates = myBitrateMask.split('|');
		// this is the tricky bit
		// do any of the bitrates in allowedBitrates match the mask in data-bitrate?
		for (var i = 0; i < myBitrates.length; i++) {
			var myBitrate = myBitrates[i];
			if (allowedBitrates.hasOwnProperty(myBitrate) && allowedBitrates[myBitrate]) return;
		}

		// didn't match
		$this.remove();
		return;
	});

	var beingSillyTimer = -1;
	var dontBeSilly = function(reason) {
		if (beingSillyTimer !== -1) clearTimeout(beingSillyTimer);
		$(".ct_silly").html(reason + "<br>");

		$(".ct_silly").removeClass("hide").show();
		beingSillyTimer = setTimeout(function() {
			$(".ct_silly").hide(400);
		}, 2500);
	};

	var $formatSelect = $root.find(".ct_format");
	$formatSelect.change(function() {
		var nowSelected = this.item(this.selectedIndex);
		this.selectedIndex = 0;
		var $nowSelected = $(nowSelected);
		var querySelector = {};

		var specificity = $nowSelected.attr('data-specificity');
		for (var i = 0; i < selectedFormats.length; i++) {
			if (selectedFormats[i].specificity == specificity) return; // heh, no
		}

		cleanUpSelectedFormats();

		if ($nowSelected.attr('data-encoding'))
			querySelector.encoding = $nowSelected.attr('data-encoding');
		if ($nowSelected.attr('data-bitrate'))
			querySelector.bitrate = $nowSelected.attr('data-bitrate');
		querySelector.specificity = $nowSelected.attr('data-specificity');
		querySelector.text = $nowSelected.text();

		selectedFormats.push(querySelector);

		var removed = cleanUpSelectedFormats();
		if (removed > 0) {
			dontBeSilly("Don't be silly! You can't put more specific formats after less specific ones!");
		}

		collectronic.rebuildFormatList();
	});

	var cleanUpSelectedFormats = function() {
		// rules:
		// more specific things cannot go after less specific ones
		var toRemove = [];
		var hadSoFar = [];
		for (var i = 0; i < selectedFormats.length; i++) {
			var formatUnderTest = selectedFormats[i].specificity;
			for (var n = 0; n < i; n++) {
				var formatTestAgainst = selectedFormats[n].specificity;
				if (formatTestAgainst == formatUnderTest) {
					// added the same thing twice
					toRemove.push(i);
				}
				else if (formatTestAgainst.length < formatUnderTest.length && formatUnderTest.startsWith(formatTestAgainst)) {
					// WOAH
					// looks like
					// formatUnderTest: MP3 / CBR / 320
					// formatTestAgainst: MP3
					// so we have to remove formatUnderTest
					toRemove.push(i);
				}
			}
		}
		var removed = 0;
		for (var i = 0; i < toRemove.length; i++) {
			var removeIndex = toRemove[i];
			selectedFormats.splice(removeIndex - removed, 1);
			removed++;
		}
		return removed;
	};

	this.rebuildFormatList = function() {
		cleanUpSelectedFormats();

		$formatList.empty();
		for (var i = 0; i < selectedFormats.length; i++) {
			var $x = $("<li><span class=\"ct_format_span\"></span><a href=\"#\" class=\"ct_format_delete\" style=\"float:right\">[x]</a></li>");
			$x.find("span.ct_format_span").text(selectedFormats[i].text);
			$x.find(".ct_format_delete").attr('data-index', i).click(function(e) {
				e.preventDefault();
				var $this = $(this);
				selectedFormats.splice($this.attr('data-index'), 1);
				collectronic.rebuildFormatList();
			});
			$x.appendTo($formatList);
		}
	};

	$(".ct_submit").click(function() {
		// hrm
		cleanUpSelectedFormats();
		if (selectedFormats.length == 0) {
			// they're being silly
			dontBeSilly("You've got to pick some formats you'd like your torrents in first!");
			return;
		}

		// now we need to build our output
		var preferList = [];

		var sendData = {};
		sendData.formats = selectedFormats;
		sendData.prefer = $preferList.sortable("toArray", {'attribute': 'data-value'});
		sendData.not_guest = ($root.find(".ct_not_guest").is(':checked') ? true : false);

		var $form = $("<form action=\"artist.php?id="+artist_id+"&amp;auth="+CURRENT_USER.authKey+"\" method=\"POST\"><input class=\"data\" type=\"hidden\" name=\"data\"><input type=\"hidden\" name=\"action\" value=\"download\"></form>");
		$form.appendTo(document.body);
		$form.find('input.data').val(JSON.stringify(sendData));
		$form.submit();
	});
};