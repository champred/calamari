jQuery(function($j) {
    $j(".toggle").click(function(evt) {
        var d = $j(this).attr("name");
        $j(".stuff[name=" + d + "], .toggle[name=" + d + "]").toggle();
    });
});

/** user.php?action=mei_uploads **/
function delete_image(id, authkey) {
    action = 'delete_image';

    $j.get(window.location.pathname, {action: action, auth: authkey, imageid: id},
        function(response) {
            $j('.img_'+id).remove();
    });
}

function confirm_delete(id, authkey) {
	if (confirm('Are you sure you wish to delete this image?') == true) {
		delete_image(id, authkey);
	}

	return false;
}

function mass_image_delete_confirm(authkey) {
    checked_images = $('.image_delete_checkbox:checked');
    image_string = checked_images.length > 1 ? 'these images' : 'this image';

    if (checked_images.length == 0)
        alert("You haven't selected any images to delete!");

    else if (confirm('Are you sure you wish to delete ' + image_string + '?') == true)
        checked_images.each(
            function(index, element){
                delete_image($(element).attr('image_id'), authkey);
        });

    return false;
}
