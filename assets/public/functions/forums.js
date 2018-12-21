function Quote(postid, username, surround) {
    $j.ajax({
        url: window.location.pathname,
        data: {action: 'get_post', post: postid},
        success: function(response) {
            if (window.location.pathname === '/forums.php') var type = '#';
            if (window.location.pathname === '/user.php') var type = '*';
            if (window.location.pathname === '/torrents.php') var type = '-1';
            if (window.location.pathname === '/torrents2.php') var type = '-2';
            var def = (type != null) ? type + postid : username;
            response = removeQuotes(response);
            var quoteText = '[quote=' + def + ']' + response + '[/quote]';
            if (surround && surround.length > 0) quoteText = '[' + surround + ']' + quoteText + '[/' + surround + ']';
            insert_text(quoteText, '');
        },
        dataType: 'html'
    });
}

function removeQuotes(text){
    quoteStartRegex = /\[quote.*\]/ig;
    quoteEndRegex = /\[\/quote\]/ig
    function findEndQuote(text, ignore, pos) {
        sQuote = text.search(quoteStartRegex);
        eQuote = text.search(quoteEndRegex);
        if (sQuote < eQuote && sQuote != -1){
            skip = text.indexOf("]", text.search(quoteStartRegex)) + 1;
            return findEndQuote(text.substring(skip), ignore+1, pos+skip);
        }
        else {
            if (ignore > 1){
                skip = eQuote + 8;
                return findEndQuote(text.substring(skip), ignore-1, pos+skip);
            }
            return pos + eQuote + 8;
        }
    }
    while (text.search(/\[quote.*\][\s\S]*\[\/quote\]/ig) >= 0){
        begin = text.substring(0, text.search(quoteStartRegex));
        end = text.substring(findEndQuote(text, 0, 0), text.length);
        text = begin + end;
    }
    return text;
}

function Delete(postid, authkey) {
    var action = 'none';
    var reason1 = 'Posting rules violation';
    var reason;
    if (confirm('Are you sure you wish to delete this post?') == true) {
        reason = prompt ('Why did this post need to be deleted?',reason1);
        if(reason == null) return;
        if (location.href.match(/forums\.php/)) {
            action = 'delete'; // we are on the forums
        } else if(location.href.match(/collage\.php/) ||
            location.href.match(/characters\.php/) ||
            location.href.match(/seiyuu\.php/) ||
            location.href.match(/company\.php/) ||
            location.href.match(/devblog\.php/))
        {
            action = 'delete_comment';
        }
        else
        {
            action = 'delete_post'; // we are on the user profile page or on a torrent page
        }

        $j.get(window.location.pathname, {action: action, auth: authkey, postid: postid, reason: reason}, function(response) {
            document.getElementById('post' + postid).style.display = 'none';
        });
    }
}



/***********
 * EDITING *
 ***********/
function Edit_Form(postid) {
    if (location.href.match(/forums\.php/)) {
        boxWidth="80";
    } else {
        boxWidth="50";
    }
    document.getElementById('bar' + postid).cancel = document.getElementById('content' + postid).innerHTML; // wow this is so hackish

    document.getElementById('content' + postid).innerHTML =
        '<div id="preview'+postid+'"></div>'+
        '<form id="form'+postid+'" method="post">'+
        '<input type="hidden" name="auth" value="'+CURRENT_USER.authKey+'" />'+
        '<input type="hidden" name="post" value="'+postid+'" />'+
        '<textarea id="editbox'+postid+'" name="body" cols="'+boxWidth+'" rows="10"></textarea><br /><hr>'+
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
}

function Cancel_Edit(postid) {
    document.getElementById('bar' + postid).innerHTML = '';
    document.getElementById('content' + postid).innerHTML = document.getElementById('bar' + postid).cancel;
}

function Preview_Edit(postid) {
    document.getElementById('bar' + postid).innerHTML = '<input type="button" value="Submit" class="btn-sub" onclick="Save_Edit(' + postid + ')" />&nbsp;<input type="button" value="Editor" onclick="Cancel_Preview(' + postid + ');" />&nbsp;&nbsp;<input type="button" value="Cancel" onclick="Cancel_Edit(' + postid + ');" /><br><br>';

    $j.post('/ajax.php?action=preview', $j('#form' + postid).serialize(), function(response) {
        document.getElementById('preview' + postid).innerHTML = response;
        document.getElementById('editbox' + postid).style.display = 'none';
    });
}

function Extend_Edit(postid) {
    document.getElementById('editbox' + postid).rows += 20;
}

function Cancel_Preview(postid) {
    document.getElementById('bar' + postid).innerHTML =
        '<input class="btn-sub" type="button" value="Submit" onclick="Save_Edit('+postid+');" />&nbsp;'+
        '<input type="button" value="Preview" onclick="Preview_Edit('+postid+');" />&nbsp;'+
        '<input type="button" value="Extend Box" onclick="Extend_Edit('+postid+');" />&nbsp;&nbsp;'+
        '<input type="button" value="Cancel" onclick="Cancel_Edit('+postid+');" /><br><br>';
    document.getElementById('preview' + postid).innerHTML = "";
    document.getElementById('editbox' + postid).style.display = "block";
}

