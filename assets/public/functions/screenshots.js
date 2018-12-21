var extender_loading = false;

function check() {
	if (!extender_loading) {
		if ($j(window).scrollTop() + $j(window).height() > $j('#extend').offset().top) {
			extender_loading = true;
			$j.post(this.href, {lastid:$j('#screenshot_table img:last').attr('alt')}, function(r){
				var x = $j('#screenshot_table', r).html();
				if (x !== null) {
					$j('#screenshot_table').append(x);
					extender_loading = false;
				}
			});
		}
	}
}

function keypressed(e) {
	var keyCode = 0;	
	if (navigator.appName == "Microsoft Internet Explorer") {
		if (!e) {
			var e = window.event;
		}
		if (e.keyCode) {
			keyCode = e.keyCode;
			if ((keyCode == 37) || (keyCode == 39)) {
				window.event.keyCode = 0;
			}
		} else {
			keyCode = e.which;
		}
	}	
	else {
		if (e.which) {
			keyCode = e.which;
		} else {
			keyCode = e.keyCode;
		}
	}
	var prev = $j('#prev-screenshot').attr('href');
	var next = $j('#next-screenshot').attr('href');
	switch (keyCode) {
		case 37: //left			
		    if (prev) {
		    	document.location=prev;
		    	return false;
		    }
		    else {
		    	if (next) return false;
		    }		
		case 39: //right
			if (next) {
		    	document.location=next;
		    	return false;
		    }
		    else {
		    	if (prev) return false;
		    }
	}
}
function enableKeyPressed() {
	document.onkeydown = keypressed;
}
function disableKeyPressed() {
	document.onkeydown = function(){};
}

jQuery(function($j){
	enableKeyPressed();
	$j('input')
		.blur(enableKeyPressed)
		.focus (disableKeyPressed);
});
