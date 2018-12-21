function Quick_Preview() {
	$j.post('/ajax.php?action=preview', $j('#quickpostform').serialize(), function(r){
		$j('#quickreplybuttons').html('<input type="submit" value="Submit" class="btn-sub" />&nbsp;<input type="button" value="Editor" onclick="Quick_Edit();" />');
		$j('#quickreplypreview').html(r).show();
		$j('#quickreplytext').hide();
		$j('#bbcode').hide();
	});
}

function Quick_Edit() {
	$j('#quickreplybuttons').html('<input type="submit" value="Submit" class="btn-sub" />&nbsp;<input type="button" value="Preview" onclick="Quick_Preview();" />&nbsp;<input type="button" value="Extend Box" id="extended_btn" onclick="Quick_Extend();" />');
	$j('#quickreplypreview').hide();
	$j('#quickreplytext').show();
	$j('#bbcode').show();
}

function Quick_Extend() {
	document.getElementById('quickpost').rows += 20;
}

function Confirm_Delete() {
	return confirm("OK to delete all system messages?");
}
jQuery(document).ready(function($j){
	var del = null;
	if (null != (del = document.getElementById('system_message_delete'))) {
		del.onclick = function (e) {
			if (!Confirm_Delete()) e.preventDefault();
		};
	}
});
		


jQuery(function($j){
	$j('#quickpostform').submit(function(){
		getElementById('preview_button').disabled = true;
		getElementById('post_button').disabled = true;
		return true;
	});
});