function Save_Edit(postid) {
    var path = window.location.pathname.split('/').pop();
    if (location.href.match(/forums\.php/)) {
        action = 'takeedit';
    } else if(location.href.match(/collage\.php/) ||
        location.href.match(/characters\.php/) ||
        location.href.match(/seiyuu\.php/) ||
        location.href.match(/company\.php/) ||
        location.href.match(/devblog\.php/))
    {
        action = 'takeedit_comment';
    } else {
        action = 'takeedit_post';
    }

    document.getElementById('bar' + postid).innerHTML = '';
    $j.post(window.location.pathname + '?action=' + action, $j('#form' + postid).serialize(), function(response) {
        document.getElementById('content' + postid).innerHTML = response;
    });
}



/************
 * REPLYING *
 ************/

function Quick_Preview() {
    document.getElementById('quickreplybuttons').innerHTML = '<input type="submit" class="btn-sub" value="Submit" />&nbsp;<input type="button" value="Editor" onclick="Quick_Edit();" />';

    $j.post('/ajax.php?action=preview', $j('#quickpostform').serialize(), function(response) {
        document.getElementById('quickreplypreview').innerHTML = response;
        document.getElementById('quickreplypreview').style.display = 'block';
        document.getElementById('quickreplytext').style.display = 'none';
        document.getElementById('bbcode').style.display = 'none';
        document.getElementById('quickreplycreateoptions').style.display = 'none';
    });
}

function Quick_Edit() {
    document.getElementById('quickreplybuttons').innerHTML = "<input class=\"btn-sub\" type=\"submit\" value=\"Submit\" />&nbsp;<input type=\"button\" value=\"Preview\" onclick=\"Quick_Preview();\" />&nbsp;<input type=\"button\" value=\"Extend Box\" id=\"extended_btn\" onclick=\"Quick_Extend();\" />";
    document.getElementById('quickreplypreview').style.display = 'none';
    document.getElementById('quickreplytext').style.display = 'block';
    document.getElementById('bbcode').style.display = 'block';
    document.getElementById('quickreplycreateoptions').style.display = 'block';
}

function Quick_Extend() {
    document.getElementById('quickpost').rows += 20;
}



/**********
 * BBCODE *
 **********/

function prompt_insert(prom, open, close){
    var p =	prompt(prom);
    open = open + p + close;
    insert_text(open, '');
}

jQuery(function($j){
    // add sexy forum jump dropdown
    $j('#forumsjump').show();
    $j('.dropdown li').hover(
        function(){
            $j(this).addClass('hover');
            $j('ul:first', this).css('visibility', 'visible');
        },
        function(){
            $j(this).removeClass('hover');
            $j('ul:first', this).css('visibility', 'hidden');
        }
    );
    $j('ul.dropdown li ul li:has(ul)').find('a:first').append(' &raquo; ');

    // add smooth forum jump scrolling
    $j('ul.dropdown a[href^="#"]').click(function(){
        $j('html, body').animate({scrollTop: $j(this.hash).offset().top}, 600);
        return false;
    });

    // add forum togglers
    $j('.toggle_forum_cat').each(function(){
        var id = this.id.match(/toggle_([0-9]+)/)[1];
        $j(this).data('forumid', id);
        if ($j.inArray(parseInt(id), collapsed) != -1) {
            $j(this).text('[+]').click(function(){section_open(this)});
            $j(this).parent().parent().siblings().hide();
        } else {
            $j(this).text('[–]').click(function(){section_close(this)});
        }
    });

    // add description togglers
    $j(".descx").click(function(evt) {
        var d = $j(this).attr("name");
        $j(".descr[name=" + d + "], .descx[name=" + d + "]").toggle();
    });

    // add "Users Online" togglers
    $j('.online_toggle').click(function(){
        $j(this.hash).slideDown(100).siblings().slideUp(100); // switch <div>s
        $j(this).css('text-decoration', 'underline').siblings('.online_toggle').css('text-decoration', 'none'); // switch underline
        return false;
    });
    $j('.online_toggle:first').css('text-decoration', 'underline');

    // something to do with poll answers
    var i = $j('input.pollanswers').size() + 1;
    $j('a#add').click(function(){
        $j('<p><input type="text" name="answers[]" style="width: 98%;" class="pollanswers" /></p>').animate({opacity: 'show'}, 'slow').appendTo('#answer_block');
        i++;
    });
    $j('a#remove').click(function(){
        if (i > 3) {
            $j('input.pollanswers:last').animate({opacity: 'hide'}, 'slow').remove();
            i--;
        }
    });
});

function section_close(e) {
    $j.get('/xhr/forum/collapse/' + $j(e).data('forumid') + '/close');
    $j(e).text('[+]').unbind('click').click(function(){section_open(e)});
    $j(e).parent().parent().siblings().fadeOut(500);
}

function section_open(e) {
    $j.get('/xhr/forum/collapse/' + $j(e).data('forumid') + '/open');
    $j(e).text('[–]').unbind('click').click(function(){section_close(e)});
    $j(e).parent().parent().siblings().fadeIn(500);
}
