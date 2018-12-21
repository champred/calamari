var clickTimeout = false;

function renumberOrders() {
	var i = 0;
	$j(":hidden[name='order[]']", $j('.epEdit')).each(function() {
		$j(this).val(i++);
	});
}

function sortByField(sortingField, descending) {
	var elTable = $j('#episodeListTable');
	var inputFields = $j('.epEdit input.' + sortingField, elTable).get();

	var compare = function(a, b, d) {
		a = $j(a).val();
		b = $j(b).val();

		function isNumeric(input) {
			return (input - 0) == input && input.length > 0;
		}

		var dateRegExp = /^([0-9]{1,4}[-\/]){2}[0-9]{1,4}$/;
		var floatRegExp = /^([0-9\, ]+)([,\.][0-9]+)?$/;

		if(a.match(dateRegExp) && b.match(dateRegExp)) {
			a = Date.parse(a.replace(/-/g, '/'));
			b = Date.parse(b.replace(/-/g, '/'));
		} else if(a.match(floatRegExp) && b.match(floatRegExp)) {
			a = parseFloat(a);
			b = parseFloat(b);
		}
		return d ? a > b : a < b;
	}

	$j('#episodeListTable').fadeOut('fast', function() {
		for(var i=1; i < inputFields.length; i++) {
			for(var j=i; j > 0 && compare(inputFields[j], inputFields[j-1], descending); j--) {
				var epEdit = $j(inputFields[j]).parents('tr');
				var prevEpEdit = $j(inputFields[j-1]).parents('tr');

				var summaryEditButton = epEdit.next(), summaryEdit = summaryEditButton.next();

				epEdit.insertBefore(prevEpEdit);

				summaryEditButton.insertAfter(epEdit);
				summaryEdit.insertAfter(summaryEditButton);

				var temp = inputFields[j];
				inputFields[j] = inputFields[j-1];
				inputFields[j-1] = temp;
			}
		}
		$j('#episodeListTable').fadeIn('fast');
	});
}

function orderMover(sRef, extremes) {
	if(clickTimeout)
		clearTimeout(clickTimeout);
	var epEdit = $j(sRef).parent(), summaryEditButton = epEdit.next(), summaryEdit = summaryEditButton.next();
	var orderMove = $j.trim($j(sRef).text());
	doMoveOrder = function() {

	if(orderMove == 'Up' && epEdit.prevAll('.epEdit').length > 0) {
		var prevEpEdit = epEdit.prevAll('.epEdit' + (extremes ? ':last' : ':first'))

		$j('td', prevEpEdit).fadeOut('fast');

		$j('td', epEdit).fadeOut('fast', function() {
			epEdit.insertBefore(prevEpEdit);

			$j('td', epEdit).fadeIn('fast');
			$j('td', prevEpEdit).fadeIn('fast');

			summaryEditButton.insertAfter(epEdit);
			summaryEdit.insertAfter(summaryEditButton);
		});
	} else if(orderMove == 'Down' && epEdit.nextAll('.epEdit').length > 0) {
		var nextEpEdit = epEdit.nextAll('.epEdit' + (extremes ? ':last' : ':first' ));
		var nextEpSummary = $j(nextEpEdit).nextAll('.epSummaryEdit:first');

		$j('td', nextEpEdit).fadeOut('fast');

		$j('td', epEdit).fadeOut('fast', function() {
			epEdit.insertAfter(nextEpSummary);

			$j('td', epEdit).fadeIn('fast');
			$j('td', nextEpEdit).fadeIn('fast');

			summaryEditButton.insertAfter(epEdit);
			summaryEdit.insertAfter(summaryEditButton);
		});
	} else
		return;
	renumberOrders();
	};
	if(extremes)
		doMoveOrder();
	else
		clickTimeout = setTimeout("doMoveOrder()", 300);
}

