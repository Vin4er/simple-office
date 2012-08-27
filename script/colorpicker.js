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
  /*
    close colorpicker
  */
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
  /*
    init colorpicker
    @param:
      opt:{
        what: DOM object for change color,
        css: css - array of prop
        func: user-function on time change
      }
  */
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
    cp.radius = (cp.getMask.wheel.offsetWidth/2)-7
    cp.color = cp.what[0].style[cp.css[0]] ||'#ffffff';
    cp._setColor();
    cp._drag();
  },
  /*
    change color
      + call user-function
  */
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
      var x0 = cp.getMouse().x - cp_opt.left - Radius;
      var y0 = -cp.getMouse().y +  cp_opt.top + Radius;
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
        x: (cp.getMouse().x - cp_opt.left - mask_opt.left-D),
        y: (cp.getMouse().y - cp_opt.top - mask_opt.top-D),
      }
      c = cp.conv.RGB2Hex(cp.conv.HSV2RGB(cp.conv.calcHSV()));
    }   
    cp.color =  "#"+cp.conv.RGB2Hex(cp.conv.HSV2RGB(cp.conv.calcHSV(coord)))
    cp.change();  
    ms = marker.style;
    ms.left = ((coord.x >= 0 )&&(coord.x < (mask_opt.width-D))) ? (coord.x +"px") : ms.left ;
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
  /*
    Get mouse coords
    @raturn:{
      x: int,
      y: int
    }
  */
  getMouse: function(e){
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
  },
  /**
  * function draggable
  */
  _drag: function(){
    var cp = this;
    cp.event( document.body,  'click',  // hide colorpiker
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
  /*

  convertate and calculate color
    hex2rgb, rgb2hsv, hsv2rgb, rgb2hex, css2rgb, calcHSV
  */
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
  
}