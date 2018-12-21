function prepareXhrForms() {
    $forms = $j('.xhr-form');
    $forms.each(function (i) {
        var form = $forms[i];
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if($j(form).hasClass('remove')) { // A remove button.
                submitXhrForm(form,function(successResponse) {
                    // Insta-vanish, fade out, capncrush all are misleading and could cause
                    // the accidental removal of two friends in a row.
                    $j(form).closest('.removable').slideUp(500);
                }, function(errorResponse) {
                    alert(errorResponse.error);
                    location.reload(true);
                });
            } else { // A comment form.
                var $scopeDiv = $j(form).closest('div');
                $j('.friend-value', $scopeDiv).toggleClass('hidden-on-js');
                $commentSpan = $j('.comment span', $scopeDiv);
                oldText = $commentSpan.text();
                $commentSpan.text('Loading...');
                submitXhrForm(form,function(successResponse) {
                    /* Response format: {
                     *     comment : (string) contains the comment.
                     *     newToken : (string) HTML to update CSRF token,
                     * }
                     */
                    if(successResponse.comment) {
                        $commentSpan.text(successResponse.comment);
                    } else {
                        $commentSpan.text('');
                    }
                    $j('.csrf', $scopeDiv).html(successResponse.newToken);
                }, function(errorResponse) {
                    $j('.comment span', $scopeDiv).text(oldText);
                    $j('.csrf', $scopeDiv).html(errorResponse.newToken);
                    alert(errorResponse.error);
                    location.reload(true);
                });
            }
        });
    });
}

function addEditClickHandlers() {
    $j('.display-xhr-form').on('click', function (event) {
        $j('.friend-value', $j(this).closest('div')).toggleClass('hidden-on-js');
        return false;
    });
}

// No JS? Keep form visible!
// Hiding on ready instead would make this appear for an instant
// after it finishes loading and before document is ready.
// TODO: Make this hidden-on-js a global thing.
var sheet = window.document.styleSheets[0];
if(sheet.insertRule) {
    sheet.insertRule('.hidden-on-js { display: none; }', sheet.cssRules.length);
}
else if (sheet.addRule) {
    sheet.addRule('.hidden-on-js', 'display: none;', -1);
}

// On Ready
$j(prepareXhrForms);
$j(addEditClickHandlers);