function autofill() {
	var ann_url = $j('#ann_link').val();
	var anid = ann_url.match(/id=([0-9]+)/)[1];

	if(anid) {
		$j('.curtain').css('display', 'block');
		$j('#loader').css('display', 'block');
		$j('#autofill').attr("disabled", "true");
		$j.get('/xhr/scraper/ann/episodes', {id: anid}, function(episodeList) {
			if(episodeList.length > 0) {
				$j('.deleteButton').click();
				$j.each(episodeList, function(k, epInfo) {

					$j('.epAdd input.episode_type').val(epInfo['number']);
					$j('.epAdd input.episode_title').val(epInfo['main_title']);
					$j('.epAdd input.episode_title2').val(epInfo['jap_title']);
					$j('.epAdd input.aired_date').val(epInfo['date']);

					$j('.epAdd #createNewEp').click();
				});
				showLoader('complete');
			} else {
//				alert("This series has no listed episodes");
				$j('#autofill').removeAttr("disabled");
				showLoader('incomplete');
			}
		});
	}
}

function editEpisodes() {
	renumberOrders();
	var epEdits = $j('.epEdit :input, .epSummaryEdit textarea, #groupID');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('torrents.php?action=takeeditepisodes', epEdits.serialize(), function(data) { if(data.indexOf('complete') == 0) { showLoader('complete'); } else if(data.indexOf('nochange')) { showLoader("complete"); } else { showLoader('incomplete'); } });
}

function addEpisode() {
	var episodeEdit = $j('.epAdd').clone();
	var summaryEditButton = $j('.editSummaryButton:first').clone();
	var summaryEdit = $j('.epSummaryAdd').clone();

	$j(summaryEdit).removeClass('epSummaryAdd');
	$j(summaryEdit).addClass('epSummaryEdit');
	$j(summaryEdit).css('display', 'none');

	$j(episodeEdit).removeClass('epAdd');
	$j(episodeEdit).addClass('epEdit');

	$j(summaryEditButton).removeClass('hidden');

	$j(summaryEdit).fadeOut();

	$j('#orderPlaceholder', summaryEdit).remove();

	$j('orderMover', summaryEdit).css('display', 'block');

	$j('.epAdd input[type="text"]').val('');
	$j('.epSummaryAdd td textarea').val('');

	$j('.tableSpacer:first').before(episodeEdit);
	$j('.tableSpacer:first').before(summaryEditButton);
	$j('.tableSpacer:first').before(summaryEdit);

	$j('.epEdit:last #createNewEp').replaceWith('<input type="submit" class="deleteButton" name="submit" value="Delete" />');
	setTimeout("reattachEvents()", 10);
}

function reattachEvents() {
	$j('.editSummaryButton, #dateHeader, #epNumHeader, .orderMoveUp, .orderMoveDown, #autofill, .deleteButton, #createNewEp, #editEpisodes').unbind();

	$j('.editSummaryButton').click(function() {
		var summaryTR = $j(this).next();
		$j(summaryTR).toggle();
		$j('td:first-child', this).html($j(summaryTR).is(':visible') ? '-' : '+');
	});


	var headerClickSort = function() {
		var sortOrder = $j(":input[name=orderDirection]", this).val() == 'true';

		$j("span[name=orderDirectionIndicator]", this).text(sortOrder ? '^' : 'v');

		$j(":input[name=orderDirection]", this).val(!sortOrder);

		var sortField = $j(":input[name=orderField]", this);
		sortByField(sortField.val(), sortOrder);
	};

	$j('#dateHeader').click(headerClickSort);
	$j('#epNumHeader').click(headerClickSort);

	$j('.orderMoveUp, .orderMoveDown').dblclick(function() { orderMover(this, true); });
	$j('.epEdit .orderMoveUp, .epEdit .orderMoveDown').click(function() { orderMover(this, false); });

	$j('#autofill').click(function() { autofill(); return false; });

	$j('.deleteButton').click(function() {
		var items = $j($j(this).parents('tr')).nextAll('.epSummaryEdit:first, .editSummaryButton:first').andSelf();

		$j(items).each(function(k, v) {
			$j(v).fadeOut('fast', function() {
				$j(v).remove();
			});
		});
		return false;
	});

	$j('.clearEps').click(function() {
		$j('.deleteButton').click();
		return false;
	});

	$j('#createNewEp').click(function() { addEpisode(); return false; });

	$j('.editEpisodes').click(function() { editEpisodes();});
	renumberOrders();
}

$j(document).ready(reattachEvents);

