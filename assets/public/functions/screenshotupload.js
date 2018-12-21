jQuery(function($j){
    $j('#uploader').change(function(){addFile(this)});
    $j('#uploadform #form').attr('target', 'upload_target');
    $j('#uploadform #form').submit(function(){$j('#form input[type=submit]').attr({'disabled':'disabled', 'value':'Uploading...'})});
    $j('#upload_target').load(function(){
        var r = $j(this).contents().find('body').html();
        if (r) addTable(r);
        $j('.upload:gt(0)').remove();
        $j('#uploadQueue_noFlash .item').remove();
        $j('#form input[type=submit]').attr('value', 'Upload').removeAttr('disabled');
    });
});

function addFile(obj) {
    var v = obj.files;
    if(parseInt(v.length) > 10) {
        alert('You can only select maximum of 10 files');
        $j(obj).parent().prepend('<input type="file" class="upload" name="screenshot[]" multiple />').find('input').change(function(){addFile(this)});
        $j(obj).remove();
        return true;
    }
    $j(obj).hide();
    $j(obj).parent().prepend('<input type="file" class="upload" name="screenshot[]" multiple />').find('input').change(function(){addFile(this)});
    for (var i = 0; i < v.length; i++)
    {
        if (v[i].name != '') {
            $j('#uploadQueue_noFlash')
                .append('<div class="item">' + v[i].name + ' (<a class="remove">remove</a>)</div>')
                .find('.remove').click(function(){
                $j(this).parent().remove();
                $j(obj).remove();
                return false;
            });
        }
    }
}

function addTable(html) {
    $j('#uploaded').append($j('tr', html).parent().html());
    $j('#uploaded tr').each(function(){
        var ID = $j(this).find('input[name=ssid]').attr('value');
        $j(this).find('.view').unbind('click').click(function(){
            $j('#curtain').fadeIn(200);
            $j('#lightbox').show().html('<a onclick="Return()"><img src="' + this.href + '" /></a>');
            return false;
        });
        $j(this).find('.set_rating').unbind('change').change(function(){
            $j.post('screenshots.php', {'action':'takeedit', 'ajax':1, 'id':ID, 'rating':this.value, 'spoiler':'-1'});
        });
        $j(this).find('input[name=spoiler]').unbind('change').change(function(){
            $j.post('screenshots.php', {'action':'takeedit', 'ajax':1, 'id':ID, 'spoiler':($j(this).is(':checked') ? '1' : '0')});
        });
        $j(this).find('.remove').unbind('click').click(function(){
            $j.get(this.href, {ajax:1}, function(){$j(this).parent().parent().parent().fadeOut(200)});
            return false;
        });
    });
}
