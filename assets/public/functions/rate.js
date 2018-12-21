function GetXmlHttpObject()
{
var xmlHttp=null;
try
  {
  // Firefox, Opera 8.0+, Safari
  xmlHttp=new XMLHttpRequest();
  }
catch (e)
  {
  // Internet Explorer
  try
    {
    xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
    }
  catch (e)
    {
    xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  }
return xmlHttp;
}
var auth ="";
var groupid ="";
function $S(o) { return((typeof(o)=='object'?o:document.getElementById(o)).style); }
function agent(v) { return(Math.max(navigator.userAgent.toLowerCase().indexOf(v),0)); }
function abPos(o) { var o=(typeof(o)=='object'?o:document.getElementById(o)), z={X:0,Y:0}; while(o!=null) { z.X+=o.offsetLeft; z.Y+=o.offsetTop; o=o.offsetParent; }; return(z); }
function XY(e,v) { var o=agent('msie')?{'X':event.clientX+document.body.scrollLeft,'Y':event.clientY+document.body.scrollTop}:{'X':e.pageX,'Y':e.pageY}; return(v?o[v]:o); }

star={};

star.mouse=function(e,o) { if(star.stop || isNaN(star.stop)) { star.stop=0;

    document.onmousemove=function(e) { var n=star.num;
    
        var p=abPos(document.getElementById('star'+n)), x=XY(e), oX=x.X-p.X, oY=x.Y-p.Y; star.num=o.id.substr(4);

        if(oX<1 || oX>84 || oY<0 || oY>19) { star.stop=1; star.revert(); }
        
        else {

            $S('starCur'+n).width=oX+'px';
            //$S('starUser'+n).color='#CCCCCC';
            document.getElementById('starUser'+n).innerHTML=Math.round(oX/84*100)+'%';
        }
    };
} };

star.update=function(e,o) { var n=star.num, v=parseInt(document.getElementById('starUser'+n).innerHTML);
    var new_v, new_votes;
    n=o.id.substr(4); document.getElementById('starCur'+n).title=v;
    try {
        xmlHttp = new ActiveXObject("Microsoft.XMLDOM");
    } catch(e) {
        xmlHttp = document.implementation.createDocument("","",null);
    }
    xmlHttp.async = false;
    edit_val();
    xmlHttp.load('/torrents.php?action=vote_torrent&groupid='+groupid+'&vote='+v+'&auth='+auth);
    new_v = xmlHttp.getElementsByTagName("v")[0].childNodes[0].nodeValue;
    new_votes = xmlHttp.getElementsByTagName("votes")[0].childNodes[0].nodeValue;
    document.getElementById('votes').innerHTML='('+new_votes+')';
    v=parseInt(new_v);
    $S('starCur'+n).width=Math.round(v*84/100)+'px';
    document.getElementById('starUser'+n).innerHTML=(v>0?Math.round(v)+'%':'');
    //document.getElementById('starUser'+n).style.color='#CCCCCC';
    
    document.onmousemove='';
};

star.revert=function() { var n=star.num, v=parseInt(document.getElementById('starCur'+n).title);

    $S('starCur'+n).width=Math.round(v*84/100)+'px';
    document.getElementById('starUser'+n).innerHTML=(v>0?Math.round(v)+'%':'');
    //document.getElementById('starUser'+n).style.color='#CCCCCC';
    
    document.onmousemove='';

};
