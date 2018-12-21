function promptRemove(id) {
    $.featherlight({ajax: window.location.pathname+'?action=delete&torrentid='+id + ' div[class="thin center"]', afterContent: function(){
        var f = this.$content.find('form')[0];
        $j(f).find('input[type="submit"]').click(function(e){ e.preventDefault(); silentRemove(f, id); });
    }});
}

function silentRemove(f, id) {
    var fd = new FormData(f);
    fd.append('submit', 'Delete');
    $.featherlight.close();
    $.featherlight('<p>Loading...</p>');
    request(f.getAttribute('action'), 'POST', fd, function(xhr){
        if (this.status === 200) {
            $.featherlight.close();
            $j('#torrent_'+id).prev().remove();
            $j('#torrent_'+id).remove();
        } else {
            $.featherlight.close();
            $.featherlight({html: $j(xhr.responseText).find('div[class="thin"]').contents()});
        }
    });
}

function doPruned() {
    $j('td>a:contains(" - Pruned!")').parent().children('span').each(function() {
        var id = $j(this).children('a:contains("RM")')[0].href.match(/torrentid=([0-9]+)/)[1];
        var repl = $j(this).next().text().replace(' - Pruned!', '');
        if (repl) {
            repl = $j('a:contains("'+repl+'"):not(:contains(" - Pruned!"))').get(0);
            if (repl) {
                $j(this).parent().parent().hover(
                    function(){ repl.setAttribute('data-style', repl.getAttribute('style')); repl.parentElement.parentElement.setAttribute('style', 'background-color: rgba(0,255,0,0.125);'); },
                    function(){ repl.parentElement.parentElement.setAttribute('style', repl.getAttribute('data-style')); }
                );
            }
        } else { repl = null; }
        if (id) $j(this).html($j(this).html().replace(']', '| <a href="#" onclick="pruneTorrent(' + id + ((repl)?", '"+repl.href.trim()+"'":'') + ')">Prune</a> ]'));
    });
}

function pruneTorrent(id, repl) {
    var p = prompt("Replaced by:\n(cancel to not prune)", repl);
    if (p!==null) {
        var fd = new FormData();
        fd.append('action', 'takedelete');
        fd.append('torrentid', id);
        fd.append('reason', 'Dead');
        fd.append('extra', p);
        request(window.location.pathname, 'POST', fd, function(){ var tg=$j('tr[id="torrent_'+id+'"]'); tg.prev().remove(); tg.remove(); });
    }
}

function doDuped() {
    function extreme(a, d, r) {
        if (r == null) r = false;
        var h = 0;
        var e = null;
        a = a.toArray();
        for (var i in a) {
            var t = torrentid(a[i]);
            if (d > 0) {
                if (t > h) {
                    h = t;
                    e = a[i];
                }
            } else {
                if (h === 0 || t < h) {
                    h = t;
                    e = a[i];
                }
            }
        }
        return (r) ? e : h;
    }
    function torrentid(t) {
        return +(/torrentid=([0-9]+)/.exec($j(t).attr('href'))[1]);
    }
    function description(t) {
        return $j(t).text().split('\t').slice(-1)[0].split(' - ')[0];
    }
    function prepDupe() {
        var dupe = $j(this);
        var span = dupe.prev();
        var orig = $(extreme($j('a[href^="/torrents.php?id="],a[href^="/torrents2.php?id="]').filter(':contains("' + description(dupe) + '")'), -1, true));
        var oP = orig.parent().parent();
        var dP = dupe.parent().parent();
        dP.hover(
            function(){ oP.attr('data-style', oP.attr('style')); oP.attr('style', 'background-color: rgba(255, 128, 0, 0.25);'); },
            function(){ oP.attr('style', oP.attr('data-style')); }
        );
        span.html(span.html().replace(']', '| <a href="#" onclick="dupeTorrent(' + torrentid(dupe) + ', ' + torrentid(orig) + ')">Dupe</a> ]'));
    }
    $j('a[href^="/torrents.php?id="],a[href^="/torrents2.php?id="]').filter(function(){
        var h = $j('a[href^="/torrents.php?id="],a[href^="/torrents2.php?id="]').filter(':contains("' + description(this) + '")');
        return h.length > 1 && extreme(h, -1, false) < torrentid(this);
    }).each(prepDupe);
}

function dupeTorrent(dupeId, origId) {
    var link = window.location.href.split('/').slice(0, 3).join('/')+(/\/torrents2?\.php\?id=[0-9]+/.exec(window.location.toString())[0]);
    var p = prompt("Dupe of:\n(cancel to not delete)", link + '&torrentid=' + origId);
    if (p!==null) {
        var fd = new FormData();
        fd.append('action', 'takedelete');
        fd.append('torrentid', dupeId);
        fd.append('reason', 'Dupe');
        fd.append('extra', p);
        request(window.location.pathname, 'POST', fd, function(){ var tg=$j('tr[id="torrent_'+dupeId+'"]'); tg.prev().remove(); tg.remove(); });
    }
}

$( document ).ready(function() {
    if (window.location.toString().match(/\/torrents2?\.php\?action=delete/))
        document.addEventListener('keydown', function(e){if(e.shiftKey&&e.which==13){e.preventDefault(); Array.prototype.slice.call(document.getElementsByTagName('form')).pop(-1).submit();}});

    if (window.location.toString().match(/\/torrents2?\.php\?(.+&)*id=[0-9]+/)) {
        doPruned();
        doDuped();
        $j('a[href*="action=delete"]').click(function(e){ e.preventDefault(); promptRemove(this.href.match(/&torrentid=([0-9]+)$/)[1]); });
    }
});
