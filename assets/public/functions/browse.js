function selectTorrents(way) {
	torrents=document.forms['downloadform'];
	for(s=0; s<torrents.elements.length; s++) {
		if (torrents.elements[s].type=='checkbox') {
			if (way==0) {
				torrents.elements[s].checked=true;
			} else if (way==1) {
				torrents.elements[s].checked=false;
			} else {
				torrents.elements[s].checked=!torrents.elements[s].checked;
			}
		}
	}
	return false;
}

function toggleTorrents(gid) {
	$j('.group_torrents_' + gid).toggleClass('hide');
	if($j('.group_torrents_' + gid).hasClass('hide')){
		$j('#group_' + gid).find('.torrent_properties a:first').html("[+]");
	}else{
		$j('#group_' + gid).find('.torrent_properties a:first').html("[-]");
	}
}

function swapDiscog(type){
	if(type){
		$j('#'+type+'_table').find('.group_torrent').toggleClass('hide');
		$j('#'+type+'_table').find('.edition_info').toggleClass('hide');
		$j('#'+type+'_table').find('.group').toggleClass('hide');
		var swaplink = '#swaplink_'+type;
	} else {
		$j('.group_torrent').toggleClass('hide');
		$j('.edition_info').toggleClass('hide');
		$j('.group').toggleClass('hide');
		var swaplink = '#swaplink';
	}
	if($j(swaplink).text()=='Hide'){
		$j(swaplink).text('Show');
	}else{
		$j(swaplink).text('Hide');		
	}
}

function toggleAllTorrents(show){
	$j('*[class*="group_torrents_"]').each(function(){
		if(show){
			if($j(this).hasClass('hide')){
				$j(this).removeClass('hide');
			}
		}else{
			if(!$j(this).hasClass('hide')){
				$j(this).addClass('hide');
			}
		}
	});
	if(show){ $j('th.torrent_properties > a').text("[-]"); } else { $j('th.torrent_properties > a').text("[+]"); }
}


function toggleSearch() {
	$j('#search_section').toggleClass('hide');
}

$(function() {
	$("#accordion").accordion({
		heightStyle: "content"
	});
});

function swapDisplay(groupId,page) {
	if (page!=1) {
		if ($j('.groupid_'+groupId).toggleClass('hide').hasClass('hide')) {
			$j('#showimg_'+groupId).attr({'alt': 'Expand', 'title': 'Expand', 'class': 'show_torrents'});
		} else {
			$j('#showimg_'+groupId).attr({'alt': 'Collapse', 'title': 'Collapse', 'class': 'hide_torrents'});
		}
	} else {
		$j('#torrent_'+groupId).toggleClass('hide');
	}
	return false;
}

function toggleLabelGroups(gid) {
	$j('.groupTorrent_' + gid).toggleClass('hide');
	return false;
}

function swapTagList() {
	if (document.getElementById('browse_nav_tags').className.match(/hide$/)) {
		document.getElementById('browse_nav_tags').className=document.getElementById('browse_nav_tags').className.substr(0,document.getElementById('browse_nav_tags').className.length-5);
		document.getElementById('swaptags').innerHTML="Hide tags";
	} else {
		document.getElementById('browse_nav_tags').className=document.getElementById('browse_nav_tags').className+'hide';
		document.getElementById('swaptags').innerHTML="Show tags";
	}

	return false;
}

function AddTag(tag) {
	if (document.getElementById('tags').value == "") {
		document.getElementById('tags').value = tag;
	} else {
		document.getElementById('tags').value = document.getElementById('tags').value + ", " + tag;
	}
}



/****************
 * Torrent Tabs *
 ****************/
jQuery(function($j){
	// tabify
	$j('.tabs ul:first-child a').each(function(){
		var me = $j(this), href = me.attr('href').match(/(.*?)(#.+)/), link = href[1], anchor = href[2];
		me.attr('href', anchor.replace('_', '/')).click(function(){
			if ($j.trim($j(anchor).text()) == '') {
				$j(anchor).load(link + ' ' + anchor, function(){hookScreenshots(); switchTabs(me);});
			} else {
				switchTabs(me);
			}
		});
	});
	// hide divs
	var hash = window.location.hash;
	if (hash) {
		hash = hash.substr(1).split('/');
		$j('#torrent_' + hash[0]).removeClass('hide').siblings('[id^="torrent_"]').addClass('hide');
		if (hash.length > 1) {
			$j('.tabs > div:not([id="'+hash.join('_')+'"])').hide();
			$j('.tabs a[href$="#'+hash.join('/')+'"]').trigger('click');
		} else {
			$j('.tabs > div').hide();
			$j('.tabs .default_tab a').each(function(){switchTabs($j(this))});
		}
	} else {
		$j('.tabs > div').hide();
		$j('.tabs .default_tab a').each(function(){switchTabs($j(this))});
	}
});

function switchTabs(e) {
	// close old tab
	var selected = e.parent().parent().data('selected');
	if (selected) {
		selected.parent().removeClass('selected');
		$j(selected.attr('href').replace('/', '_')).slideUp(300);
		// don't continue if we're closing the only active tab
		if (selected.attr('href') == e.attr('href')) {
			e.parent().parent().removeData('selected');
			return;
		}
	}
	// open new tab
	e.parent().addClass('selected').parent().data('selected', e);
	$j(e.attr('href').replace('/', '_')).slideDown(300);
}
