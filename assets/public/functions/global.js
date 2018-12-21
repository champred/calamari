var loaderTimeout = 0;

function request(url, meth, data, done) {
    var xhr = new XMLHttpRequest();
    xhr.open((meth.toUpperCase()!=='POST')?'GET':'POST', url);
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (done!==null && done.call!==null) done.call(this, this);
        }
    };
    xhr.send(data);
}

function genkey(s)
{
    return (s ? s : this).split('').map(function(_)
    {
        if (!_.match(/[A-Za-z]/)) return _;
        c = Math.floor(_.charCodeAt(0) / 97);
        k = (_.toLowerCase().charCodeAt(0) - 83) % 26 || 26;
        return String.fromCharCode(k + ((c == 0) ? 64 : 96));
    }).join('');
}

// So far only used in friends and blocked_users
// TODO: Use this wherever it's supposed to be used.
// See Utilities\XhrFormHandler before you change anything here.
function submitXhrForm(formElement, onSuccess, onError) {
    var fd = new FormData(formElement);
    fd.append('jsenabled', 'true');
    request(
        formElement.getAttribute('action'),
        formElement.getAttribute('method') || 'POST',
        fd,
        function (xhr) {
            var response = JSON.parse(this.responseText);
            if (this.status === 200) {
                if (onSuccess!==null && onSuccess.call!==null) onSuccess.call(this, response);
            } else {
                if (onError!==null && onError.call!==null) onError.call(this, response);
            }
        });
}

function toggleChecks(formElem, masterElem) // only used in inbox.php
{
    var checked = !!masterElem.checked;
    for (s = 0; s < document.getElementById(formElem).elements.length; s++) {
        if (document.getElementById(formElem).elements[s].type == "checkbox") {
            document.getElementById(formElem).elements[s].checked = checked;
        }
    }
}

function checkAll(numcheck) // only used in notice.php
{
    for (var i = 1; i <= numcheck; i++) {
        if (!($j("#notify_users" + i).checked)) {
            $j("#notify_users" + i).attr("checked", "true");
        } else {
            $j("#notify_users" + i).attr("checked", "false");
        }
    }
}

function insert_text(open, close) {
    // do not add anything if quickreplytext is hidden (doing preview)
    if (document.getElementById('quickreplytext') != null) {
        if (document.getElementById('quickreplytext').style.display == 'none') {
            return;
        }
    }
    var quick = document.getElementById('quickpost');

    // mozilla support
    if (quick.selectionStart || quick.selectionStart == '0') {
        var startPos = quick.selectionStart;
        var endPos = quick.selectionEnd;
        quick.value = quick.value.substring(0, startPos) + open + quick.value.substring(startPos, endPos) + close + quick.value.substring(endPos, quick.value.length);
        quick.selectionStart = quick.selectionEnd = endPos + open.length + close.length;
        quick.focus();
        if (close.length == 0)
            quick.setSelectionRange(startPos + open.length, startPos + open.length);
        else
            quick.setSelectionRange(startPos + open.length, endPos + open.length);
    }
    // IE support
    else if (document.selection && document.selection.createRange) {
        quick.focus();
        sel = document.selection.createRange();
        sel.text = open + sel.text + close;
        if (close.length != 0) {
            sel.move("character", -close.length);
            sel.select();
        }
        quick.focus();
    }
    // Fallback support for other browsers
    else {
        quick.value += open;
        quick.focus();
        quick.value += close;
    }
}

function hideLoader()
{
    $j('.curtain').hide();
    $j('div[id^="loader_"]').hide().unbind('click');
    try {
        clearTimeout(loaderTimeout);
    } catch (e) {}
}

function showLoader(status)
{
    $j('#loader').hide();
    $j('#loader_' + status).show().click(function() {
        hideLoader()
    });
    loaderTimeout = setTimeout('hideLoader()', 1000);
}

function lockScroll() {
    var positionX = pageXOffset;
    var positionY = pageYOffset;
    $j('html').css('overflow', 'hidden');
    $j('html').data('scrollPosition', {x: positionX, y: positionY});
    window.scrollTo(positionX, positionY);
}

