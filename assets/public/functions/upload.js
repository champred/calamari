function gotoCorrectPage(form) {
	if (!form) form = window.location.hash;
	if (!form.length) form = '#anime';
	$j('#dynamic_form').tabs('option', 'active', form);

}

function AutoFill_req() {
	var url = $j("#anidb_autofill")[0].value;
	var reg = new RegExp("^(https?://(?:www\\.)?anidb.net\\/perl-bin\\/animedb.pl\\?show=anime&aid=)?(\\d+)$");
	var match = reg.exec(url);

	if(match == null) {
		reg = RegExp("^(https?://(?:www\\.)?anidb.net\\/a)(\\d+)$");
		match = reg.exec(url);
	}

	if(match == null)
		$j("#auto").text("The AniDB URL you supplied is invalid.");
	else {
		$j('.curtain').css('display', 'block');
		$j('#loader').css('display', 'block');

		var aid = match[2];
		$j("#auto").text("Loading " + aid + "..");

		$j.get( '/xhr/scraper/anidb', {id: aid},
			function(animeInfo) {
				if(!animeInfo || !animeInfo['main_title']) {
					showLoader('incomplete');
					$j("#auto").text("The AniDB URL you supplied is invalid.");
					return;
				}

				$j("#auto").text("Autofill has fetched the information made available, please ensure that the information is correct for your upload.");

				$j("#series_name_anime").attr('value', animeInfo['main_title']);
				$j("#series2_anime").attr('value', animeInfo['jap_title']);
				// $j("#artist2").attr('value', animeInfo['romaji_title']);
				$j("#desc_anime").val(animeInfo['description']);
				$j("#year_anime").attr('value', animeInfo['year']);
				$j("#link1_anime").attr('value', url);
				$j("#link2_anime").attr('value', animeInfo['ann']);

				$j("#videotype option").each(function(i, val) { if(this.text == animeInfo['type']) { $j("#videotype").val(this.value); return 1; } });

				if(animeInfo['hentai']) {
					$j("#hentai").attr('checked', 'checked');
				} else
					$j("#hentai").attr('checked', '');

				$j("#tags_anime").attr('value', animeInfo['tags'].join(', '));
				if(animeInfo['image']) // Just provide anidb's image link
					$j("#image_anime").attr('value', animeInfo['image']);
					// $j.get('/sections/scraper/moshiMoshiMei.php', { 'uurl' : escape(animeInfo['image']) }, function(data) { $j('#image').attr('value', data )});

				showLoader('complete');
			},
			"json"
		);
	}
}

function AutoFill_VNs() {
	var url = $j('#vndb_autofill')[0].value;
	var reg = new RegExp("^https?://vndb.org\\/v(\\d+)$");
	var match = reg.exec(url);
	if(match == null)
		$j("#auto_vndb").text("The VNDB URL you supplied is invalid.");
	else {
		var aid = match[1];
		$j('.curtain').css('display', 'block');
		$j('#loader').css('display', 'block');

		$j.get('/xhr/scraper/vndb', { id: aid }, function(data) {
			// Fill in static group info
			$j("#series_name_visual_novels").attr('value', data['main_title']);
			$j("#series2_visual_novels").attr('value', data['jpn_title']);
			$j("#link1_visual_novels").attr('value', url);
			$j("#year_visual_novels").attr('value', data['year']);
			$j("#image_visual_novels").attr('value', data['image']);
			$j("#desc_visual_novels").val(data['desc']);

			$j("#auto_vndb").text("Loading " + aid + "..");
			$j('.auto_vn_groups').css('display','block');
			if(data['image']) $j('#image_notice').css('display','block');

			var counter = 0;
			var lang = ['jpn', 'eng'];
			var release_select = '<select onchange="autofill_VN_release(this);"><option></option>';
			lang.forEach(function (la) {
				var key = la + "_releases";
				var releaseList = data[key];

				if(releaseList && releaseList.length > 0) {
					releaseList.forEach(function(release) {
						var release_string = la.toUpperCase() + ' / ' + release['date'] + ' / ' + release['platform'] + ' / ' + release['title'];
						if(release['hentai']==1) {
							release_string += ' (18+)';
						}
						release_select += '<option id="vn_release_' + counter + '" value="' + release_string + '">' + release_string + '</option>';
						counter++;
					});
				}
			});

			release_select += '</select>';
			$j('#auto_vn_group').html(release_select);
            $j("#auto_vndb").text("Loaded!");
			showLoader('complete');
		});
	}
}

