jQuery(function($j){
    $j('#uploader').change(function(){addFile(this)});
    $j('#uploadform #form').submit(function(){$j('#form input[type=submit]').attr({'disabled':'disabled', 'value':'Uploading...'})});
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