function unlockScroll() {
    $j('html').css('overflow', 'visible');
    var position = $j('html').data('scrollPosition');
    if (position) {
        window.scrollTo(position.x, position.y);
    }
}

function hookScreenshots()
{
    $('a.screenshot').each(function() {
        $(this).featherlight($(this).attr('data-image'), {variant: 'screenshot', type: 'image'});
    });
}

function hideAchievement(id)
{
    $j('#ach_' + id).animate({
        opacity: 0.5
    }, 200);
    $j.get('/xhr/user/achievement/' + id + '/hide', function(response) {
        if (response == 1) {
            // update count
            var count = $j('#achievementCounter').text() - 1;
            $j('#achievementCounter').text(count);
            // hide achievement box
            $j(count ? '#ach_' + id : '#achievementBar').animate({
                opacity: 0,
                height: 0,
                marginTop: 0,
                marginBottom: 0,
                paddingTop: 0,
                paddingBottom: 0
            }, 200, function() {
                $j(this).remove()
            });
        }
    });
}

function capncrunch(trigger, thetarget, expand, crunch, speed, image, hideout) // stays crunchy, even in milk!
{
    if (!hideout && speed) {
        if ($j(thetarget).is(':hidden')) {
            $j(thetarget).fadeIn(speed);
        } else {
            $j(thetarget).fadeOut(speed);
        }
    } else if (!hideout) {
        $j(thetarget).toggle();
    }
    if (image == 1) {
        var src = ($j(trigger).attr("src") == expand) ? crunch : expand;
        $j(trigger).attr("src", src);
    } else if (image == 2) {
        var sclass = ($j(trigger).attr("class") == expand) ? crunch : expand;
        $j(trigger).attr("class", sclass);
    } else {
        $j(trigger).text($j(trigger).text() == expand ? crunch : expand);
    }
    if (hideout == 1 && speed) {
        $j(trigger).addClass(expand);
        if ($j(thetarget).is(':hidden')) {
            $j(thetarget).fadeIn(speed);
        } else {
            $j(thetarget).fadeOut(speed);
            $j(trigger).removeClass(expand);
        }

        $j(document).mouseup(function(e) {
            if ($j(e.target).parent(trigger).length == 0) {
                $j(thetarget).fadeOut(speed);
                $j(trigger).removeClass(expand);
            }
        });
    }
    return false;
}

