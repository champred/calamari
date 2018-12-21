var clickTimeout = false;
var loaderTimeout = false;

function changePage(page) {
	var GroupID = $j('#groupid').val();
	var type = $j('#type').val();
	var GroupName = $j('#name').val();

	$j.get('/ajax.php?action=wiki_form', { page: page, groupid: GroupID, type: type, name: GroupName }, function(data) {
		document.getElementById('dynamikku').innerHTML = data;
		setTimeout("reattachEvents()", 10);
	});
}

function gotoCorrectPage(){
	var currentPage = document.location.hash.substr(1);
	var curDoc = window.location.pathname;
	if(currentPage.length>0) {
		changePage(currentPage);
	} else {
		if(curDoc.substring(curDoc.lastIndexOf('/') + 1) == "torrents.php")
			changePage("anime_desc");
		else if(curDoc.substring(curDoc.lastIndexOf('/') + 1) == "series.php")
			changePage("series_desc");
		else if(curDoc.substring(curDoc.lastIndexOf('/') + 1) == "artist.php")
			changePage("artist_desc");
		else
			changePage("desc");
	}
}


function CreateAssoc() {
	var extraAssoc = $j('.seriesAdd').clone();
	var platform = $j('.seriesAdd select:first').val();
	var type = $j('.seriesAdd select:last').val();

	$j(extraAssoc).removeClass('seriesAdd');
	$j(extraAssoc).addClass('seriesEdit');

	$j('.seriesAdd td input[type="text"]').val('');
	$j('.seriesAdd td select').val('----');

	$j('#update_tr').before(extraAssoc);

	// Clean up stuffs
	$j('.seriesEdit:last #song_title').after('<td><center><input type="submit" class="deleteButton" name="submit" value="Delete" /></center></td>');
	$j('.seriesEdit:last #song_title input[type="text"]').attr('size','25');
	$j('.seriesEdit:last #number input[type="text"]').attr('size','1');

	$j('.seriesEdit:last #add_platform select').val(platform);
	$j('.seriesEdit:last #add_type select').val(type);

	setTimeout("reattachEvents()", 10);

	return false;
}

function CreateDiscog() {
	var extraDiscog = $j('.discogAdd').clone();
	var type = $j('.discogAdd select').val();
//	var mainTitle = $j('.discogAdd #main_title').val();
//	var kanjiTitle = $j('.discogAdd #kanji_title').val();

	$j(extraDiscog).removeClass('discogAdd');
	$j(extraDiscog).addClass('discogEdit');

	$j('.discogAdd td input[type="text"]').val('');
	$j('.discogAdd td select').val('---');

	$j('#update_tr').before(extraDiscog);

	// Clean up stuffs
	$j('.discogEdit:last #discog_comment input[type="text"]').attr('size','17');
	$j('.discogEdit:last #discog_comment').after('<td><center><input type="submit" class="deleteButton" name="submit" value="Delete" /></center></td>');
	$j('.discogEdit:last #add_type select').val(type);
//	$j('.discogEdit:last td input[type="text"]').removeAttr('onblur');
//	$j('.discogEdit:last td input[type="text"]').removeAttr('onfocus');

	setTimeout("reattachEvents()", 10);
}

function CreateArtist() {
	var extraArtist = $j('.artistAdd').clone();
	var importance = $j('.artistAdd select:first').val();
	var role = $j('.artistAdd select:last').val();

	$j(extraArtist).removeClass('artistAdd');
	$j(extraArtist).addClass('artistEdit');

	$j('.artistAdd td input[type="text"]').val('');
	$j('.artistAdd #importance select').val('Main');
	$j('.artistAdd #role select').val('Performer');

	$j('#update_tr').before(extraArtist);

	// Clean up stuffs
	$j('.artistEdit:last #role').after('<td><center><input type="submit" class="deleteButton" name="submit" value="Delete" /></center></td>');
	$j('.artistEdit:last td input[type="text"]').attr('size','37');
	$j('.artistEdit:last #importance select').val(importance);
	$j('.artistEdit:last #role select').val(role);

	setTimeout("reattachEvents()", 10);

	return false;
}

