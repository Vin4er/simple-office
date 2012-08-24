/*
#####################################################################
##Name: The Simple Editor;
##Version:  v1.0;
##Date:December 2011;
##Developer: Lubinskiy Sergey;
##Contacts: Vin4er1@yandex.ru; http://vkontakte.ru/fucked_brain_php;
#####################################################################
*/

window.onload = function(){
function browser(){
    var ua = navigator.userAgent;
    if (ua.search(/MSIE/) > 0) return 'IE';
    if (ua.search(/Firefox/) > 0) return 'FF';
    if (ua.search(/Opera/) > 0) return 'Opera';
    if (ua.search(/Chrome/) > 0) return 'Chome';
    if (ua.search(/Safari/) > 0) return 'Safari';
    if (ua.search(/Konqueror/) > 0) return 'Konqueror';
    if (ua.search(/Iceweasel/) > 0) return 'Debian Iceweasel';
    if (ua.search(/Gecko/) > 0) return 'Gecko';
    return 'Search Bot';
}

/*поиск 1 элемента по селектору*/
function el(selector){return document.querySelector(selector);}

/*создание элементов*/
function cr_el(html) { var container = document.createElement('div'); container.innerHTML = html; return container.firstChild}
/*Формирование таблицы*/
function createTable(N, M, attrib){var tHTML = "";
		for(var i = 0; i < N; i++){tHTML +="<tr>";	for(var z = 0; z < M; z++){ tHTML +="<td  tr='"+i+"' td='"+z+"'></td>";} tHTML +="</tr>"; }
		return "<table "+attrib.table+" ><tbody>"+tHTML+"</tbody></table><div>&nbsp;</div><div>&nbsp;</div>";
}
//Получение координат курсора; GetXY(e,"X") or GetCursorXY(e,"Y")
function GetXY(e){
	e = e || window.event
	if (e.pageX == null && e.clientX != null ) {
		var html = document.documentElement; var body = document.body
		e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0)
		e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0)
	}
	return {x:e.pageX, y:e.pageY}
}


//Получение координат объекта
function getLT_el(elem) {
    var top=0, left=0;
    while(elem) { top = top + parseFloat(elem.offsetTop); left = left + parseFloat(elem.offsetLeft); elem = elem.offsetParent;}
    return {top: Math.round(top), left: Math.round(left)}
}

/************Все для колорпикера***************************************************************************/

function Hex2RGB(StribdOfHEX){
	var str='';
	if(StrigdOfHEX.length==3){for(var i in s){str=str+StrigdOfHEX[i]+StrigdOfHEX[i]};StrigdOfHEX=str;str='';};
	for(var i in StrigdOfHEX){if(StrigdOfHEX[i]=='0'){str=str+StrigdOfHEX[i]}else{break}};
	if(str.length==6){return {R:0, G:0, B:0}};
	if(StrigdOfHEX.length!=6){return false};
	if(StrigdOfHEX!=str+parseInt(StrigdOfHEX,16).toString(16)){return false};
	StrigdOfHEX=parseInt(StrigdOfHEX,16);
	RGB = {R:StrigdOfHEX>>16, G:(s&0x00FF00)>>8,B:(s&0x0000FF)};
return RGB;
}
function RGB2HSV(RGB) {
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
}
function HSV2RGB(HSV) {
	var r,g,b;
	if(HSV.S == 0){r=g=b=HSV.V}
	else {var t1 = HSV.V; var t2 = (255-HSV.S)*HSV.V/255; var t3 = (t1-t2)*(HSV.H%60)/60;
	 if(HSV.H<60){r=t1;b=t2;g=t2+t3}else if(HSV.H<120){g=t1;b=t2;r=t1-t3}else if(HSV.H<180){g=t1; r=t2;b=t2+t3}
	 else if(HSV.H<240){b=t1; r=t2;g=t1-t3}else if(HSV.H<300){b=t1;g=t2;r=t2+t3}else if(HSV.H<360){r=t1;g=t2;b=t1-t3}else{r=0;g=0;b=0}
	};
	if(r<0){r=0}; if(g<0){g=0}; if(b<0){b=0};
	RGB={R:parseInt(r),G:parseInt(g),B:parseInt(b)};
return RGB;
}
function RGB2Hex(RGB) {
	var HEX = [RGB.R.toString(16),RGB.G.toString(16),RGB.B.toString(16)];
	for(var f=0; f<HEX.length; f++){ if (HEX[f].length == 1){HEX[f] = '0' + HEX[f]};}
return HEX.join('');
}
function CSScl2RGB(s){
	if( (s=='transparent')||(s=='rgba(0, 0, 0, 0)') ){return {R:0,G:0,B:0}}
	if(s.indexOf('#') != "-1"){s=s.substring(1); return Hex2RGB(s);}
	else{s=s.substring(4,s.length-1);s=s.split(','); return {R:parseInt(s[0]),G:parseInt(s[1]),B:parseInt(s[2])}}
}
function EditColors(Color){
	if(	el("#c-p_wrap").getAttribute("type") == "textcolor"){iWin.document.execCommand("ForeColor", false, "#"+Color);}
	if(	el("#c-p_wrap").getAttribute("type") == "bgcolor"){iWin.document.execCommand("BackColor", false, "#"+Color);}
    el("#color_out").value= Color;
}

