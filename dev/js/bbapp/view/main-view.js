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


		// Обработка события редактирования текста
		EventesTextactionExecCommand: function(data){	
			this.idoc.execCommand(data.action, true, true);
		},


		// Обработка события редактирования текста
		getExecCommand: function(data){	
			return this.idoc.queryCommandValue(data.command)
		},

		// return  this.contentDoc(Times).queryCommandValue(command);	



		// инит всех методов для отрисовки
		initializeStructure: function(){
			this
				.initContentEditable()
				.initToolbar()
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

			self.Views.Editable = new app.View.Editable({
				el:  self.$el.find('.texteditabler-editable')
			});

			self.iwindow = self.Views.Editable.el.contentWindow;
			self.idoc = self.Views.Editable.el.contentWindow.document;

			self.idoc.open();  
			self.idoc.write(self.Views.Editable.$el.html());
			self.idoc.close();
			self.idoc.designMode = 'on';


			self.iwindow.focus();
			
			self.focusDetected();

			$(self.iwindow).on('mouseup input ', function(){
				self.focusDetected()
			});

			return this;
		},

		// опредеяляем фокус)
		focusDetected: function(){
			var self = this;
					
			vent.trigger("focusStart", {
				tollbar: self.Views.Toolbar, 
			});

			
			_.each(this.model.attributes, function(itemValue, itemName){
				if(typeof itemValue == "string"){
					
					var nameArray = itemValue.split('|')
					// если есть кнопки вообще о0
					// если есть кнопки вообще о0
					_.each( nameArray, function(_itemValue, _itemName){
						var exec =  self.getExecCommand({command: _itemValue}) ;

						if( exec === "true" ){
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

			data.tollbar.$('[data-action]').removeClass('active')
		},

		// ставим жкстив
		setState: function(data){

			console.log(data)
			switch (data.type){

				case "defaults":
					data.tollbar.$('button[data-action=' + data.command + ']').addClass('active');
				break;

			}
		},

		// Действие кнопки
		textaction: function(event){
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