function CreatePeople() {
	var extraPeople = $j('.peopleAdd:first').clone();
	var type = $j('.peopleAdd select').val();

	$j(extraPeople).removeClass('peopleAdd');
	$j(extraPeople).addClass('peopleEdit');

	$j('.peopleAdd td input[type="text"]').val('');
	$j('.peopleAdd td select').val('Present');

	$j('#update_tr').before(extraPeople);

	// Clean up stuffs
	$j('.peopleEdit:last #person_role input[type="text"]').attr('size','22');
	$j('.peopleEdit:last #person_role').after('<td><center><input type="submit" class="deleteButton" name="submit" value="Delete" /></center></td>');
	$j('.peopleEdit:last select').val(type);

	setTimeout("reattachEvents()", 10);
	return false;
}

function CreateFranchiseRow() {
	var extraFranchise = $j('.franchiseAdd:first').clone();

	$j(extraFranchise).removeClass('franchiseAdd');
	$j(extraFranchise).addClass('franchiseEdit');

	$j('.franchiseAdd td input[type="text"]').val('');

	$j('#update_tr').before(extraFranchise);

	// Clean up stuffs
//	$j('.peopleEdit:last #person_role input[type="text"]').attr('size','22');
	$j('.franchiseEdit:last #series_name').after('<td><center><input type="submit" class="deleteButton" name="submit" value="Delete" /></center></td>');
//	$j('.peopleEdit:last select').val(type);

	setTimeout("reattachEvents()", 10);
	return false;
}


function CreateRelation() {
	var extraRelation = $j('.relationAdd:first').clone();
	var type = $j('.relationAdd select').val();

	$j(extraRelation).removeClass('relationAdd');
	$j(extraRelation).addClass('relationEdit');

	$j('.relationAdd td input[type="text"]').val('');
	$j('.relationAdd td select').val('---');

	$j('#update_tr').before(extraRelation);

	// Clean up stuffs
	$j('.relationEdit:last #series_name input[type="text"]').attr('colspan','1');
	$j('.relationEdit:last #series_name').after('<td><center><input type="submit" class="deleteButton" name="submit" value="Delete" /></center></td>');
	$j('.relationEdit:last select').val(type);

	setTimeout("reattachEvents()", 10);
	return false;
}

function CreateStudio() {
	var extraStudio = $j('.studio_div:first').clone();
	$j('.studio_div:last').after(extraStudio);
	$j('.studio_in:last').val('');

	setTimeout("reattachEvents()", 10);
	return false;
}

function CreateStaff() {
	var extraStaff = $j('.staff_div:first').clone();
	$j('.staff_div:last').after(extraStaff);
	$j('.staff_in:last').val('');
	$j('.staff_sel:last').val('---');

	setTimeout("reattachEvents()", 10);
	return false;
}

function CreateCompany() {
	var extraStaff = $j('.company_div:first').clone();
	$j('.company_div:last').after(extraStaff);
	$j('.company_in:last').val('');
	$j('.company_sel:last').val('---');

	setTimeout("reattachEvents()", 10);
	return false;
}

function CreateSongs() {
	var extraSong = $j('.songAdd:first').clone();
	var type = $j('.songAdd select').val();

	$j(extraSong).removeClass('songAdd');
	$j(extraSong).addClass('songEdit');

	$j('.songAdd td input[type="text"]').val('');
	$j('.songAdd td select').val('---');

	$j('#update_tr').before(extraSong);

	// Clean up stuffs
	$j('.songEdit:last #title input[type="text"]').attr('size','22');
	$j('.songEdit:last #eps_used').after('<td><center><input type="submit" class="deleteButton" name="submit" value="Delete" /></center></td>');
	$j('.songEdit:last select').val(type);

	setTimeout("reattachEvents()", 10);
	return false;
}

function CreateCharacter() {
	var extraCharacter = $j('.characterAdd:first').clone();

	$j(extraCharacter).removeClass('characterAdd');
	$j(extraCharacter).addClass('characterEdit');

	$j('.characterAdd td input[type="text"]').val('');

	$j('#update_tr').before(extraCharacter);

	// Clean up stuffs
//	$j('.songEdit:last #title input[type="text"]').attr('size','22');
	$j('.characterEdit:last #seiyuu_name').after('<td><center><input type="submit" class="deleteButton" name="submit" value="Delete" /></center></td>');

	setTimeout("reattachEvents()", 10);
	return false;
}

function CreateFranchise() {
	var extraStaff = $j('.franchise:first').clone();
	$j('#franchise_fields').append(extraStaff);
	$j('#franchise_fields').append('<br/>');
	$j('.franchise:last').val('');

	setTimeout("reattachEvents()", 10);
	return false;
}

