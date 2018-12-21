function preview() {
        if($j('#preview').is(":hidden")){
        $j.post('/ajax.php?action=preview', $j('#artist_info').serialize(),
                function(data){
                        $j('#preview').html(data);
                        $j('#preview').toggle();
                        $j('[value=Preview]').val("Edit");
                        $j('#artist_info').toggle();
                }
        );
        }else{
                $j('[value=Edit]').val("Preview");
                $j('#preview').toggle();
                $j('#artist_info').toggle();
        }
}