jQuery(function($) {
    /********************
     * header dropdowns *
     ********************/
    $('li.navmenu').removeClass('nojs');
    $('.dropit').addClass('clickmenu').click(function() {
        if ($(this).parent().find('ul.subnav').is(':hidden')) {
            $('ul.subnav').hide();
            $('li.navmenu').removeClass('selected');
            $(this).parent().addClass('selected').find('ul.subnav').show();
        } else {
            $(this).parent().removeClass('selected').find('ul.subnav').hide();
        }
        return false;
    });
    $('ul.subnav').click(function(e) {
        e.stopPropagation();
    });
    $(document).click(function() {
        $('ul.subnav').hide();
        $('li.navmenu').removeClass('selected');
    });

    /************
     * spoilers *
     ************/
    $(document).on('click', '.spoilerButton', function() {
        var button = $(this);
        button.siblings('.spoiler').each(function() {
            var spoiler = $(this);

            // unhide any hidden images (we need to do this at some point)
            // and we may as well do it even if we're collapsing the spoiler
            // because wat
            spoiler.find('.bbcode_img_spoilered').each(function() {
                var $img = $(this);
                $img.removeClass('bbcode_img_spoilered');
                $img.attr('src', $img.attr('data-src'));
            });

            // now unhide it
            if (spoiler.is(':hidden')) {
                button.attr('value', button.attr('value').replace(/^Show/, 'Hide'));
                spoiler.slideDown(500);
            } else {
                button.attr('value', button.attr('value').replace(/^Hide/, 'Show'));
                spoiler.slideUp(500);
            }
        });
    });

    /*****************
     * feateherlight *
     *****************/
    // wrap img.scaledImg elements in <a> only if they are not already contained within anchors
    $('img.scaledImg').each(function() {
        if (!$(this).parents('a').length) {
            $(this).wrap($('<a />', {
                class: 'scaledImg',
                href: $(this).attr('src')
            }));
        }
    });

    $('a.scaledImg').each(function() {
        $(this).featherlight($(this).attr('href'), {type: 'image'});
    });

    var ABDialog = function(title, content, closable) {
        // any active dialogs?
        if (window.activeDialog) window.activeDialog.remove();

        // build the dialog
        var $cover = $("<div class=\"cover\" style=\"display:none\"></div>");
        var $dialog = $("<div class=\"dialog box\"><div class=\"dialogWrapper\"><div class=\"head\"><span></span><a href=\"\" class=\"closer\">×</a></div><div class=\"content pad\"></div><div class=\"buttons no-buttons\"></div></div></div>");
        var $title = $dialog.find('div.head span');
        var $content = $dialog.find('div.content');
        var $closer = $dialog.find('.closer');
        var $wrapper = $dialog.find('.dialogWrapper');
        var $buttons = $dialog.find('.buttons');
        $dialog.appendTo($cover);
        $cover.appendTo('body');

        var isClosable = true;
        var dialog = this;

        $closer.click(function(e) {
            if (e.which != 1) return;
            if (!isClosable) return;
            e.preventDefault();
            dialog.remove();
        });

        this.remove = function() {
            if (window.activeDialog !== this) return;
            $cover.fadeOut(400, function() {
                $cover.remove();
            });
        };

        this.show = function() {
            if (window.activeDialog) window.activeDialog.remove();
            window.activeDialog = this;
            $cover.fadeIn(function() {
                dialog.rescale();
            });
        };
        this.rescale = function() {
            var contentHeight = $wrapper.outerHeight();
            $dialog.height(contentHeight);
        };

        this.title = function(newTitle) {
            if (!newTitle) return $title.html();
            $title.html(newTitle);
            this.rescale();
            return this;
        };
        this.content = function(newContent) {
            if (!newContent) return $content.html();
            $content.html(newContent);
            this.rescale();
            return this;
        };
        this.closable = function(newClosable) {
            isClosable = newClosable;
            if (!isClosable)
                $closer.hide();
            else
                $closer.show();
        };
        this.buttons = function(newButtons) {
            // this is complex, but I want an array of buttons to show
            $buttons.empty();

            for (var i = 0; i < newButtons.length; i++) {
                var newButton = newButtons[i];
                var $newButton = $("<input type=\"button\" />");
                $newButton.attr('value', newButton.label);
                $newButton.click(newButton.do);
                $newButton.attr('class', newButton.class);
                $newButton.appendTo($buttons);
            }
            if (newButtons.length) {
                $buttons.addClass('has-buttons').removeClass('no-buttons');
            } else {
                $buttons.removeClass('has-buttons').addClass('no-buttons');
            }

            this.rescale();
        };

        if (title)
            this.title(title);
        if (content)
            this.content(content);
        if (closable === true || closable === false)
            this.closable(closable);
        this.rescale();
    };

    /*************************
     * magical confirm links *
     *************************/
    $(".performConfirm").click(function(e) {
        if (e.which != 1) return; // left click
        e.preventDefault();

        var $this = $(this);

        // go go dialog
        var dialog = new ABDialog("One moment...", "Loading...");
        dialog.show();

        var targetUrl = $this.attr('href');
        if (targetUrl.indexOf('?') === -1) {
            targetUrl += '?';
        }
        targetUrl = targetUrl.substring(0, targetUrl.indexOf('?') + 1) + 'fetch_confirm=1&' + targetUrl.substring(targetUrl.indexOf('?') + 1);

        // make an ajax request
        $.ajax({
            url: targetUrl,
            dataType: 'json'
        }).done(function(data) {
            dialog.title(data.title).content(data.content).buttons([{
                "label": "OK",
                "do": function() {
                    console.log('Going ahead.');
                    // make a form
                    var f = $("<form method=\"POST\"><input type=\"hidden\" name=\"auth\" value=\"\"></form>");
                    f.appendTo(document.body);
                    f.find('input').attr('value', CURRENT_USER.authKey);
                    f.attr('action', $this.attr('href'));
                    f.submit();
                },
                "class": "btn-primary"
            }, {
                "label": "Cancel",
                "do": function() {
                    console.log('Cancelling.');
                    dialog.remove();
                },
                "class": "btn-cancel right"
            }]);
        });
    });

    $(".confirmForm").submit(function(e) {
        var myForm = this;
        if (myForm.authed)
            return true;
        var $this = $(this);

        e.preventDefault();

        // go go dialog
        var dialog = new ABDialog("One moment...", "Loading...");
        dialog.show();

        var targetUrl = $this.attr('action');
        if (targetUrl.indexOf('?') === -1) {
            targetUrl += '?';
        }
        targetUrl = targetUrl.substring(0, targetUrl.indexOf('?') + 1) + 'fetch_confirm=1&' + targetUrl.substring(targetUrl.indexOf('?') + 1);

        var formMethod = $this.attr('method');
        var formData = {};

        $this.find('input').each(function() {
            var k = $(this).attr('name');
            if (!k) return;
            var v = $(this).val();
            formData[k] = v;
        });
        console.log(this, formData);

        // make an ajax request
        $.ajax({
            type: formMethod,
            data: formData,
            url: targetUrl,
            dataType: 'json'
        }).done(function(data) {
            dialog.title(data.title).content(data.content).buttons([{
                "label": "Go ahead!",
                "do": function() {
                    console.log('Going ahead.');
                    // make a form
                    var authEntry = $('<input type=\"hidden\" name=\"auth\">');
                    authEntry.attr('value', CURRENT_USER.authKey);
                    authEntry.appendTo($this);
                    myForm.authed = true;
                    $this.submit();
                },
                "class": "btn-primary"
            }, {
                "label": "Cancel",
                "do": function() {
                    console.log('Cancelling.');
                    dialog.remove();
                },
                "class": "btn-cancel right"
            }]);
        });
    });
});