function autofill_VN_release(select) {
	var select = $j(select);
	var release_string = $j(select).find(":selected").text();
	var release = release_string.split(' / ');
	$j("#lang").val(release[0]);
	if(release[1]!='TBA')
		$j("#release_date_visual_novels").attr('value', release[1]);
	else
		$j("#release_date_visual_novels").attr('value', '');

	$j("#platform_visual_novels").val(release[2]);

	var reg = new RegExp("\\(18\\+\\)$");
	var match = reg.exec(release[3]);
	if(match != null) {
		$j("#hentai_visual_novels").attr('checked', true);
		$j('#hentai_censor_visual_novels').css('display','block');
		var release_title = release[3].substring(0,(release[3].length - 6));
	} else {
		$j("#hentai_visual_novels").attr('checked', false);
		$j('#hentai_censor_visual_novels').css('display','none');
		var release_title = release[3];
	}
	$j("#release_title_visual_novels").attr('value', release_title);
    $j("#release_title_games").attr('value', release_title);
}

function autofill_music(form) {
	var mb = $j('#mb_autofill_' + form).val();
	var vgmdb = $j('#vgmdb_autofill_' + form).val();
	// validation
	if (!mb && !vgmdb) {
		$j('#auto_' + form).text('Hey! You need to give me some information before I can autofill for you!');
		return;
	}

	if (mb) {
		if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/.test(mb)) {
			$j('#auto_' + form).text('The MusicBrainz ID you supplied is invalid.');
			mb = null;
		}
	} else {
		mb = false;
	}

	if (vgmdb) {
		var regexp = new RegExp('^(https?://vgmdb.net\\/album\\/)?(\\d+)$', 'i');
		var match = regexp.exec(vgmdb);
		if (match == null) {
			$j('#auto_' + form).text('The VGMdb URL you supplied is invalid.');
			vgmdb = null;
		} else {
			vgmdb = match[2];
		}
	} else {
		vgmdb = false;
	}

	if (mb == null || vgmdb == null) return;

	// start queries
	$j('#' + form + '_autofill_button').attr('disabled', 'disabled');

	if (mb) {
		$j('#mb_autofill_status_' + form).html('<img src="static/common/loading.gif" alt="Loading..." />');
		$j.getJSON('/xhr/scraper/musicbrainz', {id: mb}, function(data) {
			if (data['error']) {
				$j('#mb_autofill_status_' + form).html('<img src="static/common/error.png" alt="Error!" />');
				mb = null;
			} else {
				$j('#mb_autofill_status_' + form).html('<img src="static/common/success.png" alt="Success!" />');
				mb = data;
			}
			checkStatus();
		});
	}

	if (vgmdb) {
		$j('#vgmdb_autofill_status_' + form).html('<img src="static/common/loading.gif" alt="Loading..." />');
		$j.getJSON('/xhr/scraper/vgmdb', {id: vgmdb}, function(data) {
			if (data['error']) {
				$j('#vgmdb_autofill_status_' + form).html('<img src="static/common/error.png" alt="Error!" />');
				vgmdb = null;
			} else {
				$j('#vgmdb_autofill_status_' + form).html('<img src="static/common/success.png" alt="Success!" />');
				vgmdb = data;
			}
			checkStatus();
		});
	}

	var checkStatus = function() {
		if (mb == null || vgmdb == null) {
			$j('#auto_' + form).text("Uwah~ Something didn't work quite right! Please fix the error(s) and try again.");
			return;
		}
		if (typeof(mb) == 'string' || typeof(vgmdb) == 'string') return;

		$j('#' + form + '_autofill_button').removeAttr('disabled');

		// artists (let's not do this)
		// if (vgmdb['artist']){
		//	var artist_field_no = 1; // Reset this 1 before use, in case they autofill multiple times
		//	$j.each(vgmdb['artist'], function(i, val) {
		//		if(i > 0) AddArtistField('music');
		//		$j('#artist_music_' + i).val(val['name']);
		//	});
		// }

		// title
		var title = title2 = '';
		if (vgmdb) {
			title = vgmdb['title']['ja-Latn'] || vgmdb['title']['en'];
			title2 = vgmdb['title']['ja'];
			if (title2 == title) title2 = '';
		} else {
			if (mb['lang'] == 'Jpan')
				title2 = mb['title'];
			else
				title = mb['title'];
		}
		if (title) $j('#upload_form_' + form + ' #title').val(title);
		if (title2) $j('#upload_form_' + form + ' #title2').val(title2);

		// year
		var date = vgmdb ? vgmdb['date'] : mb['events'][0]['date'];
		if (date) {
			$j('#year_' + form).val(date.substr(0, 4));
			$j('#edition_date').val(date);
		}

		// cd type
		$j('#cdtype').val(vgmdb ? vgmdb['cdtype'] : mb['type'][0]);

		// media
		if (mb) $j('#cdmedia').val(mb['events'][0]['format']);

		// tags
		if (mb) {
			var tags = mb['tags'].join(', ');
			if (tags) $j('#tags_' + form).val(tags);
		}

		// image
		var image = vgmdb ? vgmdb['cover'] : mb['cover'];
		if (image) $j('#image_' + form).val(image);

		// tracklist
		var tracklist = '';
		function lengthstr(i) {
			var m = Math.floor(i / 60);
			var s = i % 60;
			return ' (' + m + ':' + (s < 10 ? '0' : '') + s + ')';
		}
		if (vgmdb) {
			for (var disc in vgmdb['tracklist']) {
				for (var tracknum in vgmdb['tracklist'][disc]) {
					if (vgmdb['tracklist'].length > 1) tracklist += disc + '-';
					tracklist += (tracknum < 10 ? '0' : '') + tracknum + '. ';

					var track = vgmdb['tracklist'][disc][tracknum];

					// first title
					var title = '';
					if (track['title']['English']) {
						title = track['title']['English'];
					} else if (track['title']['Romaji']) {
						title = track['title']['Romaji'];
					} else {
						for (var lang in track['title']) {
							title = track['title'][lang];
							break;
						}
					}
					tracklist += title;

					// duration
					if (track['length']) tracklist += lengthstr(track['length']);

					// alt. titles
					if (track['title']['English']) {
						var alt = [];
						if (track['title']['Romaji'] && track['title']['Romaji'] != title) alt.push(track['title']['Romaji']);
						if (track['title']['Japanese'] && track['title']['Japanese'] != title) alt.push(track['title']['Japanese']);
						if (alt.length) tracklist += ' [' + alt.join(' // ') + ']';
					} else if (track['title']['Romaji']) {
						if (track['title']['Japanese'] && track['title']['Japanese'] != title) tracklist += ' [' + track['title']['Japanese'] + ']';
					}

					// next!
					tracklist += '\n';
				}
			}
		} else {
			for (var i = 1, track; track = mb['tracklist'][i]; i++) {
				tracklist += (i < 10 ? '0' : '') + i + '. ' + track['title'];
				if (track['duration']) tracklist += lengthstr(track['duration']);
				tracklist += '\n';
			}
		}
		if (tracklist) {
			$j('#upload_form_' + form + ' #desc_music').val(tracklist);
			//$j('#upload_form_' + form + ' #release_desc').val(tracklist);
		}

		// catalog number
		var catalog = vgmdb ? vgmdb['catalog'] : mb['events'][0]['catalog-number'];
		if (catalog) $j('#upload_form_music input[name="catalog_number"]').val(catalog);
	}
}

