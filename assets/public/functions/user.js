function Preview(container, body, attr) {
    container = $j(container);
    containerClone = container.clone();
    containerClone.html('<div></div><br /><input type="button" value="Editor" onclick="$j(this.parentElement).prev().show(); $j(this.parentElement).remove();" />');
    previewDiv = containerClone.find('div');
    previewDiv.attr(attr);
    previewDiv.attr('style', previewDiv.attr('style')+';border:1px solid #cbcbcb;')


    $j.post('/ajax.php?action=preview', 'body=' + encodeURIComponent(body), function(response) {
        previewDiv.html(response);
        container.after(containerClone);
        container.hide();
    });
}

function loadImagePromise(src, callback)
{
    /*var img = new Image();
    img.onload = callback;
    img.onerror = callback;
    img.src = src;*/
}
function verifyAvatar() {
    /*var src = $j('#avatar').val();
    if(src !== '')
    {
        loadImagePromise($j('#avatar').val(), function() {
            if(this.width <= 150 && this instanceof HTMLImageElement) {
                $j('#userform').attr('onsubmit', 'return formVal();');
                $j('#userform').submit();
            } else if(this.width > 150 && this instanceof HTMLImageElement) {
                alert('Avatar width '+this.width+'px exceeds maximum of 150px');
            } else {
                $j('#userform').attr('onsubmit', 'return formVal();');
                $j('#userform').submit();
            }
        });
        return false;
    }*/
    $j('#userform').attr('onsubmit', 'return formVal();');
    $j('#userform').submit();
}

$j(function () {
    var stuff = $j('#tabs > div');

    $j('ul.ue_tabs a').click(function () {
        stuff.hide().filter(this.hash).show();
        $j('ul.ue_tabs a').removeClass('selected');
        $j(this).addClass('selected');
        return false;
    }).filter(':first').click();
});

$j(document).ready(function () {
	$j('ul.ue_tabs a').filter(function () {
		if (this.getAttribute('href') === window.location.hash) return true;
	}).click();
	setTimeout(function () {
		if (window.location.search.match(/action=edit/)) window.scrollTo(0, 0);
	}, 1);
});
