$(document).ready(function() {
	$(".expandtable tr.expandable td.opener").text('+').click(function() {
		var $this = $(this);
		var $expandrow = $this.parent().next("tr.expandrow");
		$expandrow.toggle();
		if ($expandrow.is(":visible")) {
			$this.text("-");
		} else {
			$this.text("+");
		}
	});
});
