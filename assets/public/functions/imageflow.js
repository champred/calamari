jQuery(function($) {
	$(".slider").jCarouselLite({
		btnNext: ".next",
		btnPrev: ".prev",
		visible: 6
	});
	$(".slider").find('li').each(function() {
		$(this).height(100);
	});
});