function get_mangaupdates_id() {

	var url = jQuery('input[id="mu_autofill"]:visible').val();
	if (!url) {
		$j('input[id="auto_mu"]:visible').text('Hey! You need to give me some information before I can autofill for you!');
		return 0;
	}
	var mu = /http[s]?:\/\/www\.mangaupdates\.com\/series\.html\?id=([0-9]+)/;

	jQuery('#link1_manga').val(url);
	if (!url.match(mu)) {
		alert('Invalid mangaupdates link.');
		return 0;
	}
	var id = url.match(mu)[1];
	if (!id || 0 == parseInt(id)) {
        alert('Invalid mangaupdates link.');
		return 0;
	}

	return parseInt(id);
}

function get_mugimugi_id() {

	var url = jQuery('input[id="mugimugi_autofill"]:visible').val();
	if (!url) {
		$j('input[id="auto_mugimugi"]:visible').text('Hey! You need to give me some information before I can autofill for you!');
		return 0;
	}
	var mugi = "https://www.doujinshi.org/book/";
    var mugi2 = "http://www.doujinshi.org/book/";

	if (-1 == url.indexOf(mugi) && -1 == url.indexOf(mugi2)) {
		alert('Invalid mugimugi link.');
		return 0;
	}
	var id = url.replace(mugi,"");
    id = id.replace(mugi2,"");
	var pattern = /\d+/;
	id = pattern.exec(id);

	if (!id || 0 == parseInt(id)) {
        alert('Invalid mugimugi link.');
		return 0;
	}

	return parseInt(id);
}