function init_cpkr(){
	function setMarker(color){
		el("#mark_wheel").style.left = parseInt(85*Math.cos((RGB2HSV(CSScl2RGB(color)).H+271)/180*Math.PI))+85+'px';
		el("#mark_wheel").style.top  = parseInt(85*Math.sin((RGB2HSV(CSScl2RGB(color)).H+271)/180*Math.PI))+89+'px';
		el("#mark_mask").style.left = parseInt(RGB2HSV(CSScl2RGB(color)).S/255*85)+'px';
		el("#mark_mask").style.top  = parseInt((255-RGB2HSV(CSScl2RGB(color)).V)/255*85)+'px';
		el("#color_out").value = RGB2Hex(CSScl2RGB(color))
		//alert(RGB2HSV(CSScl2RGB(color)).H)
	}
	if(el("#c-p_wrap").getAttribute("type") == "bgcolor")  { setMarker(iWin.document.queryCommandValue("BackColor"))}
	if(el("#c-p_wrap").getAttribute("type") == "textcolor"){ setMarker(iWin.document.queryCommandValue("ForeColor"))}
}
/******************************************************************************************************************/
//перемещение {option={f - figure,d - weel or mask ,p - mask}}
function drag_and_drop(e,selector, option){
	el(option.d).onmousedown = function(){
		function textsize_preload(e){ //Функция для установки маркера размера текста
			el(selector).style.left = parseInt(GetXY(e).x-el(option.d).offsetLeft)+"px";
			if(parseInt(el(selector).style.left)<0 ){el('#num_size').innerHTML= 1+"пт";	el(selector).style.left =   0+"px";}
			if(parseInt(el(option.d).offsetWidth)-8 < parseInt(el(selector).style.left)){
				el('#num_size').innerHTML= 7+"пт";	el(selector).style.left = ( parseInt(el(option.d).offsetWidth)-7)+"px"
			}
			var temp = parseInt(el(selector).style.left);
			el('#num_size').innerHTML=parseInt(temp/7)+1+"пт";
			iWin.document.execCommand("fontSize", null, parseInt(el('#num_size').innerHTML));
		}
	    function setPos(e){/*Функция установки позиции перемещаемых объектов*/
			if(option.length == 0){  //Если параметры не заданны
				el(selector).style.left = GetXY(e).x -el("#c-p_wrap").offsetLeft-el(option.d).offsetLeft+"px";
              	el(selector).style.top = GetXY(e).y -el("#c-p_wrap").offsetTop-el(option.d).offsetTop+"px";
			}
			if(option.f == "rect"){//Если маска на колорпикере
				//el(selector).style.position = 'absolute';
				if( ((el("#c-p_wrap").offsetLeft+el(option.d).offsetLeft-3+8) < GetXY(e).x)&&((el("#c-p_wrap").offsetLeft+el(option.d).offsetLeft)+85+8 >= GetXY(e).x )){
					el(selector).style.left = GetXY(e).x -el("#c-p_wrap").offsetLeft-el(option.d).offsetLeft-8+"px";
				}
				if( ((el("#c-p_wrap").offsetTop+el(option.d).offsetTop-3+8) < GetXY(e).y)&&((el("#c-p_wrap").offsetTop+el(option.d).offsetTop)+85+8 >= GetXY(e).y )){
					el(selector).style.top = GetXY(e).y -el("#c-p_wrap").offsetTop-el(option.d).offsetTop-8+"px";
				}
	            var S=parseInt(parseInt(el(selector).style.left)*255/85);
				var V=parseInt(Math.abs(parseInt(el(selector).style.top)-85)*255/85);
	            if(S>255){S = 255}  if(V>255){V = 255}
	            if(S<0){S = 0}  if(V<0){V = 0}
	            if(el(option.d).style.backgroundColor == ""){var c_p_color = "rgb(0,0,0)"}else{c_p_color = el(option.d).style.backgroundColor}
	            var H= RGB2HSV(CSScl2RGB(c_p_color)).H;
	            if(H>360){H = 360} if(H<0){H =0}
				EditColors(RGB2Hex(HSV2RGB({S:S,H:H,V:V})))

			}
			if(option.f == "circle"){	//Если окружность на колорпикере
				el(selector).style.position = 'absolute';
				var x2=  GetXY(e).x- getLT_el(el(option.d)).left-parseInt(85);
				var y2= -GetXY(e).y+ getLT_el(el(option.d)).top+parseInt(85);
				var x=Math.sqrt(parseInt(85)*parseInt(85)*x2*x2/(x2*x2+y2*y2));
				var y= -(x*y2/x2);
				if(x2>0){x=-x;y=-y}
				H=parseInt(Math.acos(y/parseInt(85))*180/Math.PI);
				if(x>0){H=2*180-H}	if((y2<0)&&(x==0)){H=180}	if((y2>0)&&(x==0)){H=0}
				el(selector).style.left  =  parseInt(Math.abs(x-parseInt(85)))+5+'px';
				el(selector).style.top  =  parseInt(Math.abs(y-parseInt(85)))+5+'px'
				var S=parseInt(el("#mark_mask").offsetLeft*255/85);
				var V=parseInt(Math.abs(el("#mark_mask").offsetTop-85)*255/85);
				if(S>255){S = 255}  if(V>255){V = 255} if(S<0){S = 0}  if(V<0){V = 0}
				EditColors(RGB2Hex(HSV2RGB({S:S,H:H,V:V})));
				el("#c-p_mask").style.backgroundColor = "#"+RGB2Hex(HSV2RGB({H:H,S:255,V:255}))
			}
			if(option.f == "line"){textsize_preload(e)}//Если  градусник textsize
		}
		this.setAttribute('drag','1'); //MouseDown
		setPos(e);
		el('body').appendChild(cr_el("<div id='cursor_line_helper'></div>"));
		el('body').onmousemove = function(e){if(el(option.d).getAttribute('drag')==1){setPos(e)}}
	}
	window.onmouseup = function(){el('[drag = "1"]').setAttribute("drag","0");  el('body').removeChild(el('#cursor_line_helper'))}
}


