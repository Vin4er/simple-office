(function( $ ){
  $.fn.se = function(options) {

  	var settings = {
		edit: [],
  		browser: ($.browser.webkit?"webkit":"" ||  $.browser.safari?"safari":"" ||  $.browser.opera?"opera":"" ||  $.browser.msie?"msie":"" ||  $.browser.mozilla?"mozilla":""),
  		cssOuter: "style/se-iframe-style.css",
		cssInner: "body {background:#fff; width:960px; display:block; min-height:1140px;word-wrap: break-word; color: black; font-family: Arial; font-size:  medium} p{margin:0px; word-wrap: break-word; } div{word-wrap: break-word; } a{cursor:pointer}",
    	buttons: {
			'default': ['bold','italic', 'underline','justifyleft', 'justifycenter', 'justifyright','superscript', 'subscript','InsertUnorderedList','InsertOrderedList'],
			'colorpicker': ['ForeColor', 'BackColor'],
			'font-type': ["FontName", "FontSize"],
			'table': ['insert-table'],// таблица удаляется и редактируется только визуально со всплывашками
		},
		cssButton: {/*style for toolbar pushed and unpushed button*/
			css: {
				"outline" : "1px solid rgba(0, 0, 0, .5)",
			},
			def: {
				"outline" : "none"
			}
		},
		fontsName: ['Arial', 'Tahoma', 'Impact', 'Georgia', 'Courier', 'Verdana', 'Courier New', 'Times New Roman', 'Arial Black'],
		patterns: function(opt){
			var set  = this;
			switch(opt.name){
				case "CREATE-IFRAME-BODY":
					return "<html><head><link rel='stylesheet' href='" + set.cssOuter + "' /><style>" + set.cssInner + "</style></head><body  id-unique='"+set.id+"' contenteditable='true'><div></div></body></html>";
					break;
				case "BACKDROP":
					return "<div class='backdrop simple-editor'></div>"
					break;
				case "TOOLBAR":
					return "<div class='toolbar' id-unique='"+set.id+"'></div><iframe class='iframe4e'  id-unique='"+set.id+"'></iframe>";
					break;
				case "CREATE-PANEL-TOOLBAR":
					return "<div class='tb_toogle' id='wrap_toolbar_first'>"+set.createToolbar()+"</div>";
					break;
				case "DEFAULT-BUTTON-ON-TOOLBAR":
					return "<input data-toolbar='btn-toolbar' type='button' value='' class='e_b' data-type = '" + opt.t + "' id='"+opt.b+"'>";
					break;
				case "FONTSIZE-BUTTON-ON-TOOLBAR":
					var html = "<span data-toolbar='btn-toolbar' data-type = '" + opt.t + "'   id='"+opt.b+"'  class='fontsize-body e_b'><a class='fontsize-marker'><div class='value'>1</div><div class='pt'>пт</div></a></span>"
					return "<span class='fontsize'>" + html + "</span>";
					break;
				case "COLORPICKER-BUTTON-ON-TOOLBAR":
					return "<span data-toolbar='btn-toolbar' data-type = '" + opt.t + "' id='"+opt.b+"'  class='colorpicker-open-btn e_b'><div></div></span>";
					break;			
				case "FONTNAME-BUTTON-ON-TOOLBAR":
					var html = "<ul >"  + set.createListsMenu(set.fontsName) + "</ul>";
					return "<span class='fontname'><a  data-toolbar='btn-toolbar' class='e_b' data-type = '" + opt.t + "' id='"+opt.b+"' href='javascript:void(0);' tabindex='1'>dsd</a>" + html + "</span>";
					break;			
				case "TABLE-ADD-BUTTON-ON-TOOLBAR":
					var html = "<input data-toolbar='btn-toolbar'  type='button' value='' class='e_b' data-type = '" + opt.t + "' id='"+opt.b+"'/>"  + set.createTable({n: 8, m: 8}, "class='toggle add-table-se'", "", "");
					return "<span class='insert-table'>" + html + "</span>";
					break;
			}
		},
		createListsMenu: function(_array){
			var list = "",
			array_len = _array.length;
			for(var i = 0; i<array_len; i++){
				list += "<li style='font-family: " + _array[i] + "'>"+ _array[i] +"</li>";
			}
			return  list 
		},
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
			var tHTML = ""
			for(var i = 0; i < size.n; i++){
				tHTML +="<tr>";
				for(var j = 0; j < size.m; j++){
					tHTML +="<td style='" + ((style) ? style : "") + "'  tr='" + i + "' td='" + j + "'>" + (val ? val : "") + "</td>";
				}
				tHTML +="</tr>";
			}
			return "<table " + attrib + " ><tbody>"+tHTML+"</tbody></table>";
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
					html += set.patterns({
									name: patternName, 
									t: type,  
									b: ID
							});
				}
			}
	   		return html;
	  	},
	  	// Создание бэкдропа
	  	_backdropCreate: function(){
	  		var set = this;
	  		$(".backdrop.simple-editor").remove();
	  		$("body").append(set.patterns({name: "BACKDROP"}));
	  	},
	  	// скрыть/показать бэкдроп
	  	backdrop: function(hide){
	  		var bd = $(".backdrop.simple-editor");
	  		return (hide) ? bd.hide(0) : bd.show(0);
	  	},
	  	// execCommand
	  	exec: function(command, bool, val, Times){
	  		var set =  this;
	  		// console.log(this.iWin)
	  		// console.log(this.iWin.document )
	  	 	return set.getAboutFrame(set.edit[Times].editor.find('iframe')).iDoc.execCommand(command, bool, val);
		},
		getExec: function(command, Times){
			var set = this;
			return  set.getAboutFrame(set.edit[Times].editor.find('iframe')).iDoc.queryCommandValue(command);
		},
		// Получение редактора, получиышег фокус(произошло событие на тулбаре)
		getAboutFrame: function(rrz){
			var set = this;
			return {
				iWin: rrz.get(0).contentWindow,
				iDoc: rrz.get(0).contentDocument
			}
		},
	    // Установка обработчиков событий для тулбара
		handlerToolbar: function(Times){
			var set = this;

			$(".toolbar [data-toolbar]").on('mousedown.'+Times , function(){
				var clicked = $(this),
				clickedID = clicked.attr('id');
				// set.id = $(this).parents('.toolbar').attr('id-unique');

				switch(clicked.attr('data-type')){
					case  "default":
						set.exec(clickedID, false, null, Times)
					break;
					case "font-type":
						switch(clicked.attr('id')){
							case "FontName":
								clicked.next().on('mousedown', 'li', function(){
									var fontName = $(this).text().replace(/['"]*/g, '')
									clicked.html(fontName).css('font-family', fontName)
									set.exec(clickedID, false, fontName, Times)
								})
							break;
							case "FontSize":
								/*   */
								var doc = $(document),
								_setMarker = function(){
									var marker = clicked.find(".fontsize-marker"),
									click_left = event.pageX - marker.width()/2,
									shift = clicked.width() - marker.width(),
									min_left = clicked.offset().left;
									if(click_left > min_left  && click_left <= (min_left + shift)){					
										marker.offset({
											left: click_left
										});
										/* /9??? */
										var val = Math.round(marker.position().left/9)+1;
										marker.find(".value").text(val);
										set.exec(clickedID, false, val, Times)
									}
								}
								set.backdrop();
								_setMarker();
								doc.mousemove(function(){
									_setMarker();
								});
								doc.mouseup(function(){
									doc.unbind();
									_setMarker();
									set.backdrop('hide');
									return false
								})
							break;
						}
					break;
					case "colorpicker":
						clicked.seColorpicker({
							selector: clicked.find('div'),
							change: function(){
								set.exec(clickedID, false, this.color, Times)
							}
						})		
					break;
				}
				set.checkAndSet(Times)
			})
		},
		/*set and unset buttons;
			attache event
			@param: {
				opt: object - {doc: iDoc[item], win: iWin[item] }
			}
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
							btn.css( (getEX == "true" ) ? set.cssButton.css : set.cssButton.def) 
						break;
						/*@font type buttons*/
						// case 'font-type':
						// 	if(getEX != false && getEX != true){
						// 		if(btn_types[type][btn_name] == "FontSize"){
						// 			var point = btn.firstChild;
						// 			point.style.left =  getEX*8 +"px";
						// 			point.firstChild.innerHTML = getEX;
						// 		}
						// 		if(btn_types[type][btn_name] == "FontName"){
						// 			var fname = getEX.replace(/['"]*/g, '');
						// 			btn.value = fname;
						// 			btn.style.fontFamily = fname;
						// 		}
						// 	}
						// break; 
						// /*@colorpicker buttons*/
						// case 'colorpicker': 
						// 		btn.firstChild.style.backgroundColor = getEX;
						// break;
					}
				}	
			}
			
		},
		checkValue: function(Times){
			var set = this
			//checked button and styles text;
			// focusFrame = set.getAboutFrame();
			$(set.getAboutFrame(set.edit[Times].editor.find('iframe')).iDoc).on('mouseup.check mousedown.check keydown.check keypress.chec focus.check'  ,function(){
				 set.checkAndSet(Times);
			})
		},


	  	init: function(Times){
	  		var set = this,
	  		ed = set.edit;
	  		mass = ed[Times];
			var edit = mass.editor,
			txtt = mass.text
	  		edit.html(set.patterns({name: "TOOLBAR"}))
	  					.attr({
				  			'data-id' : set.id,
				  			'is-editor': 'true'
				  		});

			iDoc  = set.getAboutFrame(edit.find('iframe')).iDoc;

			iDoc.open();  
			iDoc.write(set.patterns({name: "CREATE-IFRAME-BODY"}) );
			iDoc.close();

			$(iDoc.body).html("<div>" + txtt + "    "  + Times+ "</div>");

			edit.find('.toolbar').append(set.patterns({name: "CREATE-PANEL-TOOLBAR" }) )
			mass.toolbar = edit.find('.toolbar');

			iframe = set.getAboutFrame(edit.find('iframe'))

			// set.editor = editor;
			// set.toolbar = toolbar;

			mass.iDoc = iframe.iDoc;
			mass.iWin = iframe.iWin;

			set.handlerToolbar(Times);
			set.checkValue(Times);
			set._backdropCreate();
	   	}
	};

	if (options){ 
        $.extend(settings, options); // при этом важен порядок совмещения
    }


 	return this.each(function() {
 		var _timestamp = new Date().getTime();
 		var th = this
 		settings.edit[_timestamp] = {
						 			text: $(th).html(),
						 			editor: $(th).addClass('is-editor-'+_timestamp),
								}
						
 		settings.init(_timestamp);
  	});

  };
})(jQuery);