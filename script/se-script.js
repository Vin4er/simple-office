/*
 * Name: Simle Editor version 2.0;
 * Developer: Lubinskiy Sergey;
 * Contacts[vk.com]: http://vkontakte.ru/sergey.lyubinsky;
 * Contacts[mail]: Vin4er1@yandex.ru;
 * Changing:	rewrite all code
 #respect amphetamine (o.o)
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
    			'font-type': ["FontName", "FontSize"],
    			'table':[],
	},
	fontsName: ['Arial', 'Tahoma', 'Impact', 'Georgia', 'Courier', 'Verdana', 'Courier New', 'Times New Roman', 'Arial Black'],
	// fontsSize = [],
	/*create table
	 @param: {
	    size.n: int  - cont row
	    size.m: int - cont column
	    attrib: srting - other attr4table
	 	style: string - styles table
	 	val: value
	 }
	 @return: string
	*/
	createListsMenu: function(_tag, _class, _id, _array){
		var list = "",
		array_len = _array.length;
		for(var i = 0; i<array_len; i++){
			list += "<li style='font-family: " + _array[i] + "'>"+ _array[i] +"</li>";
		}
		return "<" + _tag + " id='" + _id + "' class='" + _class + "' >" + list + "</"+_tag+">"
	},
	createTable: function(size, attrib, style, val){
		var tHTML = "",
		ed = this;
		for(var i = 0; i < size.n; i++){
			tHTML +="<tr>";
			for(var j = 0; j < size.m; j++){
				tHTML +="<td style='" + ((style)?style:"") + "'  tr='"+i+"' td='"+j+"'>" + (val?val:"") + "</td>";
			}
			tHTML +="</tr>";
		}
		return "<table " + attrib + " ><tbody>"+tHTML+"</tbody></table>";
	},
	patterns: function(opt){
		var ed  = this;
		switch(opt.name){
			case "CREATE-IFRAME-BODY":
				return "<html><head><link rel='stylesheet' href='" + opt.s_outer + "' /><style>" + opt.s_inner + "</style></head><body contenteditable='true'><div></div></body></html>";
				break;
			case "BACKDROP":
				return "<div class='backdrop'></div>"
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
			case "FONTSIZE-BUTTON-ON-TOOLBAR":
				return "<input type='button' value='' class='e_b' data-type = '" + opt.t + "' id='"+opt.b+"'>";
				break;
			case "FONTNAME-BUTTON-ON-TOOLBAR":
				var html = "<input type='button' value='' class='e_b' data-type = '" + opt.t + "' id='"+opt.b+"'/>"  + ed.createListsMenu("ul", 'toggle', 'font-menu' , ed.fontsName);
				return "<span class='fontname'>" + html + "</span>";
				break;

		}
	}, 
	backdrop: function(d){
		this.find('.backdrop')[0].style.display = d;
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
				var id = _t.buttons[type][i];
				switch(type){
					case "font-type":
						switch(id){
							case "FontSize":
								patternName =  'FONTSIZE-BUTTON-ON-TOOLBAR';
							break;
							case "FontName":
								patternName =  'FONTNAME-BUTTON-ON-TOOLBAR';
							break;
						}
						break;
					default:
						patternName = 'DEFAULT-BUTTON-ON-TOOLBAR';
						break;
				}
				tHTML += _t.patterns({name: patternName, t:type,  b: _t.buttons[type][i]});
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
			_t.find('body')[0].appendChild(_t.createElem(_t.patterns({name: "BACKDROP"}) ))
			_t.find("#toolbar"+id_r)[0].appendChild(_t.createElem(_t.patterns({name: "CREATE-PANEL-TOOLBAR", tb:_t.createToolbar() }) ))
			_t.find('.backdrop')[0].onclick = function(){
				this.style.display = "none"
			  	var toggles = _t.find(".toggle");
			 	for(var i=0; i< toggles.length; i++){
			 		toggles[i].style.display = "none"
			 	}

			 	}

		  	_t.event({eName:'click', tagName:'input', obj: iWin[item]}, function(elem){

		   	 	var clicked = this,
		   	 	dataType = _t.attr(elem, 'data-type');
	   			if(dataType == 'default'){
	   				_t.exec({this: clicked, click: elem.id, bool:false, val: null})
	   			}
	   			if(dataType == 'colorpicker'){						
	   				colorpicker.init({
   						what: [elem], 
   						css: ['backgroundColor'], 
   						func: function(){ //BackColor
   							_t.exec({this: clicked, click: elem.id, bool: false, val: this.color})			
   						}
   					});
	   				
	   			}
	   			if(dataType == "font-type"){
	   				if(clicked.id = "FontName"){
	   					var toggle = _t.find(".fontname .toggle")[0].style;
	   					toggle.display = "block";
						_t.backdrop("block");
						var li = _t.find('#font-menu li'),
						li_len = li.length;
						for(var j = 0; j < li_len; j++){
							li[j].onclick = function(){
								_t.exec({this: clicked, click: elem.id, bool: false, val: this.style.fontFamily});
 								toggle.display = "none";
   								_t.backdrop("none")
   								elem.value = this.style.fontFamily;
							}
						}
	   				}
	   				if(clicked.id = "FontSize"){

	   				}
	   			}
		   	})
		}

	}
}