/** Инициализация Колор-пикера **********/
function setColorPiker(e,type){
	clearOtherBlock()
	var type_cpk = type;
	var top = (el('#'+type).offsetTop+el('#'+type).offsetHeight), left = el('#'+type).offsetLeft;
	var block_color =  "<div id='c-p_wrap' type='"+type_cpk+"'  style='top:"+(top+2)+"px; left:"+left+"px; z-index:10'>";
		block_color +=		"<div id='c-p_wheel' drag='0'><div id='mark_wheel' class='marker'></div></div><div id='c-p_mask' drag='0'> <div id='mark_mask' class='marker'></div></div>";
		block_color +=		"<div id='wrap_change'><input type='button' id='ch_color' value='Change Color'>#<input type='text' id='color_out'></div>";
		block_color += "</div>";
   el('body').appendChild(cr_el(block_color));

   el("#c-p_wheel").onmouseover = function(e){drag_and_drop(e,"#mark_wheel",{f:"circle", d:"#c-p_wheel"});}
   el("#c-p_mask" ).onmouseover  = function(e){drag_and_drop(e,"#mark_mask" ,{f:"rect",   d:"#c-p_mask" });}
   el("#ch_color").onclick = function(){if(el("#c-p_wrap")!= null)  el('body').removeChild(el("#c-p_wrap"))}
   init_cpkr();
}


