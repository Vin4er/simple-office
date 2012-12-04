(function( $ ){
  $.fn.se = function(options) {

  	var settings = {
  		id: undefined,
  		editor: undefined,
  		iWin: undefined,
  		iDoc: undefined,
  		browser: ($.browser.webkit?"webkit":"" ||  $.browser.safari?"safari":"" ||  $.browser.opera?"opera":"" ||  $.browser.msie?"msie":"" ||  $.browser.mozilla?"mozilla":""),
  		cssOuter: "style/se-iframe-style.css",
		cssInner: "body {background:#fff; width:960px; display:block; min-height:1140px;word-wrap: break-word; color: black; font-family: Arial; font-size:  medium} p{margin:0px; word-wrap: break-word; } div{word-wrap: break-word; } a{cursor:pointer}",
    	buttons: {
			'default': ['bold','italic', 'underline','justifyleft', 'justifycenter', 'justifyright','superscript', 'subscript','InsertUnorderedList','InsertOrderedList'],
			'colorpicker': ['ForeColor', 'BackColor'],
			'font-type': ["FontName", "FontSize"],
			'table': ['insert-table'],// таблица удаляется и редактируется только визуально со всплывашками
		},
		pushed: {/*style for toolbar pushed and unpushed button*/
			css: "outline",
			val: "1px solid black",
			def: "none"
		},
		fontsName: ['Arial', 'Tahoma', 'Impact', 'Georgia', 'Courier', 'Verdana', 'Courier New', 'Times New Roman', 'Arial Black'],
		patterns: function(opt){
			var set  = this;
			switch(opt.name){
				case "CREATE-IFRAME-BODY":
					return "<html><head><link rel='stylesheet' href='" + opt.s_outer + "' /><style>" + opt.s_inner + "</style></head><body contenteditable='true'><div></div></body></html>";
					break;
				case "BACKDROP":
					return "<div class='backdrop simple-editor'></div>"
					break;
				case "TOOLBAR":
					return "<div class='toolbar' ></div><iframe class='iframe4e'></iframe>";
					break;
				case "CREATE-PANEL-TOOLBAR":
					return "<div class='tb_toogle' id='wrap_toolbar_first'>"+opt.tb+"</div>";
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
				var b_l = set.buttons[type].length;
				for(var i=0; i<b_l; i++){
					var id = set.buttons[type][i];
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
					html += set.patterns({name: patternName, t:type,  b: set.buttons[type][i]});
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
	  		return (hide)?$(".backdrop.simple-editor").hide(0):$(".backdrop.simple-editor").show(0);
	  	},
	  	// execCommand
	  	exec: function(frame, command, bool, val){
	  		frame.iDoc.body.focus();
			return  frame.iWin.document.execCommand(command, bool, val);
		},
		// Получение редактора, получиышег фокус(произошло событие на тулбаре)
		getAboutFrame: function(iframe){
			return {
				iWin: iframe.contentWindow,
				iDoc: iframe.contentDocument
			}
		},
	    // Установка обработчиков событий для тулбара
		handlerToolbar: function(opt){
			var set = this,
			editor = set.editor;
			editor.find('.toolbar').on('mousedown', "[data-toolbar]", function(){
				var clicked = $(this),
				clickedID = clicked.attr('id'),
				focusFrame = set.getAboutFrame(clicked.parents("[is-editor]").find('iframe').get(0));

				switch(clicked.attr('data-type')){
					case  "default":
						set.exec(focusFrame, clickedID, false, null)
					break;
					case "font-type":
						switch(clicked.attr('id')){
							case "FontName":
								clicked.next().on('mousedown', 'li', function(){
									var fontName = $(this).text().replace(/['"]*/g, '')
									clicked.html(fontName).css('font-family', fontName)
									set.exec(focusFrame, clickedID, false, fontName)
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
										marker.offset({left: click_left});
										/* /9??? */
										var val = Math.round(marker.position().left/9)+1;
										marker.find(".value").text(val);
										set.exec(focusFrame, clickedID, false, val)
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
								set.exec(focusFrame, clickedID, false, this.color)
							}
						})		
					break;
				}

			})
		},


	  	init: function(init_obj){
	  		var set = this, 
	  		body = $('body'),
	  		editor, iframe, iDoc, iWin, _iframe;
	  		set.id = new Date().getTime();
	  		editor = set.editor = $(init_obj).attr('data-id', set.id);
	  		editor.attr('is-editor','true').html(set.patterns({name: "TOOLBAR", id_r: set.id}))
			_iframe = set.getAboutFrame(editor.find('iframe').get(0))
			iWin  = _iframe.iWin;
			iDoc  = _iframe.iDoc;

			iDoc.open();  
			iDoc.write(set.patterns({name: "CREATE-IFRAME-BODY", s_outer: set.cssOuter, s_inner: set.cssInner}) );
			iDoc.close();

			editor.find('.toolbar').append(set.patterns({name: "CREATE-PANEL-TOOLBAR", tb: set.createToolbar() }) )
			set._backdropCreate();
			set.iDoc = iDoc;
			set.iWin = iWin
			set.handlerToolbar()
	   	}
	};

	if (options){ 
        $.extend(settings, options); // при этом важен порядок совмещения
    }


 	return this.each(function() {
 		settings.init(this);
  	});

  };
})(jQuery);