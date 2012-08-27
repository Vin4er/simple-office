/*
 * Name: Simle Editor version 2.0;
 * Developer: Lubinskiy Sergey;
 * Contacts[vk.com]: http://vkontakte.ru/sergey.lyubinsky;
 * Contacts[mail]: Vin4er1@yandex.ru;
 * Changing:	rewrite all code
 #respect amphetamine (o.o)
 */



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
  return random number (max; min)
*/
function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
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


/******************************************/
var se = {	
	cssOuter: "style/se-iframe-style.css",
	cssInner: "body {background:#fff; width:960px;display:block; min-height:1140px;word-wrap: break-word; color:maroon; font-family:tahoma; font-size:12px; } p{margin:0px; word-wrap: break-word; } div{word-wrap: break-word; } a{cursor:pointer}",
    buttons: {
    			'default': ['bold','italic', 'underline','justifyleft', 'justifycenter', 'justifyright','superscript', 'subscript','InsertUnorderedList','InsertOrderedList'],
    			'colorpicker': ['ForeColor', 'BackColor'],
    			'font-type': [],
    			'table':[],
	},
	patterns: function(opt){
		switch(opt.name){
			case "CREATE-IFRAME-BODY":
				return "<html><head><link rel='stylesheet' href='" + opt.s_outer + "' /><style>" + opt.s_inner + "</style></head><body contenteditable='true'><div></div></body></html>";
				break;
			case "TOOLBAR":
				return "<div class='toolbar' id='toolbar"+opt.id_r+"'></div><iframe class='iframe4e' id='" + opt.id_r + "' name='"+opt.id_r+"'></iframe>";
				break;
			case "CREATE-PANEL-TOOLBAR":
				return "<div class='tb_toogle' id='wrap_toolbar_first'>"+opt.tb+"</div>";
				break;
			case "DEFAULT-BUTTON-ON-TOOLBAR":
				return "<input type='button' value='' class='e_b' data-type = '" + opt.t + "' id='"+opt.b+"'>";
				break;
		}
	},   	
  find: function (elem){
    return document.querySelectorAll(elem);
  },

	/*
	 return need attr
	*/
	attr: function(el, attribute){
	  return el.getAttribute(attribute)
	},
 	createElem: function(html) {
    var container = document.createElement('div');
    container.innerHTML = html;
    return container.firstChild
  },
  createToolbar: function(){
		var _t = this,
		tHTML = '',
		tb = _t.find("#toolbar"+_t.id)[0];
		for(var type in _t.buttons){
			var b_l = _t.buttons[type].length;
			for(var i=0; i<b_l; i++){
				tHTML += _t.patterns({name:'DEFAULT-BUTTON-ON-TOOLBAR', t:type,  b: _t.buttons[type][i]});
			}
		}
    return tHTML;
  },	
  /* execComand
		@param:
			ifr:object{
				ifr.this - iframe
				ifr.click - name command
				ift.bool - true/false
				ift.val - value
			}
	*/
	exec: function(ifr){
		return  ifr.this.document.execCommand(ifr.click, ifr.bool, ifr.val);
	},
    // set event
	event: function(options, func){
		var _t = this;
		_t.find("#toolbar"+ _t.id )[0]['on'+options.eName] = function(e){
			var e = e || window.e,
			target = e.target || e.srcElement;
			while(target != this) {
				if ((target.tagName).toLowerCase() == options.tagName) {
					func.call(options.obj, target);
				}
				target = target.parentNode;
			}
		}
	},

	/*
	*init text editor;
	*create iframe, toolbar;
	*/ 
  	init: function(){
		var _t = this,
		iframe = [],
		iDoc = [],
		iWin = [],
		_tb = "Gecko", // type browser
 		editors =  _t.find('[se = "true"]'),
 		e_l = editors.length;
		for(var item = 0; item<e_l; item++){
			var id_r = _t.id = genRandId(10)
			editors[item].innerHTML = _t.patterns({name: "TOOLBAR", id_r: id_r})
			iframe[item] = (browser() ==_tb) ? _t.find("#"+id_r)[0] : frames[id_r],
			iWin[item] = (browser() == _tb) ? iframe[item].contentWindow : iframe[item].window,
			iDoc[item] = (browser() == _tb) ? iframe[item].contentDocument : iframe[item].document;
			iDoc[item].open();  
			iDoc[item].write(_t.patterns({name: "CREATE-IFRAME-BODY", s_outer: _t.cssOuter, s_inner: _t.cssInner}) );
			iDoc[item].close();
			_t.find("#toolbar"+id_r)[0].appendChild(_t.createElem(_t.patterns({name: "CREATE-PANEL-TOOLBAR", tb:_t.createToolbar() }) ));
		  	_t.event({eName:'click', tagName:'input', obj:iWin[item]}, function(elem){
		   	 	var $this = this;
	   			if(_t.attr(elem, 'data-type') == 'default'){
	   				_t.exec({this:$this, click: elem.id, bool:false, val: null})
	   			}
	   			if(_t.attr(elem, 'data-type') == 'colorpicker'){						
	   				colorpicker.init({
   						what: [elem], 
   						css: ['backgroundColor'], 
   						func: function(){ //BackColor
   							_t.exec({this:$this, click: elem.id, bool:false, val: this.color})			
   						}
   					});
	   				
	   			}
		   	})
		}

	}
}