/*##################################################################################################
####################################################################################################
 ТАБЛИЦЫ ТАБЛИЦЫ ТАБЛИЦЫ ТАБЛИЦЫ ТАБЛИЦЫ ТАБЛИЦЫ ТАБЛИЦЫ ТАБЛИЦЫ ТАБЛИЦЫ ТАБЛИЦЫ ТАБЛИЦЫ ТАБЛИЦЫ
####################################################################################################*/
/*Фикс таблиц (случ удаление внутренних блоков, вставка из ворда и тд и тп)*/
function table_fix(){ /*Возможны баги при удалении текста и тд.на мозиле..*/
	var fix_t = iWin.document.querySelectorAll("table");
	var helpet_fix_td = iWin.document.querySelectorAll("td");
 	for(var ti=0; ti<fix_t.length; ti++){
 		if(fix_t[ti].getAttribute('resize')!='auto'){
			if((el('#toolbar').offsetWidth-50)<fix_t[ti].querySelector("tbody").offsetWidth){
		      	fix_t[ti].setAttribute('resize','auto');
		      	fix_t[ti].setAttribute('tbody', fix_t[ti].querySelector("tbody").offsetWidth);
		      	var fix_td = fix_t[ti].querySelectorAll("td .wrap_text");
		      	var td_s = fix_t[ti].querySelectorAll('td').length/fix_t[ti].querySelectorAll('tr').length;
		      	for(var ty=0; ty<fix_td.length; ty++){
                 fix_td[ty].style.width= parseInt(fix_td[ty].parentNode.offsetWidth-((fix_t[ti].getAttribute('tbody')-el('#toolbar').offsetWidth+200)/(td_s+2)))+"px"; //(((parseInt(fix_t[ti].getAttribute('tbody'))-el('#toolbar').offsetWidth-50)/(parseInt(td_s)+1)))+"px";
		      	}
		      	fix_t[ti].setAttribute('resize','none');
			}else{
				fix_t[ti].setAttribute('resize','none');
			}
		}
	}
  	if(helpet_fix_td.length!=iWin.document.querySelectorAll(".wrap_text").length){
	   for(var ti=0; ti<fix_t.length; ti++){
			fix_t[ti].className = "iWinTable"; fix_t[ti].setAttribute("style", "margin = 10px")
	   	    fix_t[ti].removeAttribute("border"); fix_t[ti].removeAttribute("cellspacing"); fix_t[ti].removeAttribute("cellpadding");
	        var fix_tr = fix_t[ti].querySelectorAll("tr");
	        for(var ty=0; ty<fix_tr.length; ty++){
	          	var fix_td = fix_tr[ty].querySelectorAll("td");
	          	for(var tx=0; tx<fix_td.length; tx++){
	          		fix_td[tx].removeAttribute("valign");fix_td[tx].removeAttribute("width");fix_td[tx].removeAttribute("style");
                    fix_td[tx].setAttribute('tr',ty); fix_td[tx].setAttribute('td',tx);
                    if(fix_td[tx].querySelectorAll(".wrap_text").length<=0 ){
                    	fix_td[tx].innerHTML = "<div  class='wrap_text'  style='min-height:30px; width:"+(el('#toolbar').offsetWidth/fix_td.length-30)+"px'  tr='"+ty+"'  td='"+tx+"' ><div class='td_wrap_text' >"+ fix_td[tx].innerHTML+"&nbsp;</div></div>"
	                }fix_td[tx].onmousemove = function(e){setResizeTable(e,this); }
	                 fix_td[tx].onmousedown = function(e){ active_TD = this;}
	        	}
	        }
	   }
  }
}//###################
/*********Инициализация ресайза*********/
function resize_init(td, selector,style){
	var startX, startY;
	if(el("#"+selector)==null){el('body').appendChild(cr_el("<div id='"+selector+"' "+style+" ></div>"));}
	el("#"+selector).onmousedown = function(eve){
		el('body').appendChild(cr_el("<div id='cursor_line_helper'></div>"));
		this.setAttribute('draggable','start');
		startX = GetXY(eve).x;	startY =  GetXY(eve).y;
	}
	document.onmousemove = function(eve){
		if(el('[draggable = "start"]') != null){el('[draggable = "start"]').setAttribute('draggable','drag');}
		if(el('[draggable = "drag"]') != null){
			if(selector == 'v_cursor_line'){/*Проверка, если ли следующий столюбец*/
				var need_td_next = td.parentNode.parentNode.parentNode.querySelector("[td = '"+(parseInt(td.getAttribute('td'))+1)+"']");
				if(need_td_next!=null){ // Если не последний столбец таблицы
					if((getLT_el(td).left+el('#toolbar').offsetLeft+55)<GetXY(eve).x && (startX+need_td_next.offsetWidth-65)>=GetXY(eve).x) {
						el('[draggable = "drag"]').style.left = GetXY(eve).x+"px";
					}
				}else{ // Если последний столбец таблицы
					if((getLT_el(td).left+el('#toolbar').offsetLeft+55)<GetXY(eve).x && ((el('#toolbar').offsetLeft+el('#toolbar').offsetWidth-50))>=GetXY(eve).x){
						el('[draggable = "drag"]').style.left = GetXY(eve).x+"px";
					}
				}
			}
			//if(selector == 'h_cursor_line'){el('[draggable = "drag"]').style.top = GetXY(eve).y+"px";}
		}
	}
	document.onmouseup = function(eve){
	    if(selector == 'v_cursor_line'){   //Если горизонтальная
			var need_td = td.parentNode.parentNode.parentNode.querySelectorAll("[td = '"+td.getAttribute('td')+"'] .wrap_text");
			var need_td_next = td.parentNode.parentNode.parentNode.querySelectorAll("[td = '"+(parseInt(td.getAttribute('td'))+1)+"'] .wrap_text");
			var coordX = el('#v_cursor_line').offsetLeft;
		   	/*Высчитываение смещения маркера, ширbye текущего и следующего столбца */
			var line_coord = need_td[0].parentNode.offsetLeft+el('#toolbar').offsetLeft + need_td[0].parentNode.offsetWidth;
			var new_width = parseInt(need_td[0].style.width)-(line_coord-coordX+td.parentNode.parentNode.parentNode.offsetLeft-el('#v_cursor_line').offsetWidth)+"px"
			// если есть следующий столбец , то выщитываем его ширину
			if(need_td_next[0] != undefined){var new_width_next = parseInt(need_td_next[0].style.width)+(line_coord-coordX+td.parentNode.parentNode.parentNode.offsetLeft-el('#v_cursor_line').offsetWidth)+"px"}
			for(n_td=0; n_td<need_td.length; n_td++){ /* присовение новых значений*/
				need_td[n_td].style.width = new_width;
	            if(need_td_next[0] != undefined){ need_td_next[n_td].style.width = new_width_next}
			}
		}
	    if(selector == 'h_cursor_line'){ //Если горизонтальная, то урезанный аналог веще написанного кода
			var need_td = td.parentNode.parentNode.parentNode.querySelectorAll("[tr = '"+td.getAttribute('tr')+"'] .wrap_text");
			var line_coord = need_td[0].parentNode.offsetTop + el('#toolbar').offsetTop + parseInt(need_td[0].parentNode.offsetHeight)+el('#toolbar').offsetHeight+td.parentNode.parentNode.parentNode.offsetTop
   			var coordY = el('#h_cursor_line').offsetTop;
   			/*
 Ошибка в расчете ?!
   			*/
   			for(n_td=0; n_td<need_td.length; n_td++){
				need_td[n_td].style.height =  parseInt(need_td[0].offsetHeight)-(line_coord-coordY-el('#h_cursor_line').offsetHeight+td.parentNode.parentNode.parentNode.offsetTop)+"px"
			}
		}
		if(el('[draggable = "drag"]') != null){el('[draggable = "drag"]').setAttribute('draggable','stop');}
		if(el('[draggable = "start"]') != null){el('[draggable = "start"]').setAttribute('draggable','stop');}
		if(el('#cursor_line_helper') != null){el('body').removeChild(el("#cursor_line_helper"))}
		if(el("#"+selector) != null){el('body').removeChild(el("#"+selector))}
	}
}//###################

/******** Resize TD in Table ****************/
function setResizeTable(e, is_td){
iWin.document.body.focus();
	var table = is_td.parentNode.parentNode.parentNode;
	var r_b =  table.offsetLeft +  is_td.offsetLeft +  is_td.offsetWidth, t_b =  table.offsetTop  +  is_td.offsetTop  + is_td.offsetHeight;
	if(el('[draggable = "drag"]')==null){
		if((GetXY(e).x+10)>r_b  && (GetXY(e).x-10)<r_b){
			resize_init(is_td, 'v_cursor_line', "style='left:"+(r_b+el('#toolbar').offsetLeft-6)+"px; top:"+(el('#toolbar').offsetTop+el('#toolbar').offsetHeight+table.offsetTop)+"px; height:"+(table.offsetHeight)+"px'")
		}else{
			if((GetXY(e).y+10)>t_b && (GetXY(e).y-10)<t_b){
			//	resize_init(is_td, 'h_cursor_line', "style='top:"+(t_b+el('#toolbar').offsetTop+el('#toolbar').offsetHeight-6)+"px; left:"+(el('#toolbar').offsetLeft+table.offsetLeft)+"px; width:"+(table.offsetWidth)+"px'")
			}else{
				if(el('[draggable = "drag"]')==null){
					if(el('#v_cursor_line')!=null){el('body').removeChild(el("#v_cursor_line"))}
					if(el('#h_cursor_line')!=null){el('body').removeChild(el("#h_cursor_line"))}
					if(el('#cursor_line_helper') != null){el('body').removeChild(el("#cursor_line_helper"))}
				}
			}
		}
	}
}

