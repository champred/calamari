$j(document).ready(function () {

	$j('.reg-channel').attr('title', 'Registered Channel. This channel can only be joined manually.');
	$j('.ext-channel').attr('title', 'Unofficial Channel. This channel can only be joined manually.');
	$j('.channel').attr('title', 'Official Channel. This channel can only be joined with Satsuki.');

	$j('.channel, .reg-channel, .ext-channel').click(function (e) {
		var $this = $j(this), check = $this.find('.checkbox');

		if (check.hasClass('checked')) {
			if ($this.hasClass('channel') || $this.hasClass('reg-channel')) {
				if ($j('.channel .checkbox.checked, .reg-channel .checkbox.checked').length < 2) {
					$j('.warnbox').html('<br>You must select at least one official or registered channel to be able to authenticate with Satsuki!<br>' +
										'(You can still just join any registered or unofficial channel without authenticating though)<br>');
					$j('#doneirckey').hide();
				}
			}
			if ($this.hasClass('ext-channel') || $this.hasClass('reg-channel')) {
				if ($j('.ext-channel .checkbox.checked, .reg-channel .checkbox.checked').length < 2) {
					$j('#joinmsg').hide();
				}
			}
			check.removeClass('checked');
		} else {
			if ($this.hasClass('channel') || $this.hasClass('reg-channel')) {
				$j('.warnbox').html('');
				if ($j('#noirckey:visible').length < 1)
					$j('#doneirckey').show();
			}
			if ($this.hasClass('ext-channel') || $this.hasClass('reg-channel')) {
				$j('#joinmsg').show();
			}
			check.addClass('checked');
		}

		$j('#authchans').text(
			$j('.channel .checkbox.checked').parent().next().map(function () {
				return this.textContent;
			}).toArray().join(',')
		);
		$j('#extchans').text(
			$j('.ext-channel .checkbox.checked, .reg-channel .checkbox.checked').parent().next().map(function () {
				return this.textContent;
			}).toArray().join(',')
		);
	});
});
