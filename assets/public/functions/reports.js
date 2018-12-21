HTMLElement.prototype.kill = function() { this.parentNode.removeChild(this); };
HTMLElement.prototype.parentNodeX = function (n) { n = parseInt(n); if (!n||typeof n!=='number') throw 'No number given'; var r = this; for(null; n>0; n--) r = r.parentNode; return r; };
HTMLCollection.prototype.toArray = function () { return Array.prototype.slice.call(this); };
HTMLCollection.prototype.filter = function (f) { var r = []; for (var i=0, e=null; e=this[i]; i++) if(f.call(e, e)) r.push(e); return r; };
Array.prototype.filter = HTMLCollection.prototype.filter;

function silentSubmit(f) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', f.getAttribute('action'));
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            var br = f.nextElementSibling;
            br.kill();
            f.kill();
            fetchNewReports();
        }
        else if (this.readyState === 4 && this.status !== 200) {
            var spans, subCell = f.getElementsByTagName('input').filter(function(e){return e.type=='submit';})[0].parentNode;
            var error = $j(this.responseText).filter('title').text() + '\n\n' + $j(this.responseText).find('.thin').text().replace(/[\s\n]+$/,'');
            if ((spans = subCell.getElementsByTagName('span')).length > 0) {
                spans[0].outerHTML = ' <span style="color: red;" title="'+error+'">(error)</span>';
            } else {
                subCell.innerHTML += ' <span style="color: red;" title="'+error+'">(error)</span>';
            }
        }
    };
    var fd = new FormData(f);
    fd.append('submit', 'Update');
    xhr.send(fd);
}

function fetchNewReports() {
    xhr = new XMLHttpRequest();
    xhr.open('GET', '/reports.php' + window.location.search);
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            var doc = document.implementation.createHTMLDocument();
            doc.documentElement.innerHTML = this.responseText;
            updateReports(doc);
        }
    };
    xhr.send();
}

function updateReports(doc) {
    var newReports = [], oldReports = [];
    $j(doc).find('form[action="reports.php"]').each(function(){
        var id = $j(this).find('a[href^="/reports.php?id="]').attr('href').match(/[0-9]+$/)[0];
        newReports[id] = this;
    });
    $j('form[action="reports.php"]').each(function(){
        var id = $j(this).find('a[href^="/reports.php?id="]').attr('href').match(/[0-9]+$/)[0];
        oldReports[id] = this;
    });
    var boxPad = $j('div[class="box pad"]')[0];
    for (var nRi in newReports) {  // Append new reports
        if (oldReports[nRi] === undefined) {
            boxPad.innerHTML += "\n" + newReports[nRi].outerHTML + "\n<br />";
            $j('input[type="submit"][class!="hidden"]').click(function(e){ e.preventDefault(); silentSubmit(this.parentNodeX(5)); });
            $j('input[type="radio"]').click(function(){ silentSubmit(this.parentNodeX(5)); });
        }
    }
    for (var oRi in oldReports) {  // Remove non-existant (probably dealt with) reports
        if (newReports[oRi] === undefined) {
            oldReports[oRi].nextElementSibling.kill();
            oldReports[oRi].kill();
        }
    }
}

$( document ).ready(function() {
    $j('input[type="submit"][class!="hidden"]').click(function (e) {
        e.preventDefault();
        silentSubmit(this.parentNodeX(5));
    });
    $j('input[type="radio"]').click(function (e) {
        e.preventDefault();
        this.checked = true;
        silentSubmit(this.parentNodeX(5));
    });
});