/******** Set Table  ****************************************/
function setTable(){
    toggleToolbar('table');

	function create_table_in_text(_this){
		clearOtherBlock()
	  	var tr = parseInt(_this.getAttribute('tr'))+1, td=parseInt(_this.getAttribute('td'))+1;
		var ins_table = createTable(tr,td,{table:" class ='iWinTable' "})
     	iWin.document.body.focus(); iWin.document.execCommand('InsertHtml','', ins_table);
     	table_fix();
	}
/* Event for Table */
	el('#addTable').onmousedown = function(){
		clearOtherBlock()
		el('body').appendChild(cr_el(createTable(7,7, {table:"id='cr_table_table' style='top:"+((el('#addTable').offsetTop+3)+el('#addTable').offsetHeight  )+"px; left:"+(el('#addTable').offsetLeft)+"px'"})))
        var cr_td = document.querySelectorAll("#cr_table_table td");
		for(var i_cr=0;i_cr<cr_td.length;i_cr++ ){cr_td[i_cr].onmousedown = function(){create_table_in_text(this)}}
	}
	el('#addRowBottom').onmouseup = function(){
		var table = active_TD.parentNode.parentNode.parentNode;
		var tr_s = table.querySelectorAll('tr').length, td_s = table.querySelectorAll('td').length/tr_s;
		var n_tr = table.insertRow(parseInt(active_TD.getAttribute('tr'))+1)
		for(var td_inc = 0; td_inc<td_s;td_inc++ ){n_tr.insertCell(td_inc)}
	}
	el('#addRowTop').onmouseup = function(){
		var table = active_TD.parentNode.parentNode.parentNode;
		var tr_s = table.querySelectorAll('tr').length, td_s = table.querySelectorAll('td').length/tr_s;
		var n_tr = table.insertRow(active_TD.getAttribute('tr'))
		for(var td_inc = 0; td_inc<td_s;td_inc++ ){n_tr.insertCell(td_inc)}
	}
	el('#addColLeft').onmouseup = function(){
        var table = active_TD.parentNode.parentNode.parentNode;
        var tr_s = table.querySelectorAll('tr').length;
        var n_td =table.querySelectorAll('tr');
        var td_s = table.querySelectorAll('td').length/tr_s;
        if(td_s<10){for(var tr_inc = 0; tr_inc<tr_s;tr_inc++ ){n_td[tr_inc].insertCell(active_TD.getAttribute('td'));}
		}else{alert("limit 10")}
	}
	el('#addColRight').onmouseup = function(){
        var table = active_TD.parentNode.parentNode.parentNode;
        var tr_s = table.querySelectorAll('tr').length;
        var n_td =table.querySelectorAll('tr');
        var td_s = table.querySelectorAll('td').length/tr_s;
  		if(td_s<10){for(var tr_inc = 0; tr_inc<tr_s;tr_inc++ ){n_td[tr_inc].insertCell(parseInt(active_TD.getAttribute('td'))+1)}
   		}else{alert("limit 10")}
	}
	el('#DelRow').onmouseup = function(){
 		var table = active_TD.parentNode.parentNode.parentNode;
		table.deleteRow(active_TD.getAttribute('tr')-1)
 	}
	el('#DelCol').onmouseup = function(){
 		var table = active_TD.parentNode.parentNode.parentNode;
 		var tr_s = table.querySelectorAll('tr').length;
 		var tr_s_ = table.querySelectorAll('tr')
 		for(var tr_inc = 0; tr_inc<tr_s;tr_inc++ ){tr_s_[tr_inc].deleteCell(active_TD.getAttribute('td')-1)}
	}
    el('#CloseTableEdit').onmouseup = function(){toggleToolbar('first');clearOtherBlock();}
}
/*------------------------------------------------------*/

/********* УСТАНОВКА ССЫЛКИ ****************/
function setLink(){
	clearOtherBlock()
	toggleToolbar('link');
	el("#ApplyLink").onmousedown = function(){
		if(el('#addLink').value == ""){
			toggleToolbar('first');
		}else{
			iWin.document.execCommand('CreateLink', null, el('#addLink').value);
			toggleToolbar('first');
			el('#addLink').value = "";
		}
	}
	el("#UnLink").onmousedown = function(){
			iWin.document.execCommand('Unlink', null, false);
	}
	el("#linkClose").onmousedown = function(){
	  toggleToolbar('first');
	}

}
function link_fix(){
	var linker = iWin.document.queryCommandValue('CreateLink');
	if(linker !=false){el('#addLink').value = linker;}
	var fix_a = iWin.document.querySelectorAll("a");
	for(var a_i=0; a_i<fix_a.length; a_i++){
 	    fix_a[a_i].onmouseover = function(){
 			var overlink = this;
 			this.setAttribute('link', 'over');
 			el('body').appendChild(cr_el("<div class='flyover' id='flyover_link' style='top:"+(this.offsetTop+el('#toolbar').offsetTop+el('#toolbar').offsetHeight)+"px; left:"+(this.offsetLeft+el('#toolbar').offsetLeft)+"px'><a target='_blank' href='"+overlink.getAttribute('href')+"'>Go Link</a></div>"));
  	    }
 	    fix_a[a_i].onmouseout = function(){ el('body').removeChild(el('#flyover_link'))}
	}

}

