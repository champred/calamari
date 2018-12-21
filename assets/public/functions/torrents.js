// slowEach() plugin by "Michael Geary"
// http://groups.google.com/group/jquery-en/browse_thread/thread/1790787be89b92bc/876c4ba8f01d8443#msg_72c18cfa10b7d7b6
// done - fired after last element, can be used to build functions chain (added by Orkan)
jQuery.fn.slowEach = function(interval, callback, done) {
	var items = this, i = 0;
	if(!items.length) return;
	function next() {
		(callback.call(items[i], i, items[i]) !== false && ++i < items.length) ? setTimeout(next, interval) : done && done.call(items, i, items);
	}
	next();
};

jQuery(document).ready(function($j){
	var disabled_rating = $j('#no_rate').val();

	// If they have already voted in the past, show the stars, but don't allow rating
	if (disabled_rating == 1) {
		$j("#stars-wrapper").stars({
			disabled: true,
			showTitles: true,
			split: 2,
			starWidth: 28
		});
	} else {
		initializeStarsRating ();
	}
});

function getURL() {
	if(location.href.match("torrents.php")) {
		return("torrents.php");
	}
	if(location.href.match("torrents2.php")) {
		return("torrents2.php");
	}
}

function initializeStarsRating () {
	$j("#stars-wrapper").stars({
		callback: function(ui, type, value)
		{
			ui.disable();
			var ratings = $j('#stars-wrapper :input');
			var arr = ui.$stars.find("a");
			arr.slowEach(50,
				function() { $j(this).animate({top: "28px"}, 300) },
				function() {
					$j.post("torrents.php?action=takerating", ratings.serialize() + "&newrate=" + value, function(data) {
						newData = data.split('|||');
						myRating  = newData[0];
						ratingStats = newData[1];

						$j('#message').html(newData[0]);
						$j('#rating_stats').html(ratingStats);

						$j('#message').html(function(){
							arr.slowEach(50, function(){ $j(this).animate({top: 0}, 300) });
						});
					});
				}
			);
		},
		oneVoteOnly: true,
		showTitles: true,
		split: 2,
		starWidth: 28,
		disabled: false
	});
}
function deleteVote(GroupID,Type) {
	$j.get('torrents.php?action=deleterating', { groupid: GroupID, type: Type }, function(data) {

		$j('#rating_stats').slideUp('fast',function() {
			$j('#rating_stats').html(data);
			$j('#message').hide();
			$j('#rating_stats').slideDown('slow');
		});
	});
	
	initializeStarsRating ();
	
	
}

function swapSummary(summary) {
	$j('#' + summary).toggleClass('hide');
}

function addTag() {
	$j("#add_tag a").hide();
	$j("#add_tag input").show();
	$j("#add_tag span").show();
}

function submitAddTag(GroupID) {
	$j.post(getURL() + '?action=add_tag', { tags: $j("#add_tag_input").val(), groupid: GroupID  }, function(data) {
		$j('#tags_listing').html(data);

		$j("#add_tag_input").val('');
		$j("#add_tag input").hide()
		$j("#add_tag span").hide();
		$j("#add_tag a").show()
	});
}

function removeTag(TagID,GroupID) {
	$j.get(getURL() + '?action=delete_tag', { groupid: GroupID, tagid: TagID }, function(data) {
		var removeMe = '#tag_' + TagID;
		$j(removeMe).fadeOut('fast');
	});
}

function voteTag(TagID,Direction,GroupID) {
	$j('#already_voted').hide();

	$j.get(getURL() + '?action=vote_tag', { groupid: GroupID, tagid: TagID, way: Direction }, function(data) {
		if(data != 'OK') { //probably already voted
			$j('#already_voted').fadeIn('fast');
			return(false);
		}

		var li = $j('#tag_' + TagID);
		if(Direction == 'up')
			var votes = parseInt(li.find('.tag_votes').text()) + 1;
		else
			var votes = parseInt(li.find('.tag_votes').text()) - 1;

		//Change vote
		li.find('.tag_votes').text(votes);

		// Re-sorting
		var all_li = $j("#tags_listing li").get();
		all_li.sort(function(a,b) {
			var votes_a = parseInt($j(a).find('.tag_votes').text());
			var votes_b = parseInt($j(b).find('.tag_votes').text());
			return (votes_a < votes_b) ? 1 : (votes_a > votes_b) ? -1 : 0;
		});
		$.each(all_li, function(index, item) {
			$j("#tags_listing ul").append(item)
		});

		// Add back bold to the one which lost it
		$j('.tag_votes').css('font-weight','bold');
	});
}

