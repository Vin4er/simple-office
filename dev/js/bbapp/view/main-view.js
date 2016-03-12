"use strict";
(function() {
	/**
	 * main field
	 */
	app.View.Main = Backbone.View.extend({

		settings: {},

		Views: {
			Toolbar: {},
			Editable: {}
		},

		Models: {},

		iwindow: {},
		idoc: {},


		events: {
			// клик по ссылке, действие которой надо отменить
			// "click .texteditabler-bar-button": "preventDefault"
		},


		/*
		 * инит приложэухи
		 *
		 **/
		initialize: function() {
			var self = this;

			self.initializeStructure();
			self.initializeEventes();

			return this;
		},



		// инт эвентов
		initializeEventes:function(){

			vent.on('textaction', this.EventesTextactionExecCommand, this);

			return this;
		},


		/*
		 * Обработка события
		 * редактирования текста
		 *
		 **/
		EventesTextactionExecCommand: function(data){	

			// применяем компанду для текста
			this.idoc.execCommand(data.action, true, true);	

			// фокус на поле, после выполненеия комманды над текстом
			this.iwindow.focus();

		},

		/*
		 * получаем значение 
		 * выделенного месста текста
		 *
		 **/
		getExecCommand: function(data){	
			return this.idoc.queryCommandValue(data.command);

		},




		/*
		 * инит всех методов для отрисовки
		 *
		 **/
		initializeStructure: function(){
			this
				// вставляем щаблонедитабла
				.initContentEditable()
				// инитим тулбар
				.initToolbar()
				// инитим едитабле на шаблоне
				.initEditable();

			return this;
		},



		/**
		 * init contentEdiatable 
		 */
		initContentEditable: function(){
			this.$el.html( app.templates.initContentEditable() );
			return this;
		},

		/**
		 * init Toolbar field
		 */
		initToolbar: function(){
			var self = this;
			self.Views.Toolbar = new app.View.Toolbar({
				el:  self.$el.find('.texteditabler-bar'),
				model : self.model
			});

			return this;
		},


		/**
		 * init Editable field
		 */
		initEditable: function(){
			var self = this;

			// инитим вьюху едитабла
			self.Views.Editable = new app.View.Editable({
				el:  self.$el.find('.texteditabler-editable')
			});

			// запоминаем обзекты window и window.document
			// для текущего фрейма
			self.iwindow = self.Views.Editable.el.contentWindow;
			self.idoc = self.Views.Editable.el.contentWindow.document;


			// открываем записть
			self.idoc.open();  
			// овставляем туда шаблон "html>(head+body)"
			self.idoc.write(self.Views.Editable.$el.html());
			// закрываем запись
			self.idoc.close();
			// вкслючем редактирование
			self.idoc.designMode = 'on';

			// ставим фокус в окно при ините
			self.iwindow.focus();
			
			// определяем что активно из кнопок и  свойств
			// на данной выделленной области текста
			// и выделяем active
			self.focusDetected();

			// так де вешаем и на собтия ввода и маусапа
			// определение текущего свойства текста
			$(self.iwindow).on('mouseup input', function(){
				self.focusDetected();
			});

			return this;
		},


		// опредеяляем фокус)
		focusDetected: function(){
			var self = this;
			
			// начало фокуса
			// стираем активность с кнопок тулбара
			vent.trigger("focusStart", {
				tollbar: self.Views.Toolbar, 
			});

			/*
			* методои перебора идем по всем кнопкам  
			* смотрим какая из них возврящает занаение курсора
			* 
			*/
			_.each(this.model.attributes, function(itemValue, itemName){

				// если параметры переданные строкой - то все норм
				if(typeof itemValue == "string"){

					var nameArray = itemValue.split('|');
					// если есть кнопки вообще о0
					_.each( nameArray, function(_itemValue, _itemName){

						// и получаем значения execComand по названию команды
						var exec =  self.getExecCommand({command: _itemValue}) ;

						// если возвращает - {"true" string}
						if( exec === "true" ){

							// для текущего тулбара - тригеррем событие
							// обозначения активности кнопки
							vent.trigger("focusDetected", {
								tollbar: self.Views.Toolbar, 
								command: _itemValue, 
								type: itemName
							});
						}
					});
				}
			})
		},
	});







	/**
	 * Toolbar field
	 */
	app.View.Toolbar = Backbone.View.extend({

		events: {
			// нажатие на кнопки
			"click .texteditabler-bar-button": "textaction",
		},

		initialize: function() {
			this.$el.html( app.templates.initToolbarTemplate( this.model.attributes ) );

			vent.on("focusDetected", this.setState, this);
			vent.on("focusStart", this.focusStart, this);

			return this;
		},

		// начинаем фокус
		focusStart: function(data){
			data.tollbar.$('[data-action]').removeClass('active');
		},

		// ставим жкстив
		setState: function(data){

			switch (data.type){

				case "defaults":
					data.tollbar.$('button[data-action=' + data.command + ']').addClass('active');
				break;

			}
		},

		// Действие кнопки
		textaction: function(event){
			var self = this;

			event.preventDefault();

			var actionTarget = $(event.currentTarget),
				action = actionTarget.data('action');	

			vent.trigger('textaction', { action : action } );
		
		}


	});




	/**
	 * Editable field
	 */
	app.View.Editable = Backbone.View.extend({


		initialize: function() {



			this.render();

			return this;
		},
		render: function(){
			return  app.templates.initEditableTemplate()
		}


	});




})();