function autofill_manga (type) {
	var id = 0;
	var requestUrl = '/xhr/scraper/mangaupdates';
	if (type == 'mu') {
		var id = get_mangaupdates_id();
	}
	else if (type == 'mugimugi') {
		var id = get_mugimugi_id();
		requestUrl = '/xhr/scraper/mugimugi';
	}

	tab = $j('div[class^="ui-tabs-panel"]:visible').attr('id');

	if (! id > 0)
		return;

	$j('input[id="manga_autofill_button"]').attr('disabled', 'disabled');
	$j('input[id="mugimugi_autofill_button"]').attr('disabled', 'disabled');

	jQuery('.curtain').css('display', 'block');
	jQuery('#loader').css('display', 'block');

	$j.getJSON(requestUrl, {id: id, timeout: 5000}, function(data) {
		if ((data.type == 'Novel' && tab != 'light_novels') || (data.type == 'Artbook' && tab != 'artbook') || ((data.type != 'Novel' && data.type != 'Artbook') && tab != 'manga')) {
			name = (type == 'mu') ? 'Manga-Updates' : 'MugiMugi'
			if (confirm(name + ' says this is a ' + data.type + '.\nSwitch to the correct upload form?')) {
				if (data.type == 'Novel')
					tab = 'light_novels'
				else if (data.type == 'Artbook')
					tab = 'artbook'
				else
					tab = 'manga';
				$j('a[href="#' + tab + '"]').click();
			}
		}

		var desc = jQuery('#desc_' + tab);
		if ("" == desc.val()) desc.val (jQuery("<div/>").html(data.synopsis).text());

		var jp_title = jQuery('#series2_' + tab);
		var patt=/([\u3040-\u30ff\u4e00-\u9fbf])+/;
		for (var i = 0; i < data.alt_titles.length; i++) {
			if ("" == jp_title.val())
				if (patt.test(data.alt_titles[i]))
					jp_title.val(data.alt_titles[i]);
		}

		var title = jQuery('#series_name_' + tab);
		if ("" == title.val()) title.val (jQuery("<div/>").html(data.title).text());

		var year = jQuery('#year_' + tab);
		if ("" == year.val()) year.val (data.year);

		var tags = jQuery('#tags_' + tab);
		var tgs = "";
		for (var i = 0; i < data.genres.length;i++){
			tgs += data.genres[i] + ", ";
		}
		tgs = jQuery.trim(tgs);
		tgs = tgs.substring(0, tgs.length - 1);

		if ("" == tags.val()) tags.val (tgs);

		var img = jQuery("#image_" + tab);
		if ("" == img.val()) img.val (data.image);

		if (tab === 'manga')
			jQuery("#mangatype").val(data.type);

		showLoader('complete');

		$j('input[id="manga_autofill_button"]').removeAttr('disabled');
		$j('input[id="mugimugi_autofill_button"]').removeAttr('disabled');
	});
}

function RequestType() {
	var Cat = $j('#requesttype').val();

	$j.get('/ajax.php?action=request_section', { section: Cat }, function(data) {
		$j('#dynamic_form').html(data);
	});
}

function toggleOption(type,form) {
	switch (type) {
		case 'resolution':
		case 'j_resolution':
			form_spec = (type != 'j_resolution') ? '_' + form : '';
			current_res = $j('#' + type + form_spec).val();
			if(current_res == 'OTHER') {
				$j('#other_' + type + '_dd_' + form).slideDown('fast');
			} else {
				$j('#other_' + type + '_dd_' + form).slideUp('fast');
			}
		break;

		case 'containers':
			current_source = $j('#containers_' + form).val();
			if(current_source == 'ISO' || current_source == 'VOB IFO' || current_source == 'M2TS') {
				$j('.region_' + form + '_dd').slideDown('fast');
				$j('.aspectratio_' + form + '_dd').slideDown('fast');
			} else {
				$j('.region_' + form + '_dd').slideUp('fast');
				$j('.aspectratio_' + form + '_dd').slideUp('fast');
			}
		break;

        case 'media':
            current_media = $j('#media').val();
            if(current_media != 'DVD') {
                $j('#region_' + form + '> option[value^="R"]').prop("disabled", true);
                $j('#region_' + form + '> option').not(':first, [value^="R"]').prop("disabled", false);
            } else {
                $j('#region_' + form + '> option[value^="R"]').prop("disabled", false);
                $j('#region_' + form + '> option').not(':first, [value^="R"]').prop("disabled", true);
            }
        break;

		case 'cdtype':
			current_cdtype = $j('#cdtype').val();
			if(current_cdtype == 'Soundtrack' || current_cdtype == 'Drama CD' || current_cdtype == 'Vocal CD' || current_cdtype == 'Image CD') {
				$j('.multiple_series').slideDown('fast');
				$j('#soundtrack').attr('checked','checked');
			} else {
				$j('.multiple_series').slideUp('fast');
				$j('#soundtrack').attr('checked',false);
			}
		break;

		case 'encoding':
			encoding = $j('#encoding').val();
			if(encoding == 'FLAC') {
				if ($j('#bitrate').val().indexOf('Lossless') == -1) {
					$j('#bitrate').val('Lossless');
				}
				$j('#logchecker').show();
			}
			else {
				$j('#logchecker').hide();
			}
		break;

		case 'edition_date':
			edition_title = $j('#edition_title').val();
			edition_date = $j('.edition_date').val();
			if(edition_date != '') { // Don't do anything if the edition date is present
				if(edition_title !== 'Original CD Release') {
					$j('.edition_date').slideDown('fast');
				} else {
					$j('.edition_date').slideUp('fast');
				}
			}
		break;

		case 'release_group_anime':
		case 'release_group_light_novels':
		case 'release_group_manga':
		case 'release_group_artbooks':
		case 'release_group_live_action':
		case 'incomplete_info':
		case 'season_title':
		case 'hentai_censor_anime':
		case 'hentai_censor_manga':
		case 'hentai_censor_artbooks':
		case 'hentai_censor_games':
		case 'hentai_censor_visual_novels':
		case 'hentai_censor_live_action':
			$j('#' + type).slideToggle('fast');
		break;

		case 'multiple_series':
			$j('.' + type).slideToggle('fast');
		break;

        case 'ongoing_info':
            $j('#' + type + '_' + form).slideToggle('fast');
        break;
	}
}

