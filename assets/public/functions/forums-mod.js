// stealth editing
Edit_Form = function(postid) {
    if (location.href.match(/forums\.php/)) {
        boxWidth="80";
    } else {
        boxWidth="50";
    }
	document.getElementById('bar' + postid).cancel = document.getElementById('content' + postid).innerHTML; // wow this is so hackish
	
	document.getElementById('content' + postid).innerHTML =
		'<div id="preview'+postid+'"></div>'+
		'<form id="form'+postid+'" method="post">'+
			'<input type="hidden" name="post" value="'+postid+'" />'+
            '<input type="hidden" name="auth" value="'+CURRENT_USER.authKey+'" />'+
			'<textarea id="editbox'+postid+'" name="body" cols="'+boxWidth+'" rows="10"></textarea><br /><hr>'+
			'<input type="checkbox" id="stealth'+postid+'" name="stealth" value="1" /><label for="stealth'+postid+'">&nbsp;Stealth edit</label>'+
		'</form>';

    document.getElementById('bar' + postid).innerHTML =
        '<input type="button" value="Cancel" onclick="Cancel_Edit('+postid+');" />&nbsp;&nbsp;'+
        '<input type="button" value="Extend Box" onclick="Extend_Edit('+postid+');" /><br><br>';

    $j.get(window.location.pathname, {action: 'get_post', post: postid}, function(response) {
        document.getElementById('editbox' + postid).value = response;
        document.getElementById('bar' + postid).innerHTML =
            '<input type="button" value="Preview" onclick="Preview_Edit('+postid+');" />&nbsp;'+
            '<input class="btn-sub" type="button" value="Submit" onclick="Save_Edit('+postid+');" />&nbsp;'+
            document.getElementById('bar' + postid).innerHTML;
    });
};

// Reverting a deleted post
function Revert(postid, authkey) {
	if (confirm('Are you sure you wish to revert this post?') == true) {
		action = 'revert_delete';
		$j.get(window.location.pathname, {action: action, auth: authkey, postid: postid}, function(response) {
			document.getElementById('post' + postid).style.display = 'none';
		});
	}
}

function quickActions(act) {
    var title = $j('input[name="title"]'), titleName = title.val().replace(/^\[[^\]]+\] /, '');
    var move = $j('select[name="forumid"]');
    if (act === 'implement') {
        title.val('[Implemented] ' + titleName);
        move.val(56);
    } else if (act === 'alr-implement') {
        title.val('[Already Implement] ' + titleName);
        move.val(56);
    } else if (act === 'in-progress') {
        title.val('[In Progress] ' + titleName);
        move.val(62);
    } else if (act === 'reject') {
        title.val('[Won\'t Implement] ' + titleName);
        move.val(57);
    } else {
        return false;
    }
    $j('tr#quickactions').remove();
    $j('h3:contains("Edit thread")').next()[0].submit();
}

function quickActionsBugs(act) {
    var title = $j('input[name="title"]'), titleName = title.val().replace(/^\[[^\]]+\] /, '');
    var move = $j('select[name="forumid"]');
    if (act === 'nonbug') {
        title.val('[Non-Bug] ' + titleName);
        move.val(41);
    } else if (act === 'solved') {
        title.val('[Solved] ' + titleName);
        move.val(41);
    } else if (act === 'nofix') {
        title.val('[Won\'t Fix] ' + titleName);
        move.val(41);
    } else {
        return false;
    }
    $j('tr#quickactions').remove();
    $j('h3:contains("Edit thread")').next()[0].submit();
}

function quickActionsHelp(act) {
    var title = $j('input[name="title"]'), titleName = title.val().replace(/^\[[^\]]+\] /, '');
    var move = $j('select[name="forumid"]');
    if (act === 'solved') {
        title.val(titleName);
        move.val(63);
    } else if (act === 'tutorial') {
        title.val(titleName);
        move.val(15);
    } else {
        return false;
    }
    $j('tr#quickactions').remove();
    $j('h3:contains("Edit thread")').next()[0].submit();
}

$( document ).ready(function() {
    if ($j('a:contains("Suggestions")').filter(function(){ return this.textContent === 'Suggestions' }).length > 0)
        $j('h3:contains("Edit thread")').next().find('table').prepend('<tr id="quickactions" title="quick actions english bad at verily"><td>Quick actions</td><td><input type="button" value="Implement" onclick="quickActions(\'implement\'); return false;"> <input type="button" value="Already Implement" onclick="quickActions(\'alr-implement\'); return false;"> <input type="button" value="In Progress" onclick="quickActions(\'in-progress\'); return false;"> <input type="button" value="Reject" onclick="quickActions(\'reject\'); return false;"></td></tr>');

    if ($j('a:contains("Bugs >_<")').filter(function(){ return this.textContent === 'Bugs >_<' }).length > 0)
        $j('h3:contains("Edit thread")').next().find('table').prepend('<tr id="quickactions" title="quick actions english bad at verily"><td>Quick actions</td><td><input type="button" value="Non-Bug" onclick="quickActionsBugs(\'nonbug\'); return false;"> <input type="button" value="Solved" onclick="quickActionsBugs(\'solved\'); return false;"> <input type="button" value="Won\'t Fix" onclick="quickActionsBugs(\'nofix\'); return false;"></td></tr>');

    if ($j('a:contains("Help")').filter(function(){ return this.textContent === 'Help' }).length > 0)
        $j('h3:contains("Edit thread")').next().find('table').prepend('<tr id="quickactions" title="quick actions english bad at verily"><td>Quick actions</td><td><input type="button" value="Solved" onclick="quickActionsHelp(\'solved\'); return false;"> <input type="button" value="Tutorial" onclick="quickActionsHelp(\'tutorial\'); return false;"></td></tr>');
});

// post mass-deletion
jQuery(function($j){
	$j('#massdel_posts').click(function(){
		var posts = [];
		$j('.mass_del:checked').each(function(){posts.push(this.value)});
		if (!posts.length) {
			alert('Mou! You should select at least one post to delete, ne~?');
		} else {
			$j.post('forums.php', {action: 'mass_del', posts: posts.join(','), reason: $('#massdel_reason').val()}, function(){window.location.reload()});
		}
	});
	$j('#massmove_posts').click(function(){
		var posts = [];
		var threadID = $j("#new_threadid").val();
		$j('.mass_del:checked').each(function(){posts.push(this.value)});
		if (!posts.length) {
			alert('Mou! If you aren\' moving any posts, why click the button?');
		} else if(!threadID){
			alert('Demo.. You want them gone from the site?');
		} else {
			$j.post('forums.php', {action: 'mass_move', posts: posts.join(','), new_threadid: threadID}, function(){window.location.reload()});
		}
	});
});