function addArtist() {
	$j("#add_artist_link").hide();
	$j(".hidden_af").show();
}

function submitAddArtist() {
	var GroupID = $j('#groupid').val();
	$j.post('torrents2.php?action=add_artist', {
		artist: $j("#add_artist_input").val(),
		importance: $j("#artist_importance").val(),
		role: $j("#artist_role").val(),
		groupid: GroupID }, function(data) {
		$j('#artists_listing').html(data);
		$j("#add_artist_link").show();
		$j(".hidden_af").hide();
		$j('#add_artist_input').val('');
		$j('#artist_importance').val('Main');
		$j('#artist_role').val('Performer');
	});
}

function removeVA(ArtistID) {
	var GroupID = $j('#groupid').val();
	$j.get('torrents2.php?action=delete_artist', { groupid: GroupID, artistid: ArtistID }, function(data) {
		if(data != 'fail') {
			// Remove the artist's entry
			var removeMe = '#artist_' + ArtistID;
			$j(removeMe).fadeOut('fast',function(){ $j(removeMe).remove(); });

			// Remove the guest artist div, if all of the guests are removed
			var num_guests = ($j('.guest_li').length) - 1 ;
			if(num_guests == 0 && $j('#guest_artist_div')) { $j('#guest_artist_div').fadeOut('fast'); }

			// Don't allow removal of the last main artist
			var num_main = ($j('.main_li').length) - 1 ;
			if(num_main == 1) { $j('.rm_main_artists').remove(); }
		}
	});
}

function moveArtist(Direction,ArtistID) {
	var GroupID = $j('#groupid').val();
	var authorize = $j('#auth').val();
	var Action2 = 'change_artist';

	$j.get('torrents2.php?action=mod_artist', { action2: Action2, groupid: GroupID, artistid: ArtistID, auth: authorize, direction: Direction }, function(data) {
		var removeMe = '#' + ArtistID;
		var appendMe = $j(removeMe).clone();
		var newData = data.split('|||');
		if (newData[0] == 'complete') {
			var Action = newData[1];
			if (Action == 'create main') {
				$j(newData[2]).appendTo('#hidden_vars');

			} else if (Action == 'create main|delete guest') {
				$j(newData[2]).appendTo('#hidden_vars');
				$j('#guest_artist_div').hide();

			} else if (Action == 'create guest') {
				$j(newData[2]).appendTo('#artists_listing');

			} else if (Action == 'create guest|delete main') {
				$j(newData[2]).appendTo('#artists_listing');
				$j('#main_artist_div').hide();

			} else {
				// Hm I dont think anything needs to be done then
			}
			if (Direction == 'main') $j(appendMe).appendTo('#main_artists');
			else $j(appendMe).appendTo('#guest_artists');

			$j(removeMe).fadeOut('fast');
		}
	});
}

function updateVA() {
	var vaUpdates = $j('#add_artist :input, #add_artist select');

	$j.post('torrents2.php?action=add_artist', vaUpdates.serialize(), function(data) {
		var newData = data.split('|||');
		if (newData[0] == 'complete') {
			// Determine if html structure should be added at all
			var Action = newData[3];
			if (Action == 'create all' || Action == 'create all|create main' || Action == 'create all|create guest' || Action == 'create all|create main|create guest') {
				$j('#artists_listing p').remove();
				$j(newData[4]).appendTo('#artists_listing');
			}
			if (Action == 'create main') {
				$j(newData[4]).appendTo('#hidden_vars');
			}
			if (Action == 'create guest') {
				$j(newData[4]).appendTo('#artists_listing');
			}

			// Add the actual new entries
			if (newData[1] != '') { // if there are new main artists
				$j(newData[1]).appendTo('#main_artists');
			}

			if (newData[2] != '') { // if there are new guest artists
				$j(newData[2]).appendTo('#guest_artists');
			}
		// Clear out the add form
		$j('.add_va').val('');
		var backupVA = $j('').clone();
		var backupImportance = $j('').clone();
//		$j('h2').empty();
//		var newTitle = newData[3].toString();
//		$j(newTitle).appendTo('h2');
		}
	});
}