/********* УСТАНОВКА КАРТИНКИ ****************/
function setImage(){
	clearOtherBlock();
	toggleToolbar('image');
	el("#ApplyImage").onmousedown = function(){
		if(el('#addImage').value == ""){
			toggleToolbar('first');
		}else{
			iWin.document.execCommand('InsertImage', null, el('#addImage').value);
			toggleToolbar('first');
			el('#addImage').value = "";
		}
	}
	el("#imageClose").onmousedown = function(){
	  toggleToolbar('first');
	}
}
function image_fix(){
	var linker = iWin.document.queryCommandValue('InsertImage');
	if(linker !=false){el('#addLink').value = linker;}
	var fix_a = iWin.document.querySelectorAll("img");
	for(var a_i=0; a_i<fix_a.length; a_i++){
		fix_a[a_i].setAttribute("WIDTH", parseInt(fix_a[a_i].offsetWidth));
		fix_a[a_i].setAttribute("HEIGHT", parseInt(fix_a[a_i].offsetHeight));
		fix_a[a_i].style.margin = '0px 10px 0px 10px';
		fix_a[a_i].style.float = 'none';
		fix_a[a_i].setAttribute("align","left")
	}
}

/********* УСТАНОВКА ШРИФТА ****************/
function setFontFamily(){
  	clearOtherBlock()
    var fontfamily ="<table id='fontfamily' style='top:"+(el('#font_type').offsetTop+el('#font_type').offsetHeight+5)+"px; left:"+(el('#font_type').offsetLeft+1)+"px'>";
		fontfamily +="	 <tr><td style='font-family:Tahoma'>Tahoma</td><td style='font-family:Arial'>Arial</td><td style='font-family:Arial Black'>Arial Black</td></tr>";
		fontfamily +="	 <tr><td style='font-family:Georgia'>Georgia</td><td style='font-family:Impact'>Impact</td><td style='font-family:Courier New'>Courier New</td></tr>";
		fontfamily +="	 <tr><td style='font-family:Courier'>Courier</td><td style='font-family:Verdana'>Verdana</td><td style='font-family:Times New Roman'>Times New Roman</td></tr>";
		fontfamily +="</table>";
		el('body').appendChild(cr_el(fontfamily));
		var td_all = el("#fontfamily").querySelectorAll('td');
		for(var ui=0; ui<=td_all.length; ui++){
			td_all[ui].onmousedown = function(){
				var nameFont = this.innerHTML;
                iWin.document.execCommand("fontName", null, nameFont);
                el('body').removeChild(el("#fontfamily"));
                el('#font_type').value = nameFont;
                el('#font_type').style.fontFamily = nameFont;
			}
		}
}
/******** Удаление блоков, всех кроме активных*******************/
function clearOtherBlock(){if(el("#cursor_line_helper")!= null){el('body').removeChild(el('#cursor_line_helper')) }
	if(el("#fontfamily")!= null){el('body').removeChild(el("#fontfamily"))}
  	if(el("#c-p_wrap")!= null){el('body').removeChild(el("#c-p_wrap"))}
  	if(el("#cr_table_table")!= null){el('body').removeChild(el("#cr_table_table"))}

}


/*****************toggleToolbar*********************************/
function toggleToolbar(tb_mode){
	var tb_toogle = document.querySelectorAll(".tb_toogle");
    for(var t_inc = 0; t_inc<tb_toogle.length; t_inc++){tb_toogle[t_inc].style.display="none";}
	el("#wrap_toolbar_"+tb_mode).style.display="block";
}
/***** init iframe **************************************************************************/
function page_fix(){ //Продление листа
	if (iWin.document.body.scrollHeight > iWin.document.body.clientHeight) {
	     	el("#frameId").style.height  = (parseInt(el("#frameId").offsetHeight)+1000) + "px";
	    	 el("#text").style.height =(parseInt(el("#text").offsetHeight)+1000)+"px"
	}
}

/*замена всех переносов строк */
function fix_text(){
/*var all_p = iWin.document.querySelectorAll('p');
	for(var p_i=0; p_i<all_p.length; p_i++){all_p[p_i].outerHTML = "<div>"+all_p[p_i].innerHTML+"</div>";}  */
/*var all_div = iWin.document.querySelectorAll('div');
	for(var p_i=0; p_i<all_p.length; p_i++){all_p[p_i].outerHTML = "<div class='fx-element'>"+all_p[p_i].innerHTML+"</div>";} */
}

function preload_or_click(){
	/**Размер текста*************************************/
	var ts_marker_pt  =  iWin.document.queryCommandValue("fontSize");
		if(ts_marker_pt==''){ts_marker_pt = 2}
		if(el('#ts_grad').getAttribute('drag')!=1){
			var ts_grad =  parseInt(parseInt(el("#ts_grad").offsetWidth)/7-1);
			var ts_point = ts_grad*ts_marker_pt;
			el("#ts_marker").style.left  = ts_point+"px"
			el('#num_size').innerHTML= ts_marker_pt+"пт";
		}
	/***Шрифт****************************************/
    if(iWin.document.queryCommandValue("fontName") != ""){
        var typeF = iWin.document.queryCommandValue("fontName");
        if(typeF[0]=="'"){typeF =typeF.substr(1, (typeF.length-2));}
    	el('#font_type').value= typeF
    	el('#font_type').style.fontFamily = el('#font_type').value;
    }else{el('#font_type').value = "Tahoma"; el('#font_type').style.fontFamily ="Tahoma"}
	/***цвет****************************************/
	el("#for_bgcolor").style.backgroundColor = iWin.document.queryCommandValue("BackColor");
	el("#for_color").style.backgroundColor = iWin.document.queryCommandValue("ForeColor");

}