var artist_field_no = 1;
function AddArtistField(form) {
	var artistNames = $j('#artist_names_' + form);
	var e = $j('#artist_names_' + form + ' .nameFieldSet').last().clone()
		.css('display', 'none').slideDown(200)
		.appendTo(artistNames);

	e.children('input[name="artist_name[]"]').val('');
	e.children('input[name="artist_name[]"]').attr('id', "artist_" + form + "_" + artist_field_no);
	e.children('select').attr('id', "artist_" + form + "_importance_" + artist_field_no);
	e.children('div').attr('id', "artist_" + form + "_ac" + artist_field_no);
	if (e.children('.removeNameFieldSet').length == 0)
		$j('<a href="javascript:" class="removeNameFieldSet" onclick="RemoveField(this)">[-]</a>').insertAfter(e.children('input').last());


	artist_field_no++;
	create_artist_ac('artist_' + form + '_' + artist_field_no, 'artist_' + form + '_ac' + artist_field_no, '300px');
}

var series_field_no = 1;
function AddSeriesField(form) {
	var e = $j('#series_names_' + form).clone()
		.css('display', 'none').slideDown(200)
		.insertBefore('#series_add_' + form);

	e.children('input[name="series_name[]"]').val('');
	e.children('input[name="series_name[]"]').attr('id', "series"+series_field_no);
	e.children('div').attr('id', "series_ac"+series_field_no);
	$j(' <a href="javascript:" onclick="RemoveField(this)">[-]</a>').insertAfter("#series"+series_field_no);


	series_field_no++;
	create_series_ac('series' + series_field_no, 'series_ac' + series_field_no, '300px');
}

function RemoveField(e) {
	$j(e).parent().slideUp(200, function(){$j(e).parent().remove();});
}

function AddTag(form) {
	current_tags = $j('#tags_' + form).val();
	new_tag = $j('#genre_tags_' + form).val();
	if(current_tags == '') {
		$j('#tags_' + form).val(new_tag);
	} else if(new_tag != '---') {
		$j('#tags_' + form).val(function(index, value) {
			return value + ', ' + new_tag;
		});
	}
}

