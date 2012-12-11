(function( $ ){
  $.fn.se = function(options) {

  	var settings = {
		//будущий Массив редакторов
		edit: [],
		// id на родительсвом элементе
		_attr_id: "data-editor-id", 
  		// определение браузера
  		browser: ($.browser.webkit?"webkit":"" ||  $.browser.safari?"safari":"" ||  $.browser.opera?"opera":"" ||  $.browser.msie?"msie":"" ||  $.browser.mozilla?"mozilla":""),
  		// стили для #document во iframe
  		cssOuter: "style/se-iframe-style.css",
  		// кнопки
    	buttons: {
			'default': ['bold','italic', 'underline','justifyleft', 'justifycenter', 'justifyright','superscript', 'subscript','InsertUnorderedList','InsertOrderedList'],
			'colorpicker': ['ForeColor', 'BackColor'],
			'font-type': ["FontName", "FontSize"],
			'table': ['insert-table'],// таблица удаляется и редактируется только визуально со всплывашками
		},
		// нажатые кнопки на тулбаре
		cssButton: {
			css: {	"outline" : "1px solid rgba(0, 0, 0, .5)" , /*-*/}, // нажата
			def: { "outline" : "none", /*-*/ }	 // дефолт
		},
		// Список шрифтов для редактора
		fontsName: ['Arial', 'Tahoma', 'Impact', 'Georgia', 
						'Courier', 'Verdana',  'Courier New', 
								'Times New Roman', 'Arial Black'],

/*-------------- MENU, TOOLBAR, EDIT AREA-----------------------*/
		patterns: function(opt){
			var set  = this;
			switch(opt.name){
				case "CREATE-IFRAME-BODY": // iframe из нутри
					return "<html><head><link rel='stylesheet' href='" + set.cssOuter + "' /></head><body tabindex=2>" + opt.TEXT+ "</body></html>";
					break;
				case "BACKDROP": // Бэкдроп
					return "<div class='backdrop simple-editor'></div>"
					break;
				case "TOOLBAR": // тулбар + iframe
					return "<div class='toolbar'></div><iframe class='iframe4e'></iframe>";
					break;
				case "CREATE-PANEL-TOOLBAR": // панель тулбара
					return "<div class='tb_toogle' id='wrap_toolbar_first'>"+set.createToolbar()+"</div>";
					break;
				case "DEFAULT-BUTTON-ON-TOOLBAR": // дефолтные кнопки
					return "<input data-toolbar='btn-toolbar' type='button' value='' class='e_b' data-type = '" + opt.t + "' id='"+opt.b+"'>";
					break;
				case "FONTSIZE-BUTTON-ON-TOOLBAR": // font-size ползунок
					var html = "<span data-toolbar='btn-toolbar' data-type = '" + opt.t + "'   id='"+opt.b+"'  class='fontsize-body e_b'><a class='fontsize-marker'><div class='value'>1</div><div class='pt'>пт</div></a></span>"
					return "<span class='fontsize'>" + html + "</span>";
					break;
				case "COLORPICKER-BUTTON-ON-TOOLBAR": // Кнопка для колорпикера
					return "<span data-toolbar='btn-toolbar' data-type = '" + opt.t + "' id='"+opt.b+"'  class='colorpicker-open-btn e_b'><div></div></span>";
					break;			
				case "FONTNAME-BUTTON-ON-TOOLBAR": // список шрифтов
					var html = "<ul >"  + set.createListsMenu(set.fontsName) + "</ul>";
					return "<span class='fontname'><a  data-toolbar='btn-toolbar' class='e_b' data-type = '" + opt.t + "' id='"+opt.b+"' href='javascript:void(0);' tabindex='1'>dsd</a>" + html + "</span>";
					break;			
				case "TABLE-ADD-BUTTON-ON-TOOLBAR": // таблицы
					var html = "<input data-toolbar='btn-toolbar'  type='button' value='' class='e_b' data-type = '" + opt.t + "' id='"+opt.b+"'/>"  + set.createTable({n: 8, m: 8}, "class='toggle add-table-se'", "", "");
					return "<span class='insert-table'>" + html + "</span>";
					break;
			}
		},
		/*
			ВЫПАДАЮЩЕЕ МЕНЮ ДЛЯ ВЫБОРА  шрифта
			@param: _array: array of "font-family"
			@return htnl-string
		*/
		createListsMenu: function(_array){
			var list = "",
			array_len = _array.length;
			for(var i = 0; i<array_len; i++){
				list += "<li style='font-family: " + _array[i] + "'>"+ _array[i] +"</li>";
			}
			return  list 
		},
		//Создание тулбара
		createToolbar: function(){
			var set  = this;
			html = '';
			for(var type in set.buttons){
				var BT = set.buttons[type],
				b_l = BT.length				;
				for(var i=0; i<b_l; i++){
					var ID = BT[i];
					switch(type){
						case "font-type":
							switch(ID){
								case "FontSize":
									patternName =  'FONTSIZE-BUTTON-ON-TOOLBAR';
								break;
								case "FontName":
									patternName =  'FONTNAME-BUTTON-ON-TOOLBAR';
								break;
							}
						break;
						case "colorpicker":
							patternName = "COLORPICKER-BUTTON-ON-TOOLBAR";
						break;	
						case "table":
							patternName = "TABLE-ADD-BUTTON-ON-TOOLBAR";
						break;	
						default:
							patternName = 'DEFAULT-BUTTON-ON-TOOLBAR';
						break;
					}
					html += set.patterns({	name: patternName, 	t: type,  b: ID });
				}
			}
	   		return html;
	  	},
/* ---------------------------------------------------------------  */


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
		createTable: function(size, attrib, style, val){
				var tHTML = "",
				ed = this;
				for(var i = 0; i < size.n; i++){
					tHTML +="<tr>";
					for(var j = 0; j < size.m; j++){
						tHTML +="<td style='" + ((style) ? style : "") + "'  tr='" + i + "' td='" + j + "'>" + (val ? val : "") + "</td>";
					}
					tHTML +="</tr>";
				}
				return "<table " + attrib + " ><tbody>"+tHTML+"</tbody></table>";
		},


	  	// Создание бэкдропа
	  	_backdropCreate: function(){
	  		var set = this;
	  		$(".backdrop.simple-editor").remove();
	  		$("body").append(set.patterns({name: "BACKDROP"}));
	  	},
	  	// скрыть/показать бэкдроп
	  	backdrop: function(hide){
	  		return (hide) ? $(".backdrop.simple-editor").hide(0) : $(".backdrop.simple-editor").show(0);
	  	},

	  	// execCommand. Форматируем текст
	  	exec: function(command, bool, val, Times){
	  	 	return this.contentDoc(Times).execCommand(command, bool, val);
		},
		// Получаем значения всех свойств текста нужного фрейма
		getExec: function(command, Times){
			return  this.contentDoc(Times).queryCommandValue(command);
		},
		// iframe -> #document (произошло событие на тулбаре)
		contentDoc: function(Times){
			return this.edit[Times].editor.find('iframe').get(0).contentDocument;
		},
		// iframe -> window (произошло событие на тулбаре)
		contentWin: function(Times){
			return this.edit[Times].editor.find('iframe').get(0).contentWindow;
		},

	    // Установка обработчиков событий для тулбара
		handlerToolbar: function(){
			var set = this;
			$(".toolbar [data-toolbar]").off('mousedown.toolbar').on('mousedown.toolbar', function(){
				var clicked = $(this),
				clickedID = clicked.attr('id');
				_Times = clicked.parents("["+set._attr_id+"]").attr(set._attr_id);
				/*--------------------------------*/
				switch(clicked.attr('data-type')){
					case  "default"://Обычные кнопки
						set.exec(clickedID, false, null, _Times)
					break;
					/*--------------------------------*/
					case "font-type":
						// Формирования стиля текста
						/*--------------------------------*/
						switch(clicked.attr('id')){
							case "FontName":
								/* Установка шрифта*/
								clicked.next().off('mousedown.fontset').on('mousedown.fontset', 'li', function(){ 
									var fontName = $(this).text().replace(/['"]*/g, '');//оставляем только текст 
									clicked.html(fontName).css('font-family', fontName);
									set.exec(clickedID, false, fontName, _Times);
								}).off('mouseup.detectframe').on('mouseup.detectframe', 'li', function(){
									set.contentWin(_Times).focus();	//Возвращаем фокус в нужное место по onmouseup
								})
							break;
							/*--------------------------------*/
							case "FontSize":
								/* Установка размера текста [1-7]пт;  */
								var doc = $(document),
								_setMarker = function(){
									var marker = clicked.find(".fontsize-marker"),
										click_left = event.pageX - marker.width()/2,
										shift = clicked.width() - marker.width(),
										min_left = clicked.offset().left;
									if(click_left > min_left+1  && click_left < (min_left + shift)){
										//промежжуток движения маркера			
										marker.offset({
											left: parseInt(click_left)
										});
										var val = Math.round(marker.position().left/7)+1;
										marker.find(".value").text(val);
										set.exec(clickedID, false, val, _Times)
									}
								}
								set.backdrop();// устанавливаем бэкдроп
								_setMarker(); //устанавливам позицию маркера при mousedown

								doc.mousemove(function(){
									_setMarker();//устанавливам позицию маркера при mousemove
								});
								doc.mouseup(function(){
									doc.unbind(); // удаляем обработчики с document
									_setMarker(); //устанавливам конечную позицию маркера
									set.backdrop('hide');//Убираем бэкдроп
									
									set.contentWin(_Times).focus();//Возвращаем фокус в нужное место по onmouseup
									
									return false
								})
							break;
						}
					break;
					/*--------------------------------*/
					case "colorpicker":
						// цвет фона и текста
						clicked.seColorpicker({
							selector: clicked.find('div'),
							change: function(){  // изменение цвета
								set.exec(clickedID, false, this.color, _Times) // ставим нужный цвет для текста
							},
							close: function(){ // зактрытие колорпикера
								set.contentWin(_Times).focus();//Возвращаем фокус в нужное место
							}
						})	
					break;
				}

				set.checkAndSet(_Times)
			}).off('mouseup.detectframe').on('mouseup.detectframe', function(){
				set.contentWin(_Times).focus();	//Возвращаем фокус в нужное место по onmouseup
				set.checkAndSet(_Times)
			})
		},

		/*set and unset buttons;
			attache event
			@param: {Times}
		*/
		checkAndSet: function(Times){
			var set = this,
				btn_types = set.buttons;
			for(var type in btn_types){
				var btn_types_name = btn_types[type];
				for(var btn_name in btn_types_name){
					var btnName =  btn_types[type][btn_name],//имя кнопки
					getEX = set.getExec( btnName, Times),// значение кнопки
					btn = set.edit[Times].editor.find('#' + btnName + '[data-toolbar="btn-toolbar"]');// кнопка
					switch (type) {
						/*@default buttons*/
						case 'default':
							// Нажата? Да/не
							btn.css( (getEX == "true" ) ? set.cssButton.css : set.cssButton.def) 
						break;
						/*@font type buttons*/
						case 'font-type':
						 	if(typeof getEX  != "boolean"){ //кнопка имеет значение
						 		if(btn_types[type][btn_name] == "FontSize"){
						 			//позиция маркера
						 			btn.find('.value').text(getEX).parent().css('left',  7*getEX-8 +"px");
								}
						 		if(btn_types[type][btn_name] == "FontName"){
						 			var fname = getEX.replace(/['"]*/g, ''); // очистка шрифтов от ковычек
									btn.text(fname).css('font-family', fname); // применяем шрифт к списку ^^
						 		}
							}
						break; 
						 /*@colorpicker buttons*/
						case 'colorpicker': 
							btn.children().css('background-color', getEX);
						break;
					}
				}	
			}
			
		},
		checkValue: function(Times){
			var set = this,// Проверяем все значения тулбара при событиях
				_events = 'mouseup.check mousedown.check keydown.check focus.check'; // События бля проверки тулбара
			$(set.contentWin(Times)).off(_events).on(_events, function(){
				 set.checkAndSet(Times);
				 console.log(this)
			})
			$(set.contentWin(Times).focus()).triggerHandler("mousedown"); //set default state btn
		},


	  	init: function(Times){
	  		var set = this,
	  			ed = set.edit,
		  		edit = ed[Times].editor,
		  		text = ed[Times].text;

	  		edit.attr({ 'data-editor-id' : Times})
	  			.html(set.patterns({name: "TOOLBAR"}))
			 	.find('.toolbar')
			 		.append(set.patterns({name: "CREATE-PANEL-TOOLBAR" }) )

			iDoc = edit.find('iframe').get(0).contentWindow.document
			iDoc.open();  
			iDoc.write(set.patterns({name: "CREATE-IFRAME-BODY", TEXT: text } ));
			iDoc.close();
 			
 			iDoc.designMode = 'on'; // Включаем редактирование

			set.handlerToolbar(); // Установка тулбара
			set.checkValue(Times); // и значений кнопок

			set._backdropCreate();
	   	}
	};

	if (options){ 
        $.extend(settings, options); // при этом важен порядок совмещения
    }


 	return this.each(function() {
 		var _timestamp = new Date().getTime(); // Уникальный id для элемента
 		var th = this; // блок, в котором должен быть редактор
 		settings.edit[_timestamp] = { // массив редакторов
 			text: $(th).html(), //изначальный текст в блоке
 			editor: $(th), // элемент   редактором
		}	
 		settings.init(_timestamp);// инициализирую редактор
  	});

  };
})(jQuery);