function scanText(){
	iWin.document.onkeydown = iWin.document.onclick = function(){
		if(iWin.document.queryCommandValue("bold")=="true"){el('#bold').className = 'e_e_pushed'}else{el('#bold').className = 'e_b'}
		if(iWin.document.queryCommandValue("underline")=="true"){el('#underline').className = 'e_e_pushed'}else{el('#underline').className = 'e_b'}
		if(iWin.document.queryCommandValue("italic")=="true"){el('#italic').className = 'e_e_pushed'}else{el('#italic').className = 'e_b'}
		if(iWin.document.queryCommandValue("justifyright")=="true"){el('#jRight').className = 'e_e_pushed'}else{el('#jRight').className = 'e_b'}
		if(iWin.document.queryCommandValue("justifyleft")=="true"){el('#jLeft').className = 'e_e_pushed'}else{el('#jLeft').className = 'e_b'}
		if(iWin.document.queryCommandValue("justifycenter")=="true"){el('#jCenter').className = 'e_e_pushed'}else{el('#jCenter').className = 'e_b'}
		if(iWin.document.queryCommandValue("superscript")=="true"){alert("asd");el('#indexn').className = 'e_e_pushed'}else{el('#indexn').className = 'e_b'}
		if(iWin.document.queryCommandValue("subscript")=="true"){alert("asd");el('#stepen').className = 'e_e_pushed'}else{el('#stepen').className = 'e_b'}
		if(iWin.document.queryCommandValue("InsertUnorderedList")=="true"){el('#lists').className = 'e_e_pushed'}else{el('#lists').className = 'e_b'}
		if(iWin.document.queryCommandValue("InsertOrderedList")=="true"){el('#lists_num').className = 'e_e_pushed'}else{el('#lists_num').className = 'e_b'}
	}
}

/******************************************************/
var _$ = el("[editor='true']");
var _$text = _$.innerHTML;
_$.innerHTML = "<div id='toolbar'></div><iframe id='frameId'  name='frameId' style=''></iframe>";
var isGecko = navigator.userAgent.toLowerCase().indexOf("gecko") != -1;
var iframe = (isGecko) ? el("#frameId") : frames["frameId"];
var iWin = (isGecko) ? iframe.contentWindow : iframe.window, iDoc = (isGecko) ? iframe.contentDocument : iframe.document;
// Формируем HTML-код и  добавляем его с помощью методов объекта document
var _$iHTML =  "<html><head> <link rel='stylesheet' href='style/style_iframe.css' type='text/css' />\n";
	_$iHTML += "<style>\n body{background:#fff; width:960px;display:block; min-height:1140px;word-wrap: break-word; color:maroon; font-family:tahoma; font-size:12px; } p{margin:0px; word-wrap: break-word; } div{word-wrap: break-word; } a{cursor:pointer}</style>\n";
	_$iHTML += "</head>\n<body contenteditable='true'><div></div></body>\n</html>";
iDoc.open(); iDoc.write(_$iHTML); iDoc.close();
// *** Инициализация designMode
/*формеруем тулбар*/
var block_textsize = "<div id='text-size_wrap'><div id='num_size'></div><div id='ts_grad'> <div  id='ts_marker'></div> </div></div> ";
var toolbarHTML  = "<input type='button' value='' class='e_b' id='bold' > <input type='button' value='' class='e_b' id='underline'><input type='button' value=''     class='e_b' id='italic'>";
	toolbarHTML += "<input type='button' value='' class='e_b' id='jLeft'> <input type='button' value='' class='e_b' id='jCenter'> <input type='button' value=''    class='e_b' id='jRight'>";
	toolbarHTML += "<input type='button' value=''   class='e_b' id='indexn'><input type='button' value=''  class='e_b' id='stepen'>";
	toolbarHTML += "<input type='button' value=''   class='e_b' id='isrt_table'>";
	toolbarHTML += "<input type='button' value=''   class='e_b' id='lists'><input type='button' value=''  class='e_b' id='lists_num'>";
		toolbarHTML += "<input type='button' value=''   class='e_b' id='indent'><input type='button' value=''  class='e_b' id='outdent'>";
	toolbarHTML += "<input type='button' value=''   class='e_b' id='textcolor'><input type='button' value=''  class='e_b' id='bgcolor'>";
	toolbarHTML += "<div class='e_color' id='for_color' style='left:596px;'></div>";
	toolbarHTML += "<div class='e_color' id='for_bgcolor' style='left:630px;'></div>";
	toolbarHTML += "<input type='button' value=''   class='e_b' id='link'><input type='button' value=''   class='e_b' id='image'>";
	toolbarHTML += block_textsize +"<input type='button'  id='font_type'>"
el("#toolbar").appendChild(cr_el("<div class='tb_toogle' id='wrap_toolbar_first'>"+toolbarHTML+"</div>"));;

