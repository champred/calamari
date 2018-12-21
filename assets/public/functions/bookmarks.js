$j(function(){
  // [Bookmark(ed)] link
  $j("#bookmark").click(Bookmark_Add);
  $j("#bookmarked").attr('id', 'bookmark').click(Bookmark_Remove);

  // bookmark delete animations
  $j(".del_bookmark_torrent").click(Collage_Bookmark_Remove);
  $j(".del_bookmark").click(function(){
    var parent = $j(this).parent().parent();
    $j.get($j(this).attr('href'), {ajax:1}, function(){
      parent.children('td').each(function(){
        // 1. remove cell padding and margins; delete row when finished
        $j(this).animate({marginTop:0,marginBottom:0,paddingTop:0,paddingBottom:0},'slow',function(){parent.remove()});
        // 2. fade and collapse text
        $j(this).each(function(){
          $j(this).wrapInner('<div />').children('div').animate({
            opacity: 'hide',
            height: 'toggle'
          }, 'slow');
        });
      });
    });
    return false;
  });

  // "(de)select all" links for snatch form
  $j('#bookmarksbtn').before('[<a id="snatch_all">Select all</a> / <a id="snatch_none">Deselect all</a>]<br /><br />');
  $j('#snatch_all').click(function(){$j('#snatchform input:checkbox').each(function(){this.checked = true})});
  $j('#snatch_none').click(function(){$j('#snatchform input:checkbox').each(function(){this.checked = false})});
});

function Bookmark_Add() {
  $j("#bookmark").html('[Bookmarking...]');
  $j.get($j("#bookmark").attr('href'), {ajax:1}).done(function(){
    $j("#bookmark").attr({
      href: $j("#bookmark").attr('href').replace('add', 'remove'),
      });
    $j("#bookmark").html('[Bookmarked]');
    $j("#bookmark").unbind('click');
    $j("#bookmark").click(Bookmark_Remove);
  });
  return false;
}

function Bookmark_Remove() {
  $j("#bookmark").html('[Unbookmarking...]');
  $j.get($j("#bookmark").attr('href'), {ajax:1}).done(function(){
    $j("#bookmark").attr({
      href: $j("#bookmark").attr('href').replace('remove', 'add'),
    });
    $j("#bookmark").html('[Bookmark]');
    $j("#bookmark").unbind('click');
    $j("#bookmark").click(Bookmark_Add);
  });
  return false;
}

function Collage_Bookmark_Remove() {
  $j.get($j(this).attr('href'), {ajax:1}, function(){
    $j("#bookmarks_collage").animate({opacity: 0}, 'fast', function(){
      $j("#bookmarks_collage").load(location.href + ' #bookmarks_collage', function(){
        $j("#bookmarks_collage").animate({opacity: 1}, 'fast');
        $j(".del_bookmark_torrent").click(Collage_Bookmark_Remove);
      });
    });
  });
  return false;
}