$j(document).ready(function(){
    $.featherlight.defaults.loading = "<p>Loading...</p>";

    $j('#achtoggle').click(function() {
        capncrunch('#achtoggle','#achbar','Show','Hide','100','2','1');
        return false;
    });

    $j('input.quicksearch').each(function(i,searchbox){
        var text = searchbox.value;
        $j(searchbox).focus(function() {
            if (this.value == text) this.value = '';
        });

        $j(searchbox).blur(function() {
            if (this.value == '') this.value = text;
        });
    });
});

function addMultifield(element) {
    // hidden field
    var field = $(element).next().children().clone();
    $(element).parent().append(field);
}

function removeMultifield(element) {
    // Field
    $(element).prev().remove();
    // <br>
    $(element).next().remove();
    // Button
    $(element).remove();
}

var Konami = function (callback) {
    var konami = {
        addEvent: function (obj, type, fn, ref_obj) {
            if (obj.addEventListener)
                obj.addEventListener(type, fn, false);
            else if (obj.attachEvent) {
                // IE
                obj["e" + type + fn] = fn;
                obj[type + fn] = function () {
                    obj["e" + type + fn](window.event, ref_obj);
                };
                obj.attachEvent("on" + type, obj[type + fn]);
            }
        },
        input: "",
        pattern: "38384040373937396665",
        load: function (link) {
            this.addEvent(document, "keydown", function (e, ref_obj) {
                if (ref_obj) konami = ref_obj; // IE
                konami.input += e ? e.keyCode : event.keyCode;
                if (konami.input.length > konami.pattern.length)
                    konami.input = konami.input.substr((konami.input.length - konami.pattern.length));
                if (konami.input == konami.pattern) {
                    konami.code(link);
                    konami.input = "";
                    e.preventDefault();
                    return false;
                }
            }, this);
        },
        code: function (link) {
            window.location = link
        }
    };
    typeof callback === "string" && konami.load(callback);
    if (typeof callback === "function") {
        konami.code = callback;
        konami.load();
    }
    return konami;
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Konami;
} else {
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return Konami;
        });
    } else {
        window.Konami = Konami;
    }
}

new Konami(function() {
    $.post('/achievements?cheat=enabled', { 'key' : md5(CURRENT_USER.authKey + genkey('zntvn')) })
        .done(function( data ) {
            window.location.href = '/achievements?cheat=enabled';
        });
});