function ShowForm() {
	$j('#create_franchise').css('display','inline');
}

function renameMusic() {
	var renameEdits = $j('#rename_form :input, #groupid');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('torrents2.php?action=rename', renameEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
		var newData = data.split('|');
		$j('#album_name').replaceWith(newData[1]);
	});
}

function updateCDType() {
	var renameEdits = $j('#cdtype_form select, #groupid, #categoryid, #year, .cat_id');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('torrents2.php?action=takecdtypeedit', renameEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}

function updateSeries() {
	var seriesEdits = $j('#groupid, .seriesEdit select, .seriesEdit :input');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('torrents2.php?action=takeseriesedit', seriesEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}

function updateRelations() {
	var relationEdits = $j('.relationEdit :input, .relationEdit select, #seriesid');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('series.php?action=take_editrelated', relationEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}

function updateArtists() {
	var artistEdits = $j('.artistEdit :input, .artistEdit select, #groupid');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('torrents2.php?action=takeeditva', artistEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}

function updateEditions() {
	var editionsEdits = $j('.editionEdit :input, .editionEdit :hidden, #groupid');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('torrents2.php?action=takeeditedition', editionsEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}

function updateDescription() {
	var descEdits = $j('#desc_edit :input, #groupid');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('torrents2.php?action=takegroupedit', descEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}

function updateArtistDesc() {
	var descEdits = $j('#desc_edit :input, #artistid');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('artist.php?action=takedescedit', descEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}

function updateDiscog() {
	var descEdits = $j('.discogEdit :input, #artistid');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('artist.php?action=takediscog', descEdits.serialize(), function(data) {
		var newData = data.split('|||');
		var isComplete = newData[0];
		var newDiscog = newData[1];

		if(isComplete.indexOf('complete') == 0) {
			showLoader('complete');
			$j('#seriesEdit').replaceWith(newDiscog)
		} else {
			showLoader('incomplete');
		}
	});
}

function updatePasteDiscog() {
	var discogEdits = $j('#discog_paste, #paste_type, #artistid');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('artist.php?action=takeautodiscog', discogEdits.serialize(), function(data) {
		var newData = data.split('|||');
		var isComplete = newData[0];
		var newDiscog = newData[1];

		if(isComplete.indexOf('complete') == 0) {
			showLoader('complete');
			$j('#seriesEdit').replaceWith(newDiscog)
			$j('#discog_paste').val('');
		} else {
			showLoader('incomplete');
		}
	});
	setTimeout("reattachEvents()", 10);
}

function updatePeople() {
	var peopleEdits = $j('.peopleEdit :input, .peopleEdit select, #artistid');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('artist.php?action=takeeditpeople', peopleEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}

function updateFranchise() {
	var peopleEdits = $j('.franchiseEdit :input, #franchiseid');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('series.php?action=take_franchise', peopleEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}


function renameArtist() {
	var renameEdits = $j('#rename_form :input, #artistid');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('artist.php?action=rename', renameEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}

function updateSeriesDesc() {
	var descEdits = $j('#desc_edit :input, #seriesid');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('series.php?action=takeedit', descEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}



function updateAnimeDesc() {
	var descEdits = $j('#desc_edit :input, #groupid');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('torrents.php?action=takegroupedit', descEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}

function updateExtendedAnime() {
	var exAnEdits = $j('#editExtendAn :input, #editExtendAn select, #groupid, #switch_names');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('torrents.php?action=takeeditdetails', exAnEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}

function updateExtendedManga() {
	var exAnEdits = $j('#editExtendAn :input, #editExtendAn select, #groupid');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('torrents.php?action=takeeditmangadetails', exAnEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}

function updateExtendedGames() {
	var exAnEdits = $j('.company_div :input, .company_div select, .editionEdit :input, .editionEdit select, #groupid');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('torrents.php?action=takeeditgamedetails', exAnEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}

function updateSongs() {
	var songEdits = $j('.songEdit :input, .songEdit select, #groupID');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('torrents.php?action=takeeditsong', songEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}

function updateCharacters() {
	var characterEdits = $j('.characterEdit :input, #groupID, #seiyuu, #character');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');
	$j.post('torrents.php?action=takeeditcharacters', characterEdits.serialize(), function(data) {
		if(data == 'complete') {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}



function updatePasteCharacters() {
	var characterEdits = $j('#paste_characters :input, #seiyuu_characters, #groupid');
	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('torrents.php?action=takeautoeditcharacters', characterEdits.serialize(), function(data) {
		if(data == 'complete') {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}

function updateAnimeLinks() {
	var descEdits = $j('#links_form :input, #groupid');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('torrents.php?action=takelinks', descEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}

function updateSeriesTitles() {
	var descEdits = $j('#titles_form :input, #artistid');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('series.php?action=rename', descEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}

function moveAnimeGroup() {
    var descEdits = $j('#advanced_form :input');

    $j('.curtain').css('display', 'block');
    $j('#loader').css('display', 'block');

    $j.post('torrents.php?action=move', descEdits.serialize(), function(data) {
        if(data.indexOf('complete') == 0) {
            showLoader('complete');
        } else {
            showLoader('incomplete');
        }
    });
}

function renameAnimeGroup() {
	var descEdits = $j('#rename_form :input');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('torrents.php?action=rename', descEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}

function updateMiscIDs() {
	var descEdits = $j('#misc_form :input');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('torrents.php?action=nonwikiedit', descEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}

function verify(page_type) {
	var descEdits = $j('#verify_div :input');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post(page_type + '.php?action=takeeditverify', descEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}

function submitFranchise() {
	var descEdits = $j('#franchise_title, #franchise_fields :input');

	$j('.curtain').css('display', 'block');
	$j('#loader').css('display', 'block');

	$j.post('serieslist.php?action=createfran', descEdits.serialize(), function(data) {
		if(data.indexOf('complete') == 0) {
			showLoader('complete');
		} else {
			showLoader('incomplete');
		}
	});
}

function fillExtended() {
	var anid = $j('#ann_link').val();
	if(anid) {
		$j('.curtain').css('display', 'block');
		$j('#loader').css('display', 'block');
		$j('#autofill_extended').attr("disabled", "true");
		$j.get('/xhr/scraper/ann/extended', {id: anid}, function(animeInfo) {
			$j("#eplength").attr('value', animeInfo['runtime']);
			$j("#dates").attr('value', animeInfo['airdate']);
			$j("#epcount").attr('value', animeInfo['num_episodes']);

			// Reset studio data
			$j('.studio_in:first').val('');
			$j('.studio_div + .studio_div').remove();
			$j('.staff_in:first').val('');
			$j('.staff_sel:first').val('---');
			$j('.staff_div + .staff_div').remove();

			$j.each(animeInfo['studios'], function(i, val) {
				if (i > 0) {
					$('.studio_div:last').after($('.studio_div:first').clone());
				}
				$('.studio_in:last').val(val);
			});

			var flag = false;
			$j.each(['creators', 'directors', 'producers', 'musicians', 'designers'], function(i, val) {
				$j.each(animeInfo[val], function(j, name) {
					if (flag) {
						$('.staff_div:last').after($('.staff_div:first').clone());
					} else {
						flag = true;
					}
					$('.staff_in:last').val(name);
					$('.staff_sel:last :nth-child(' + (i + 2) + ')').prop('selected', true);
				});
			});

			$j('#switch_names').attr('checked', true);
			showLoader('complete');
		});
	} else {
		alert('No ANN id :(');
	}
}

function fillExtendedManga(data) {
	var autofill_manga_obj = {};
	autofill_manga_obj.add_publisher = function(publisher){		
		var pubs = jQuery('.studio_in');
		var contained = false;
		pubs.each(function() {
			if (-1 != jQuery(this).val().search(new RegExp(publisher.name,"i"))) {
				contained = true;
			}
		});
		
		if (contained)
			return;
	
		
		pub = jQuery('.studio_in').last();
		if (pub.val()) {
			CreateStudio();
			pub = jQuery('.studio_in').last();
		}
		pub.val(publisher.name);		
	};
	autofill_manga_obj.add_artist = function(artist){		
		var st = jQuery('.staff_in');
		var contained = false;
		
		st.each(function() {
			var names = artist.name.split(" ");
			for (var i = 0; i < names.length;i++ ) {
				if (-1 == jQuery(this).val().search(new RegExp(names[i],"i"))) {
					return;
				}
					
			}
			contained = true; // if we got this far, then neither of the names was a mismatch i.e. names are identical
		});
		
		if (contained)
			return;

		st = jQuery('.staff_in').last();
		if (st.val()) {
			CreateStaff();
			st = jQuery('.staff_in').last();
		}
		var sel = jQuery('.staff_sel').last();
		st.val(artist.name);
		sel.val(artist.type);
	};
	
	jQuery("#editExtendAn input[name='volumes']").val(data.volumes);
	
	for (var i = 0; i < data.publishers.length; i++) {
		autofill_manga_obj.add_publisher(data.publishers[i]);
	}
	
	for (var i = 0; i < data.authors.length; i++) {
		autofill_manga_obj.add_artist(data.authors[i]);
	}
	
}

function mangaAutofillEvent (id) {

	jQuery('.curtain').css('display', 'block');
	jQuery('#loader').css('display', 'block');
	
	$j.getJSON('/xhr/scraper/mangaupdates', {id: id, timeout: 5000}, function(data) {
		  showLoader('complete');
		  fillExtendedManga (data);
	});
	
}
function fillSongs() {
	var anid = $j('#ann_link').val();

	if(anid) {
		$j('.curtain').css('display', 'block');
		$j('#loader').css('display', 'block');
		$j('#autofill_songs').attr("disabled", "true");
		$j.get('/xhr/scraper/ann/songs', {id: anid}, function(songs) {
			$j('.songEdit').remove();
			$j.each(songs, function(k, song) {
				$j('.songAdd select.song_type').val(song['type']);
				$j('.songAdd input.song_number').val(song['number']);
				$j('.songAdd input.song_title').val(song['main_title']);
				$j('.songAdd input.song_title2').val(song['jap_title']);
				$j('.songAdd input.artist_name').val(song['artist']);
				$j('.songAdd input.episodes_used').val(song['ep_range']);

				if(song['ep_range']=='') {
					$j('.songAdd input.episodes_used').val('All');
				}

				CreateSongs();
			});

			$j('#autofill_songs').removeAttr("disabled");
			showLoader('complete');
		});
	} else {
		alert('No ANN id :(');
	}
}

function reattachEvents() {
	$j('.deleteButton, .addsongartist, #renameAlbum, #update_cdtype, #update_series, #update_artists, #update_editions, #update_desc, #update_artist_desc, #create_discog, #update_discog, #paste_discog, #create_people, #update_people, #rename_artist, #update_anime_desc, #add_studio, #add_staff, #update_extended_anime, #create_songs, #update_songs, #add_song_artist, #update_links, #update_characters, #update_franchise, #create_franchise, #autofill_extended').unbind();

	$j('.deleteButton').click(function() {
		var items = $j($j(this).parents('tr')).andSelf();

		$j(items).each(function(k, v) {
			$j(v).fadeOut('fast', function() {
				$j(v).remove();
			});
		});
		return false;
	});
	$j('.addsongartist').click(function() {
		var extraArtist = '<input type="text" size="25" name="artist_name[]" /><br />';
		var whereAmI = $j(this).parents().parents();
		whereAmI.find('br').after(extraArtist);
		setTimeout("reattachEvents()", 10);
		return false;
	});

	// torrents2.php
	$j('#renameAlbum').click(function() { renameMusic();});
	$j('#update_cdtype').click(function() { updateCDType();});
	$j('#update_series').click(function() { updateSeries();});
	$j('#update_artists').click(function() { updateArtists();});
	$j('#update_editions').click(function() { updateEditions();});
	$j('#update_desc').click(function() { updateDescription();});

	// artist.php
	$j('#update_artist_desc').click(function() { updateArtistDesc();});
	$j('#create_discog').click(function() { CreateDiscog();});
	$j('#update_discog').click(function() { updateDiscog();});
	$j('#paste_discog').click(function() { updatePasteDiscog();});
	$j('#create_people').click(function() { CreatePeople();});
	$j('#update_people').click(function() { updatePeople();});
	$j('#rename_artist').click(function() { renameArtist();});

	// torrents.php
	$j('#update_anime_desc').click(function() { updateAnimeDesc();});
	$j('#update_extended_anime').click(function() { updateExtendedAnime();});
	$j('#update_songs').click(function() { updateSongs();});
	$j('#update_anime_links').click(function() { updateAnimeLinks();});

	// series.php
//	$j('#create_relation').click(function() { CreateRelation();});

	// Change page with dynamic hash
	// gotoCorrectPage();
//	$j('#update_characters').click(function() { updateCharacters();});
	// series.php

	// For autofills
	$j('#autofill_extended').click(function() { fillExtended(); });
}

$j(document).ready(function() {
		reattachEvents();
		gotoCorrectPage();
	}
);
