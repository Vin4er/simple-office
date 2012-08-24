/*
 * Name: Simle Editor version 2.0
 * Developer: Lubinskiy Sergey;
 * Contacts: Vin4er1@yandex.ru; http://vkontakte.ru/fucked_brain_php;
 */


/*
 * public function
 */

// return browser
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

// find selector
function find(elem){
	return document.querySelectorAll(elem);
}

//create elem
function createElem(html) {
	var container = document.createElement('div');
	container.innerHTML = html;
	return container.firstChild
}

/* function get cursor coords
*  @return object (x,y)
*/
function getMouse(e){
	e = e || window.event
	if (e.pageX == null && e.clientX != null ) {
		var html = document.documentElement; var body = document.body
		e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0)
		e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0)
	}
	return {
		x: e.pageX,
		y: e.pageY
	}
}


// get coord element
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


/*
 create table
 @return: HTML
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


// использование Math.round() даст неравномерное распределение!
function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function attr(el, attribute){
	return el.getAttribute(attribute)
}

/**/
function genRandId(symb_len){
	var id = "";
	for(i=0; i<symb_len; i++){
		id += getRandomInt(0,9);
	}
	return id;
}


/******************************************/
var colorpicker = {
	what: '',
	position: {},
	color: "",
	radius: "",
	css: "", // options css param {background, color ...}
	mdown: false,
	append: "body",
	class: {
			wrap: 'c-p-wrap',
			marker_wheel: "mark_wheel",
			marker_mask: "mark_mask",
			mask_wheel: "c-p_wheel",
			mask_mask: "c-p_mask",
			backdrop: "c-p-backdrop"
	},
	getMarkers: {},
	getMask: {},
	// h:0,
	func: function(){},
	pattern: function(opt){
		var cp = this;
		switch(opt){
			case "cp": 
				return "<div class='" + cp.class.wrap + "'><div  class='" + cp.class.mask_wheel + "'><div class='" + cp.class.marker_wheel + "' data-type-math='circle'></div></div><div class='" + cp.class.mask_mask + "'><div class='" + cp.class.marker_mask + "'  data-type-math='square'></div></div></div>"
				break;
			case "backdrop":
				return "<div class='" + cp.class.backdrop+ "'></div>"
				break;
		}
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
	close: function(){
		var cp = this,
		place = find(cp.append)[0],
		elems = {
			html_cp: find("." + cp.class.wrap),
			backdrop: find("." + cp.class.backdrop),
			leng:  find("." + cp.class.wrap).length
		}
		for(var item=0; item<elems.leng; item++){
			place.removeChild(elems.html_cp[item]);
			place.removeChild(elems.backdrop[0]);				
		}
	},
	init: function(opt){
		this.close();
		var cp = this,
		color = createElem(cp.pattern('cp')),
		backdrop = createElem(cp.pattern('backdrop')),
		col_s = color.style,
		append = find(cp.append)[0];	
		cp.what = opt.what;
		cp.css = opt.css;	
		cp.func = opt.func;
		col_s.top = (cp.what[0].offsetTop+cp.what[0].offsetHeight) +"px";
		col_s.left = cp.what[0].offsetLeft+"px"; 		
		append.appendChild(color);		
		append.appendChild(backdrop);
		cp.getMarkers = {
			wheel: find('.' + cp.class.marker_wheel)[0],
			mask:  find('.' + cp.class.marker_mask)[0]
		};
		cp.getMask = {
			wheel: find('.' + cp.class.mask_wheel)[0],
			mask: find('.' + cp.class.mask_mask)[0],
		};
		cp.radius =	(cp.getMask.wheel.offsetWidth/2)-7
		cp.color = cp.what[0].style[cp.css[0]] ||'#ffffff';
		cp._setColor();
		cp._drag();
	},
	change: function(){
		var cp = this,
		color = cp.color,
		what = cp.what,
		what_leng = what.length,
		css = cp.css,
		css_leng = css.length;
		for(var i=0; i<what_leng; i++){		
			for(var j=0; j<css_leng; j++){
				cp.what[i].style[cp.css[j]] = color;
			}
		}
		cp.func.call(cp);
	},
	setPos: function(marker){
		var cp = this,
		D = 0//8, // delta for shifts
		parentMask = marker.parentNode,
		Radius =  cp.radius, 
		cp_mask = parentMask.parentNode, // colorpicker div
		tm = marker.getAttribute('data-type-math'), // type of marker;
		cp_opt = { // position colorpicker
			left: cp_mask.offsetLeft,
			top: cp_mask.offsetTop,	
		},
		mask_opt = {// img optionsZZz
			left: parentMask.offsetLeft,
			width: parentMask.offsetWidth,
			top: parentMask.offsetTop,
			height: parentMask.offsetHeight,
		},
		coord = {}, 
		c = false;
		if(tm == "circle"){
			var x0 = getMouse().x - cp_opt.left - Radius;
			var y0 = -getMouse().y +  cp_opt.top + Radius;
			var x =  Math.sqrt((Radius*Radius*x0*x0)/(x0*x0+y0*y0) ),
			y = -(x*y0/x0);
 			x = (x0 > 0) ? (-x) : x;
			y = (x0 > 0) ? (-y) : y;
			// console.log(y)
			coord = {
				x: parseInt(Math.abs(x-Radius)),
				y: parseInt(Math.abs(y-Radius)),
			}
			cp.getMask.mask.style.backgroundColor = "#"+cp.conv.RGB2Hex(cp.conv.HSV2RGB({S:255, V:255,H:cp.conv.calcHSV(coord).H}))
			c = cp.conv.RGB2Hex(cp.conv.HSV2RGB(cp.conv.calcHSV(coord)));
		}else{ // rect
			coord = {
				x: (getMouse().x - cp_opt.left - mask_opt.left-D),
				y: (getMouse().y - cp_opt.top - mask_opt.top-D),
			}
			c = cp.conv.RGB2Hex(cp.conv.HSV2RGB(cp.conv.calcHSV()));
		}		
		cp.color =  "#"+cp.conv.RGB2Hex(cp.conv.HSV2RGB(cp.conv.calcHSV(coord)))
		cp.change();	
		ms = marker.style;
		ms.left	= ((coord.x >= 0 )&&(coord.x < (mask_opt.width-D))) ? (coord.x +"px") : ms.left ;
		ms.top  = ((coord.y >= 0 )&&(coord.y < (mask_opt.height-D))) ? (coord.y +"px") : ms.top;
	},
	_setColor: function(){
		var cp = this,
		color = cp.color;
		cp.getMarkers.wheel.style.left = parseInt(cp.radius*Math.cos((cp.conv.RGB2HSV(cp.conv.CSScl2RGB(color)).H+271)/180*Math.PI)+cp.radius)+'px';
		cp.getMarkers.wheel.style.top  = parseInt(cp.radius*Math.sin((cp.conv.RGB2HSV(cp.conv.CSScl2RGB(color)).H+271)/180*Math.PI)+cp.radius)+'px';
		cp.getMarkers.mask.style.left = parseInt(cp.conv.RGB2HSV(cp.conv.CSScl2RGB(color)).S/255*cp.radius)+'px';
		cp.getMarkers.mask.style.top  = parseInt((255-cp.conv.RGB2HSV(cp.conv.CSScl2RGB(color)).V)/255*cp.radius)+'px';
	},
	/**
	* function draggable
	*/
	_drag: function(){
		var cp = this;
		cp.event( document.body,  'click', 	// hide colorpiker
			function(el){ return el.className == cp.class.backdrop;}, 
			function(e){ cp.close();}
		);	
		cp.event( document.body, 'mousedown', // drag markers - events
			function(el){ return (el.className == cp.class.mask_mask || el.className ==  cp.class.mask_wheel);}, 
			function(e){
				var classname = this.className;
				cp.mdown = true,
				is_mask = (classname == cp.class.mask_mask);
				cp.setPos((is_mask) ? cp.getMarkers.mask : cp.getMarkers.wheel);
				document.body.onmousemove = function(){
					if(cp.mdown != false){
						cp.setPos((is_mask) ? cp.getMarkers.mask : cp.getMarkers.wheel);
					}
				}
				document.body.onmouseup = function(){
					cp.mdown = false;
					cp.setPos((is_mask) ? cp.getMarkers.mask : cp.getMarkers.wheel);
				}
			}
		);
	},
	conv: { // convertate in 
		Hex2RGB: function(HEX){
			var str='';
			if(HEX.length==3){for(var i in HEX){str=str+HEX[i]+HEX[i]};HEX=str;str='';};
			for(var i in HEX){if(HEX[i]=='0'){str=str+HEX[i]}else{break}};
			if(str.length==6){return {R:0, G:0, B:0}};
			if(HEX.length!=6){return false};
			if(HEX!=str+parseInt(HEX,16).toString(16)){return false};
			HEX=parseInt(HEX,16);
			RGB = {R:HEX>>16, G:(HEX&0x00FF00)>>8,B:(HEX&0x0000FF)};
			return RGB;
		},
		RGB2HSV: function (RGB) {
			var h=s=v=0;
			var min = Math.min(RGB.R, RGB.G, RGB.B);
			var max = Math.max(RGB.R, RGB.G, RGB.B);
			var delta = max - min;
			if(max!=0){if(RGB.R==max){h=(RGB.G-RGB.B)/delta}else if(RGB.G==max){h=2+(RGB.B-RGB.R)/delta}else{h=4+(RGB.R-RGB.G)/delta}}else{h=-1};
			h*= 60;
			if(h<0){h += 360};if(max==0){s = max}else{s=255*delta/max};v = max;
			if((RGB.R==RGB.G)&&(RGB.R==RGB.B)){h=0};
			HSV= {H:parseInt(h),S:parseInt(s),V:parseInt(v)};
		return  HSV;
		},
		HSV2RGB: function (HSV) {
			var r,g,b;
			if(HSV.S == 0){r=g=b=HSV.V}
			else {var t1 = HSV.V; var t2 = (255-HSV.S)*HSV.V/255; var t3 = (t1-t2)*(HSV.H%60)/60;
			 if(HSV.H<60){r=t1;b=t2;g=t2+t3}else if(HSV.H<120){g=t1;b=t2;r=t1-t3}else if(HSV.H<180){g=t1; r=t2;b=t2+t3}
			 else if(HSV.H<240){b=t1; r=t2;g=t1-t3}else if(HSV.H<300){b=t1;g=t2;r=t2+t3}else if(HSV.H<360){r=t1;g=t2;b=t1-t3}else{r=0;g=0;b=0}
			};
			if(r<0){r=0}; if(g<0){g=0}; if(b<0){b=0};
			RGB={R:parseInt(r),G:parseInt(g),B:parseInt(b)};
		return RGB;
		},
		RGB2Hex: function (RGB) {
			var HEX = [RGB.R.toString(16),RGB.G.toString(16),RGB.B.toString(16)];
			for(var f=0; f<HEX.length; f++){ if (HEX[f].length == 1){HEX[f] = '0' + HEX[f]};}
		return HEX.join('');
		},
		CSScl2RGB: function (s){
			if( (s=='transparent')||(s=='rgba(0, 0, 0, 0)')||(s=='rgb(0, 0, 0)') ){return {R:0, G:0, B:0}}
			if(s.indexOf('#') != "-1"){
				s = s.substring(1); 
				return colorpicker.conv.Hex2RGB(s);
			}else{
				s=s.substring(4,s.length-1);
				s=s.split(','); 
				return {
					R:parseInt(s[0]),
					G:parseInt(s[1]),
					B:parseInt(s[2])
				}
			}
		},
		calcHSV: function(coords){
			var cp = colorpicker,
			s = parseInt(cp.getMarkers.mask.offsetLeft*255/cp.radius),
			v = parseInt(Math.abs(cp.getMarkers.mask.offsetTop-cp.radius)*255/cp.radius),
			h = false,	
			cp_color = (cp.getMask.mask.style.backgroundColor == "") ? "rgb(0,0,0)" : cp.getMask.mask.style.backgroundColor;
	 		cp.getMask.mask.style.backgroundColor = cp_color;
	 		s = (s>255) ? 255 : ((s<0) ? 0 :  s);
			v = (v>255) ? 255 : ((v<0) ? 0 :  v);
			if(!coords){
				h = cp.conv.RGB2HSV(colorpicker.conv.CSScl2RGB(cp_color)).H
			}else{
				h = 360 - parseInt(coords.y);
				h = (coords.x > 90) ? (360 - h ) :  h;
			} 
			h = (h>=360) ? 360 : ((h<0) ? 0 : h);
			console.log("H:" + h + " V: " + v + " S:"  +s)
		return {H:h, V:v, S:s}
		}
	},
	
},

/******************************************/
se = {	
	lvlUnique: 10,
	cssOuter: "style/se-iframe-style.css",
	cssInner: "body{background:#fff; width:960px;display:block; min-height:1140px;word-wrap: break-word; color:maroon; font-family:tahoma; font-size:12px; } p{margin:0px; word-wrap: break-word; } div{word-wrap: break-word; } a{cursor:pointer}",
    buttons: {	'default': ['bold','italic', 'underline','justifyleft', 'justifycenter', 'justifyright','superscript', 'subscript','InsertUnorderedList','InsertOrderedList'],
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
  createToolbar: function(){
	var _t = this,
	tHTML = '',
	tb = find("#toolbar"+_t.id)[0];
	for(var type in _t.buttons){
		var b_l = _t.buttons[type].length;
		for(var i=0; i<b_l; i++){
			console.log(_t.buttons[type][i])
			tHTML += _t.patterns({name:'DEFAULT-BUTTON-ON-TOOLBAR', t:type,  b: _t.buttons[type][i]});
		}
	}
      return tHTML;
  },
    // set event
	event: function(options, func){
		var _t = this;
		find("#toolbar"+ _t.id )[0]['on'+options.eName] = function(e){
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
	/*
	*init text editor;
	*create iframe, toolbar;
	*/ 
  	init: function(){
		var _t = this,
		iframe = [],
		iDoc = [],
		iWin = [],
		_tb = "Gecko", // type broser
 		editors =  find('[se = "true"]'),
 		e_l = editors.length;
		for(var item = 0; item<e_l; item++){
			var id_r = _t.id = genRandId(_t.lvlUnique)
			editors[item].innerHTML = _t.patterns({name: "TOOLBAR", id_r: id_r})
			iframe[item] = (browser() ==_tb) ? find("#"+id_r)[0] : frames[id_r],
			iWin[item] = (browser() == _tb) ? iframe[item].contentWindow : iframe[item].window,
			iDoc[item] = (browser() == _tb) ? iframe[item].contentDocument : iframe[item].document;
			iDoc[item].open();  
			iDoc[item].write(_t.patterns({name: "CREATE-IFRAME-BODY", s_outer: _t.cssOuter, s_inner: _t.cssInner}) );
			iDoc[item].close();
			find("#toolbar"+id_r)[0].appendChild(createElem(_t.patterns({name: "CREATE-PANEL-TOOLBAR", tb:_t.createToolbar() }) ));
		  	_t.event({eName:'click', tagName:'input', obj:iWin[item]}, function(elem){
		   	 	var $this = this;
	   			if(attr(elem, 'data-type') == 'default'){
	   				_t.exec({this:$this, click: elem.id, bool:false, val: null})
	   			}
	   			if(attr(elem, 'data-type') == 'colorpicker'){
	   				colorpicker.init({
   						what: [elem], 
   						css: ['background','border','color'], 
   						func: function(){ //BackColor
   							_t.exec({this:$this, click: elem.id, bool:false, val: this.color})			
   						}
   					});
	   				
	   			}
		   	})
		}

	}
}

window.onload = function(){
	se.init();
}