$j().ready(function() {
	// validate the form when it is submitted
	// TODO: figure out how to reduce redundant code below

	toggleOption('encoding','music');
	toggleOption('bitrate','music');

	$j("#upload_form_anime").validate({
		errorContainer: $j('#container_anime'),
		errorLabelContainer: $j('#container_anime'),
		rules: {
			file_input: { required: true, accept: 'torrent' },
			/* Group info */
			"series_name[]": { required: false, minlength: 1, maxlength: 200 },
			videotype: { required: true },
			link1: { required: true, url: true },
			image: { required: false, url: true, accept: 'jpe?g|gif|png|tiff?|bmp' },
			year: { required: true, digits: true, rangelength:[4,4] },
			tags: { required: true, minlength: 2, maxlength: 200 },
			desc: { required: true, minlength: 10, maxlength: 1000000 },

			/* Release info */
			media:			{ required: true },
			containers:		{ required: true },
			codecs:			{ required: true },
			resolution:			{ required: true },
			audio:			{ required: true },
			subbing:		{ required: true },
			release_group_name:	{
				required: "#remaster:checked",
				minlength: 1, maxlength: 40
			},
			ep_range:	{
				required: "#incomplete:checked",
				minlength: 1, maxlength: 40
			},
			release_desc: { required: false, minlength: 10, maxlength: 1000000 }
		},
		messages: {
			file_input: "Select a .torrent file to upload!<br>",
			"series_name[]": "The series title must be between 1 and 200 characters.<br>",
			videotype: "Choose an anime type.<br>",
			link1: "Specify a valid AniDB link.<br>",
			image: "The image URL entered was invalid.<br>",
			year: "Enter the year of this release.<br>",
			tags: "Enter at least one tag.<br>",
			desc: "Series description must be a minimum of 10 characters.<br>",

			media: "Choose a media source type.<br>",
			containers: "Choose a type of video container.<br>",
			codecs: "Choose a video codec.<br>",
			resolution: "Choose a resolution.<br>",
			audio: "Choose an audio codec.<br>",
			subbing: "Choose a subbing status.<br>",
			release_group_name: "Release group name must be between 1 and 40 characters.<br>",
			release_desc: "If specified, the release description must be a minimum of 10 characters.<br>"
		}
	});

	$j("#upload_form_manga").validate({
		errorContainer: $j('#container_manga'),
		errorLabelContainer: $("p", $j('#container_manga')),
		rules: {
			"series_name[]": { required: false, minlength: 1, maxlength: 200 },
			file_input: { required: true, accept: 'torrent' },
			link1: { required: false, url: true },
			image: { required: false, url: true, accept: 'jpe?g|gif|png|tiff?|bmp' },
			year: { required: true, digits: true, rangelength:[4,4] },
			tags: { required: true, minlength: 2, maxlength: 200 },
			desc: { required: true, minlength: 10, maxlength: 1000000 },
			mangatype: { required: true },

			release_desc: { required: false, minlength: 10, maxlength: 1000000 }
		},
		messages: {
			file_input: "Select a .torrent file to upload!<br>",
			"series_name[]": "The series title must be between 1 and 200 characters.<br>",
			link1: "The Manga-Updates link specified is invalid.<br>",
			image: "The image URL entered was invalid.<br>",
			year: "Enter the year of this release.<br>",
			tags: "Enter at least one tag.<br>",
			desc: "Series description must be a minimum of 10 characters.<br>",
			mangatype: "Choose a manga type.<br>",
			release_desc: "If specified, the release description must be a minimum of 10 characters.<br>"
		}
	});

	$j("#upload_form_artbooks").validate({
		errorContainer: $j('#container_artbooks'),
		errorLabelContainer: $("p", $j('#container_artbooks')),
		rules: {
			file_input: { required: true, accept: 'torrent' },
			"series_name[]": { required: false, minlength: 1, maxlength: 200 },
			image: { required: false, url: true, accept: 'jpe?g|gif|png|tiff?|bmp' },
			year: { required: true, digits: true, rangelength:[4,4] },
			tags: { required: true, minlength: 2, maxlength: 200 },
			desc: { required: true, minlength: 10, maxlength: 1000000 },
			/* Release info */
			artbook_title: { required: true, minlength: 2, maxlength: 100 },
			release_desc: { required: false, minlength: 10, maxlength: 1000000 }
		},
		messages: {
			file_input: "Select a .torrent file to upload!<br>",
			"series_name[]": "The series title must be between 1 and 200 characters.<br>",
			image: "The image URL entered was invalid.<br>",
			year: "Enter the year of this release.<br>",
			tags: "Enter at least one tag.<br>",
			desc: "Series description must be a minimum of 10 characters.<br>",
			artbook_title: "You must enter an artbook title between 2 and 100 characters.<br>",
			release_desc: "If specified, the release description must be a minimum of 10 characters.<br>"
		}
	});


	$j("#upload_form_light_novels").validate({
		errorContainer: $j('#container_light_novels'),
		errorLabelContainer: $("p", $j('#container_light_novels')),
		rules: {
			file_input: { required: true, accept: 'torrent' },
			"series_name[]": { required: false, minlength: 1, maxlength: 200 },
			image: { required: false, url: true, accept: 'jpe?g|gif|png|tiff?|bmp' },
			year: { required: true, digits: true, rangelength:[4,4] },
			tags: { required: true, minlength: 2, maxlength: 200 },
			desc: { required: true, minlength: 10, maxlength: 1000000 },
			release_desc: { required: false, minlength: 10, maxlength: 1000000 }
		},
		messages: {
			file_input: "Select a .torrent file to upload!<br>",
			"series_name[]": "The series title must be between 1 and 200 characters.<br>",
			image: "The image URL entered was invalid.<br>",
			year: "Enter the year of this release.<br>",
			tags: "Enter at least one tag.<br>",
			desc: "Series description must be a minimum of 10 characters.<br>",
			release_desc: "If specified, the release description must be a minimum of 10 characters.<br>"
		}
	});


	$j("#upload_form_music").validate({
		errorContainer: $j('#container_music'),
		errorLabelContainer: $j('#container_music'),
		rules: {
			file_input: { required: true, accept: 'torrent' },
			// "artist_name[]": { required: true, minlength: 1, maxlength: 200 },
			title: { required: true, minlength: 1, maxlength: 200 },
			title2: { required: false, minlength: 1, maxlength: 200 },
			cdtype: { required: true },
			image: { required: false, url: true, accept: 'jpe?g|gif|png|tiff?|bmp' },
			year: { required: true, digits: true, rangelength:[4,4] },
			tags: { required: true, minlength: 2, maxlength: 200 },
			desc: { required: true, minlength: 10, maxlength: 1000000 },

			/* Release info */
			encoding:		{ required: true },
			bitrate:		{ required: true },
			cdmedia:		{ required: true },
			catalog_number:	{ required: false, minlength: 4, maxlength: 15 },
			edition_title:	{ required: false, minlength: 2, maxlength: 40 },
			edition_date: "required edition_date",
			release_desc: { required: false, minlength: 10, maxlength: 1000000 }
		},
		messages: {
			file_input: "Select a .torrent file to upload!<br>",
			// "artist_name[]": "Artist name(s) must be between 1 and 200 characters each.<br>",
			title: "The English / romaji title must be between 1 and 200 characters.<br>",
			title2: "The Japanese title must be between 1 and 200 characters.<br>",
			cdtype: "Specify a valid type of CD.<br>",
			image: "The image URL entered was invalid.<br>",
			year: "Enter the year of this release.<br>",
			tags: "Enter at least one tag.<br>",
			desc: "Series description must be a minimum of 10 characters.<br>",

			encoding: "Specify an encoding format.<br>",
			bitrate: "Specify a bitrate.<br>",
			cdmedia: "Specify a media source.<br>",
			catalog_number: "The catalog number must be between 4 and 15 characters.<br>",
			edition_title: "The edition title must be between 2 and 40 characters.<br>",
			edition_date: 'Enter a valid release date in the format "YYYY-MM-DD".<br>',
			release_desc: "If specified, the release description must be a minimum of 10 characters.<br>"
		}
	});

	$j("#upload_form_pvs").validate({
		errorContainer: $j('#container_pvs'),
		errorLabelContainer: $j('#container_pvs'),
		rules: {
			file_input: { required: true, accept: 'torrent' },
			"artist_name[]": { required: true, minlength: 1, maxlength: 200 },
			title: { required: true, minlength: 1, maxlength: 200 },
			title2: { required: false, minlength: 1, maxlength: 200 },
			musicvideotype: { required: true },
			image: { required: false, url: true, accept: 'jpe?g|gif|png|tiff?|bmp' },
			year: { required: true, digits: true, rangelength:[4,4] },
			tags: { required: true, minlength: 2, maxlength: 200 },
			desc: { required: true, minlength: 10, maxlength: 1000000 },

			/* Release info */
			j_source: { required: true },
			j_containers: { required: true },
			j_codecs: { required: true },
			j_resolution: { required: true },
			audio: { required: true },
			j_subbing: { required: true },
			catalog_number: { required: false, minlength: 4, maxlength: 15 },
			edition_title: { required: false, minlength: 2, maxlength: 40 },
			edition_date: "required edition_date",
			release_desc: { required: false, minlength: 10, maxlength: 1000000 }
		},
		messages: {
			file_input: "Select a .torrent file to upload!<br>",
			"artist_name[]": "Artist name(s) must be between 1 and 200 characters each.<br>",
			title: "The English / romaji title must be between 1 and 200 characters.<br>",
			title2: "The Japanese title must be between 1 and 200 characters.<br>",
			musicvideotype: "Choose a valid type.<br>",
			image: "The image URL entered was invalid.<br>",
			year: "Enter the year of this release.<br>",
			tags: "Enter at least one tag.<br>",
			desc: "Series description must be a minimum of 10 characters.<br>",

			j_source: "Choose a media source.<br>",
			j_containers: "Choose a type of video container.<br>",
			j_codecs: "Choose a video codec.<br>",
			j_resolution: "Choose a resolution.<br>",
			audio: "Choose an audio codec.<br>",
			j_subbing: "Choose a subbing status.<br>",
			catalog_number: "The catalog number must be between 4 and 15 characters.<br>",
			edition_title: "The edition title must be between 2 and 40 characters.<br>",
			edition_date: 'Enter a valid release date in the format "YYYY-MM-DD".<br>',
			release_desc: "If specified, the release description must be a minimum of 10 characters.<br>"
		}
	});

	$j("#upload_form_games").validate({
		errorContainer: $j('#container_games'),
		errorLabelContainer: $j('#container_games'),
		rules: {
			file_input: { required: true, accept: 'torrent' },
			"series_name[]": { required: false, minlength: 1, maxlength: 200 },
			image: { required: false, url: true, accept: 'jpe?g|gif|png|tiff?|bmp' },
			year: { required: true, digits: true, rangelength:[4,4] },
			tags: { required: true, minlength: 2, maxlength: 200 },
			desc: { required: true, minlength: 10, maxlength: 1000000 },

			/* Release info */
            gametype: { required: true },
            lang: { required: true },
            platform: { required: true },
            release_title: { required: true },
            vn_company: { required: true },
            release_date: { required: true },
            release_desc: { required: false, minlength: 10, maxlength: 1000000 }
		},
		messages: {
            file_input: "Select a .torrent file to upload!<br>",
            "series_name[]": "The series title must be between 1 and 200 characters.<br>",
            image: "The image URL entered was invalid.<br>",
            year: "Enter the year of this release.<br>",
            tags: "Enter at least one tag.<br>",
            desc: "Series description must be a minimum of 10 characters.<br>",

            gametype: "Choose a valid type.<br>",
            lang: "Choose a language of this release.<br>",
            release_title: "Enter the edition title of this game.<br>",
            vn_company: "Enter the company name(s) of this game.<br>",
            platform: "Choose a valid game platform.<br>",
            release_desc: "If specified, the release description must be a minimum of 10 characters.<br>",
            release_date: 'Enter a valid release date in the format "YYYY-MM-DD".<br>'
		}
	});


	$j("#upload_form_visual_novels").validate({
		errorContainer: $j('#container_visual_novels'),
		errorLabelContainer: $j('#container_visual_novels'),
		rules: {
			file_input: { required: true, accept: 'torrent' },
			"series_name[]": { required: false, minlength: 1, maxlength: 200 },
			image: { required: false, url: true, accept: 'jpe?g|gif|png|tiff?|bmp' },
			year: { required: true, digits: true, rangelength:[4,4] },
			tags: { required: true, minlength: 2, maxlength: 200 },
			desc: { required: true, minlength: 10, maxlength: 1000000 },

			/* Release info */
			gametype: { required: true },
			lang: { required: true },
			platform: { required: true },
			release_title: { required: true },
			vn_company: { required: true },
            release_date: { required: true },
			release_desc: { required: false, minlength: 10, maxlength: 1000000 }
		},
		messages: {
			file_input: "Select a .torrent file to upload!<br>",
			"series_name[]": "The series title must be between 1 and 200 characters.<br>",
			image: "The image URL entered was invalid.<br>",
			year: "Enter the year of this release.<br>",
			tags: "Enter at least one tag.<br>",
			desc: "Series description must be a minimum of 10 characters.<br>",

			gametype: "Choose a valid type.<br>",
			lang: "Choose a language of this release.<br>",
			release_title: "Enter the edition title of this visual novel.<br>",
			vn_company: "Enter the company name(s) of this visual novel.<br>",
			platform: "Choose a valid game platform.<br>",
			release_desc: "If specified, the release description must be a minimum of 10 characters.<br>",
            release_date: 'Enter a valid release date in the format "YYYY-MM-DD".<br>'
		}
	});


	$j("#upload_form_live_action").validate({
		errorContainer: $j('#container_live_action'),
		errorLabelContainer: $j('#container_live_action'),
		rules: {
			file_input: { required: true, accept: 'torrent' },
			"series_name[]": { required: false, minlength: 1, maxlength: 200 },
			dramatype: { required: true },
			image: { required: false, url: true, accept: 'jpe?g|gif|png|tiff?|bmp' },
			year: { required: true, digits: true, rangelength:[4,4] },
			tags: { required: true, minlength: 2, maxlength: 200 },
			desc: { required: true, minlength: 10, maxlength: 1000000 },

			/* Release info */
			media: { required: true },
			containers: { required: true },
			codecs: { required: true },
			resolution: { required: true },
			audio: { required: true },
			subbing: { required: true },
			release_desc: { required: false, minlength: 10, maxlength: 1000000 }
		},
		messages: {
			file_input: "Select a .torrent file to upload!<br>",
			"series_name[]": "The series title must be between 1 and 200 characters.<br>",
			dramatype: "Choose a type.<br>",
			image: "The image URL entered was invalid.<br>",
			year: "Enter the year of this release.<br>",
			tags: "Enter at least one tag.<br>",
			desc: "Series description must be a minimum of 10 characters.<br>",

			media: "Choose a media source type.<br>",
			containers: "Choose a type of video container.<br>",
			codecs: "Choose a video codec.<br>",
			resolution: "Choose a resolution.<br>",
			audio: "Choose an audio codec.<br>",
			subbing: "Choose a subbing status.<br>",
			release_desc: "If specified, the release description must be a minimum of 10 characters.<br>"
		}
	});


	$j("#upload_form_packs").validate({
		errorContainer: $j('#container_packs'),
		errorLabelContainer: $j('#container_packs'),
		rules: {
			file_input: { required: true, accept: 'torrent' },
			title: { required: true, minlength: 2, maxlength: 200 },
			image: { required: false, url: true, accept: 'jpe?g|gif|png|tiff?|bmp' },
			tags: { required: true, minlength: 2, maxlength: 200 },
			desc: { required: true, minlength: 10, maxlength: 1000000 }
		},
		messages: {
			file_input: "Select a .torrent file to upload!<br>",
			title: "Enter a title between 2 and 200 characters.<br>",
			image: "The image URL entered was invalid.<br>",
			tags: "Enter at least one tag.<br>",
			desc: "Series description must be a minimum of 10 characters.<br>"
		}
	});
});

var LogCount = 1;

function AddLogField() {
  if (LogCount >= 10) { return; }
  var LogField = document.createElement("input");
  LogField.type = "file";
  LogField.id = "file";
  LogField.name = "logfiles[]";
  LogField.size = 50;
  LogField.accept = ".log,.txt";
  var x = $('#logfields')[0];
  x.appendChild(document.createElement("br"));
  x.appendChild(LogField);
  LogCount++;
}

function RemoveLogField() {
  if (LogCount == 1) { return; }
  var x = $('#logfields')[0];
  for (i=0; i<2; i++) { x.removeChild(x.lastChild); }
  LogCount--;
}

function rewrite_url(append)
{
  var url = document.URL;
  return url.slice(0,url.lastIndexOf("/")) + "/" + append;
}
