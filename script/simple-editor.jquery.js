(function( $ ){
  $.fn.se = function(options) {

  	var settings = {
		//будущий Массив редакторов
		edit: [],
		//общий класс для редакторов
		seClassName: 'has-simple-editor',
		// id на родительсвом элементе
		attr_id: "data-editor-id", 
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
						'Courier', 'Verdana', 'Courier New', 
								'Times New Roman', 'Arial Black'],

/*-------------- MENU, TOOLBAR, EDIT AREA-----------------------*/
		patterns: function(opt){
			var set  = this;
			switch(opt.name){
				// iframe из нутри
				case "CREATE-IFRAME-BODY": 
					return "<html><head><link rel='stylesheet' href='" + set.cssOuter + "' /></head><body><div>" + opt.TEXT + "</div></body></html>";
					break;
				// Бэкдроп
				case "BACKDROP":
					return "<div class='backdrop simple-editor'></div>"
					break;
				// тулбар + iframe
				case "TOOLBAR": 
					return "<div class='toolbar'></div><iframe class='iframe4e'></iframe>";
					break;
				// панель тулбара
				case "CREATE-PANEL-TOOLBAR": 
					return "<div class='tb_toogle' id='wrap_toolbar_first'>"+set.createToolbar()+"</div>";
					break;
				// дефолтные кнопки
				case "DEFAULT-BUTTON-ON-TOOLBAR":
					return "<input data-toolbar='btn-toolbar' type='button' value='' class='e_b' data-type = '" + opt.t + "' id='"+opt.b+"'>";
					break;
				// font-size ползунок
				case "FONTSIZE-BUTTON-ON-TOOLBAR": 
					var html = "<span data-toolbar='btn-toolbar' data-type='" + opt.t + "'   id='"+opt.b+"'  class='fontsize-body e_b'><a class='fontsize-marker'><div class='value'>1</div><div class='pt'>пт</div></a></span>"
					return "<span class='fontsize'>" + html + "</span>";
					break;
				// Кнопка для колорпикера
				case "COLORPICKER-BUTTON-ON-TOOLBAR": 
					return "<span data-toolbar='btn-toolbar' data-type = '" + opt.t + "' id='"+opt.b+"'  class='colorpicker-open-btn e_b'><div></div></span>";
					break;	
 				// список шрифтов
				case "FONTNAME-BUTTON-ON-TOOLBAR":
					var html = "<ul >"  + set.createListsMenu(set.fontsName) + "</ul>";
					return "<span class='fontname'><a  data-toolbar='btn-toolbar' class='e_b' data-type = '" + opt.t + "' id='"+opt.b+"' href='javascript:void(0);' tabindex='1'></a>" + html + "</span>";
					break;	
				// таблицы
				case "TABLE-ADD-BUTTON-ON-TOOLBAR": 
					return "<span class='insert-table'><a href='javascript:void(0);'  data-toolbar='btn-toolbar'  type='button'  tabindex='2' class='e_b' data-type = '" + opt.t + "' id='"+opt.b+"' ></a>" + set.createTable({n: 8, m: 8}, "class='toggle add-table-se'", "", "") + "</span>";
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
					clickedID = clicked.attr('id'),
					_Times = clicked.parents("["+set.attr_id+"]").attr(set.attr_id);
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
								var list = clicked.next().show()
								list.off('click.detectframe mousedown.fontset').on('mousedown.fontset', 'li', function(){ 
									var fontName = $(this).text().replace(/['"]*/g, '');//оставляем только текст 
									clicked.html(fontName).css('font-family', fontName);
									set.exec(clickedID, false, fontName, _Times);
								}).on('click.detectframe', 'li', function(){
									set.contentWin(_Times).focus();	//Возвращаем фокус в нужное место по onmouseup
									list.hide()
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
										marker.offset({	left: parseInt(click_left)});
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
					case "table":
						var table = clicked.next().show();
						table.off('mouseenter.toolbar mousedown.toolbar').on('mouseenter.toolbar', 'td', function(){
							$(".hover-line").removeClass('hover-line')
							$(".hovered").removeClass('hovered')
							var over = $(this),
								tSize = {
									m: (over.index() + 1), //horizont,
									n: (over.parent().addClass('hovered').index() + 1)//vertical
								}
								$(".toolbar tr:lt(" + tSize.n + ") td:nth-child(" + tSize.m +  "), .toolbar tr.hovered td:lt(" + tSize.m + ")").addClass("hover-line");
						}).on('mousedown.toolbar', 'td', function(){
							var	mdown = $(this),
								tSize = {
									m: (mdown.index() + 1), //horizont,
									n: (mdown.parent().index() + 1)//vertical
								},
								ins_table = "<div>"+set.createTable(tSize, "class='iframe-table'", "", "<div class='wrap_text'></div>")+"</div><div>&nbsp;</div>"
								table.hide()
							
								set.exec('InsertHtml', false, ins_table, _Times)
								set.contentWin(_Times).focus();	//Возвращаем фокус в нужное место по onmouseup

						})
					break;
				}

				set.checkAndSet(_Times)
			}).off('mouseup.detectframe').on('mouseup.detectframe', function(){
				var clicked = $(this),
					_Times = clicked.parents("["+set.attr_id+"]").attr(set.attr_id);
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
				_events = 'mouseup.check mousedown.check keyup.check'; // События бля проверки тулбара
			$(set.contentWin(Times)).off(_events).on(_events, function(){
				 set.checkAndSet(Times)
			})

			$(set.contentWin(Times).focus())//.triggerHandler("mousedown.check"); //set default state btn
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
 			
 			iDoc.designMode = 'on'
			set.handlerToolbar(); // Установка тулбара
			set.checkValue(Times); // и значений кнопок

 			$(set.contentWin(Times)).mousedown(); //set default state btn
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
 			editor: $(th).addClass(settings.seClassName), // элемент   редактором
		}	
 		settings.init(_timestamp);// инициализирую редактор
  	});

  };
})(jQuery);