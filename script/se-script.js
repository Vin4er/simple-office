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
				return "<input data-toolbar='btn-toolbar' type='button' value='' class='e_b' data-type = '" + opt.t + "' id='"+opt.b+"'>";
				break;
			case "FONTSIZE-BUTTON-ON-TOOLBAR":
				var html = "<span data-toolbar='btn-toolbar' data-type = '" + opt.t + "'   id='"+opt.b+"'  class='fontsize-body e_b'><a class='fontsize-marker'><div class='value'>1</div><div>пт</div></a></span>"
				return "<span class='fontsize'>" + html + "</span>";
				break;
			case "FONTNAME-BUTTON-ON-TOOLBAR":
				var html = "<input data-toolbar='btn-toolbar'  type='button' value='' class='e_b' data-type = '" + opt.t + "' id='"+opt.b+"'/>"  + ed.createListsMenu("ul", 'toggle', 'font-menu' , ed.fontsName);
				return "<span class='fontname'>" + html + "</span>";
				break;

		}
	}, 
  /*
	building toolbar
	@return: html text
  */
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
	backdrop: function(d){
		this.find('.backdrop')[0].style.display = d;
	}, 	
	/*
	colose backdrop and all .toggle
	*/
	closeToggle: function(){
		var ed = this;
		ed.find('.backdrop')[0].onclick = function(){
			this.style.display = "none"
		  var toggles = ed.find(".toggle");
		 	for(var i=0; i< toggles.length; i++){
		 		toggles[i].style.display = "none"
		 	}
		}
	},
 	createElem: function(html) {
    var container = document.createElement('div');
    container.innerHTML = html;
    return container.firstChild
  },
	find: function (elem){
  	return document.querySelectorAll(elem);
	},
 /*
    Get mouse coords
    @raturn:{
      x: int,
      y: int
    }
  */
  getMouse: function(e){
    e = e || window.event;
    if (e.pageX == null && e.clientX != null ) {
      var html = document.documentElement; var body = document.body
      e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0)
      e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0)
    }
    return {
      x: e.pageX,
      y: e.pageY
    }
  },
	/*
	 return need attr
	*/
	attr: function(el, attribute){
	  return el.getAttribute(attribute)
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
	drag: function(){

	},
	event: function(elem, eventName, selectorFunc, handler) {
      elem['on'+eventName] = function(e) {
        var target = e && e.target || e.srcElement;
        while(target != this) {
          if (selectorFunc(target)) {
            return handler.call(target, e);
          }
          target = target.parentNode;
        }
      }
  },
/*
	handler click on button toolbar
*/
	handlerToolbar: function(iframe){
		var ed = this;
		// onclick on toolbar btn				
		ed.event(ed.find('.toolbar')[0], "mousedown", 
			function(el){
				return (ed.attr(el,"data-toolbar") == 'btn-toolbar')
			},
			function(e){
	   	 	var clicked = this,
	   	 	dataType = ed.attr(clicked , 'data-type');
	 			if(dataType == 'default'){
	 				ed.exec({this: iframe, click: clicked.id, bool:false, val: null})
	 			}
	 			// colorpicker
	 			if(dataType == 'colorpicker'){		
	 				console.log(dataType)				
	 				colorpicker.init({
							what: [clicked], 
							css: ['backgroundColor'], 
							func: function(){ //BackColor
								ed.exec({this: iframe, click: clicked.id, bool: false, val: this.color})			
							}
						});			
	 			}
	 			if(dataType == "font-type"){ //if btn font setting
	 				// font-family 
	 				if(clicked.id == "FontName"){
	 					var toggle = ed.find(".fontname .toggle")[0].style;
	 					toggle.display = "block";
						ed.backdrop("block");
						var li = ed.find('#font-menu li'),
						li_len = li.length;
						for(var j = 0; j < li_len; j++){
							li[j].onclick = function(){
								ed.exec({this: iframe, click: clicked.id, bool: false, val: this.style.fontFamily});
								ed.find('.backdrop')[0].onclick();// handler event  closeToggle() method
								clicked.value = this.style.fontFamily;
							}
						}
	 				}
	 				// changind font-size
	 				if(clicked.id == "FontSize"){
	 					ed.backdrop("block");
	 					var marker= clicked.firstChild;
	 					area = {
	 						left: clicked.offsetLeft,
	 						right: clicked.offsetWidth
	 					},
	 					setMarker = function(){
	 						if(marker.offsetLeft >=0 && marker.offsetLeft <= area.right-marker.offsetWidth){
	 					  	var new_left = ed.getMouse().x - area.left - marker.offsetWidth/2;
	 					  	new_left = (new_left < 0) ? 0 : new_left
	 					  	new_left = ((new_left >= area.right - marker.offsetWidth) ? (area.right-marker.offsetWidth ) : new_left)
	 							marker.style.left = ((new_left < 0) ? 0 : new_left)  + "px";
	 							var val = Math.round(marker.offsetLeft/9 + 1); 		
	 							marker.firstChild.innerHTML =  val; 		
	 							ed.exec({this: iframe, click: clicked.id, bool: false, val: val});
	 						}
	 					}
	 					setMarker() 					  
	 					document.body.onmousemove = function(e){
	 						setMarker()
	 					}
	 					document.body.onmouseup = function(){
	 						ed.find('.backdrop')[0].onclick();
	 						ed.backdrop("none");
	 						document.body.onmousemove = false;
	 					}
	 				}
	 			}
		});		
	},
	/*
	*init text editor;
	*create iframe, toolbar;
	*/ 
  	init: function(){
		var ed = this,
		iframe = [],
		iDoc = [],
		iWin = [],
		_tb = "Gecko", // type browser
 		editors =  ed.find('[se = "true"]'),
 		e_l = editors.length;
		for(var item = 0; item<e_l; item++){
			var id_r = ed.id = genRandId(10);
			editors[item].innerHTML = ed.patterns({name: "TOOLBAR", id_r: id_r})
			iframe[item] = (browser() ==_tb) ? ed.find("#"+id_r)[0] : frames[id_r],
			iWin[item] = (browser() == _tb) ? iframe[item].contentWindow : iframe[item].window,
			iDoc[item] = (browser() == _tb) ? iframe[item].contentDocument : iframe[item].document;
			iDoc[item].open();  
			iDoc[item].write(ed.patterns({name: "CREATE-IFRAME-BODY", s_outer: ed.cssOuter, s_inner: ed.cssInner}) );
			iDoc[item].close();
			//create .backdrop and toolbar
			ed.find('body')[0].appendChild(ed.createElem(ed.patterns({name: "BACKDROP"}) ))
			ed.find("#toolbar"+id_r)[0].appendChild(ed.createElem(ed.patterns({name: "CREATE-PANEL-TOOLBAR", tb: ed.createToolbar() }) ));
			ed.closeToggle(); // attached "onclick" for close toggle class and backdrop
			ed.handlerToolbar(iWin[item]); // attached "onclick" for btn on toolbar
		}

	}
}




