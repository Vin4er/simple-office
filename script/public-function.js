/*
  public function
*/

/*
  return user-browser
*/
function browser(){
  var ua = navigator.userAgent;
  if (ua.search(/MSIE/) > 0) return 'IE';
  if (ua.search(/Firefox/) > 0) return 'FF';
  if (ua.search(/Opera/) > 0) return 'Opera';
  if (ua.search(/Chrome/) > 0) return 'Chome';
  if (ua.search(/Safari/) > 0) return 'Safari';
  if (ua.search(/Gecko/) > 0) return 'Gecko';
  return false;
}

/*
  find end return elements on css-selecor
  #id, .class, [attr]
*/
function find(elem){
  return document.querySelectorAll(elem);
}

/*
* create DOM element;
  @param:{
    html: string; 
  }
  @return new DOM element 
*/
function createElem(html) {
  var container = document.createElement('div');
  container.innerHTML = html;
  return container.firstChild
}

/*
  get offset coord element
  @param:{
    el: DOM object
  }
  @return:{
    top: int,
    left: int
  }
*/
function getCoordElem(el) {
    var t = 0, l = 0;
    while(el){
      t = t + parseFloat(el.offsetTop);
      l = l + parseFloat(el.offsetLeft);
      el = el.offsetParent;
    }
    return {
      top: Math.round(t),
      left: Math.round(l)
    }
}
/* function get cursor coords
*  @return:{
      x: int,
      y: int,
    }
SEE IN COLORPICKER METHOD*/ 
// function getMouse(e){
//   e = e || window.event
//   if (e.pageX == null && e.clientX != null ) {
//     var html = document.documentElement; var body = document.body
//     e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0)
//     e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0)
//   }
//   return {
//     x: e.pageX,
//     y: e.pageY
//   }
// }

/*
 create table
 @param: {
    n: int  - cont row
    m: int - cont column
    attrib: srting - other attr4table
 }
 @return: string
*/
function createTable(n, m, attrib){
  var tHTML = "";
  for(var i = 0; i < n; i++){
    tHTML +="<tr>";
    for(var j = 0; j < m; j++){
      tHTML +="<td  tr='"+i+"' td='"+j+"'></td>";
    }
    tHTML +="</tr>";
  }
  return "<table "+attrib.table+" ><tbody>"+tHTML+"</tbody></table><div>&nbsp;</div><div>&nbsp;</div>";
}


/*
  return random number (max; min)
*/
function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
 return need attr
*/
function attr(el, attribute){
  return el.getAttribute(attribute)
}

/*
  generate unique ID
  @param: 
    symb_len: int - count symbols on return id
  @return: string
*/
function genRandId(symb_len){
  var id = "";
  for(i=0; i<symb_len; i++){
    id += getRandomInt(0,9);
  }
  return id;
}