var toolbarHTML = '<input type="button" value="" title="Insert Table"     	 class="e_b"  id="addTable">' ;
	toolbarHTML +='<input type="button" value="" title="Add Row Bottom"  	  class="e_b"  id="addRowBottom">';
	toolbarHTML +='<input type="button" value="" title="Add Row Top"     	  class="e_b"  id="addRowTop">' ;
	toolbarHTML +='<input type="button" value="" title="Add Col Left"  		 class="e_b"  id="addColLeft">';
	toolbarHTML +='<input type="button" value="" title="Add Col Right"   	 class="e_b"  id="addColRight">';
	toolbarHTML +='<input type="button" value="" title="Del Row"   			 class="e_b"  id="DelRow">';
	toolbarHTML +='<input type="button" value="" title="Del Col" 			 class="e_b"  id="DelCol">';
	toolbarHTML +='<input type="button" value="x"  title="Close"  			 class="e_b"  id="CloseTableEdit">';
el('#toolbar').appendChild(cr_el("<div class='tb_toogle' id='wrap_toolbar_table'>"+toolbarHTML+"</div>"));

var toolbarHTML = '<input type="text" value="" title="Add Link"      class="e_i"  id="addLink">';
	toolbarHTML +='<input type="button" value="Apply"  title="Apply"  	 class="e_b"  id="ApplyLink">';
	toolbarHTML +='<input type="button" value="Unlink"  title="Unlink"  	 class="e_b"  id="UnLink">';
	toolbarHTML +='<input type="button" value="x"  title="Close"  	 class="e_b"  id="linkClose">';

el('#toolbar').appendChild(cr_el("<div class='tb_toogle' id='wrap_toolbar_link'>"+toolbarHTML+"</div>"));

var toolbarHTML = '<input type="text" value="" title="Add Image"      class="e_i"  id="addImage">';
	toolbarHTML +='<input type="button" value="Apply"  title="Apply"  	 class="e_b"  id="ApplyImage">';
	toolbarHTML +='<input type="button" value="x"  title="Close"  	 class="e_b"  id="imageClose">';
el('#toolbar').appendChild(cr_el("<div class='tb_toogle' id='wrap_toolbar_image'>"+toolbarHTML+"</div>"));

toggleToolbar("first")
var active_TD;
if(browser() == "FF"){	iWin.document.execCommand("enableObjectResizing",     false, "false");	iWin.document.execCommand("enableInlineTableEditing", false, "false");}
preload_or_click();
table_fix();
scanText();

/*Clear Event*/
function clearEvent(event){
	event=event||window.event;
	if(event.stopPropagation) event.stopPropagation();
	else event.cancelBubble = true;
	if(event.preventDefault) event.preventDefault();
	else event.returnValue = false;
}

setInterval(function(){
	image_fix();
	fix_text();
	link_fix();
	page_fix();
    table_fix();
    preload_or_click();
}, 50)

/*----------------------------------------------------------------------------------------------------------------------------------------------*/
/*Обработка событий нажатия кнопок тулбара*/
iWin.document.body.focus();
/*оформление*/
el("#bold").onmousedown 	 = function(){iWin.document.body.focus(); iWin.document.execCommand("bold", false, null);}
el("#underline").onmousedown = function(){iWin.document.body.focus(); iWin.document.execCommand("underline", false, null);}
el("#italic").onmousedown 	 = function(){iWin.document.body.focus(); iWin.document.execCommand ('italic', false, null);}
/*Выравнивание*/
el('#jCenter').onmousedown	 = function(){iWin.document.body.focus(); iWin.document.execCommand("justifycenter", false, null);}
el('#jRight').onmousedown 	 = function(){iWin.document.body.focus(); iWin.document.execCommand("justifyright", false, null);}
el('#jLeft').onmousedown 	 = function(){iWin.document.body.focus(); iWin.document.execCommand("justifyleft", false, null);}
/*Стапень и индексы*/
el('#indexn').onmousedown	 = function(){iWin.document.body.focus(); iWin.document.execCommand("superscript", false, null);}
el('#stepen').onmousedown 	 = function(){iWin.document.body.focus(); iWin.document.execCommand("subscript", false, null);}
/*Колорпикеры*/
el("#textcolor").onmousedown = function(e){setColorPiker(e,'textcolor'); }
el("#bgcolor").onmousedown = function(e){setColorPiker(e,'bgcolor');  }
/*размер текста*/
el("#ts_grad").onmouseover = el("#ts_marker").onmouseover = function(e){drag_and_drop(e,"#ts_marker",{f:"line", d:"#ts_grad"}); }
/*шрифт текста*/
el("#font_type").onclick = function(){clearOtherBlock();setFontFamily(); }
/*таблица и работа с ней*/
el("#isrt_table").onclick = function(){clearOtherBlock();setTable(); }
/*Линк*/
el("#link").onclick = function(){clearOtherBlock();setLink();}
/*Имга*/
el("#image").onclick = function(){clearOtherBlock();setImage(); }
/*списки*/
el("#lists").onclick = function(){iWin.document.body.focus(); iWin.document.execCommand("InsertUnorderedList", false, null);}
el("#lists_num").onclick = function(){iWin.document.body.focus(); iWin.document.execCommand("InsertOrderedList", false, null);}
iWin.document.onkeydown=function(e){
	if(e.keyCode==9 && e.shiftKey){
		clearEvent(e);iWin.document.body.focus(); iWin.document.execCommand("Outdent", false, null);
	}else{
		if(e.keyCode==9){
			clearEvent(e);iWin.document.body.focus(); iWin.document.execCommand("Indent", false, null);
		}
	}
}
/* Отступ*/
el("#indent").onclick = function(){iWin.document.body.focus(); iWin.document.execCommand("Indent", false, null);}
el("#outdent").onclick = function(){iWin.document.body.focus(); iWin.document.execCommand("Outdent", false, null);}

}

