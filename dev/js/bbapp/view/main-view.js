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
			vent.on('textaction', this.EventesTextaction, this);

			return this;
		},


		// Обработка события редактирования текста
		EventesTextaction: function(data){
			this.idoc.execCommand(data.action, true, true);
		},


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

			return this;
		},



		


	});

	/**
	 * Toolbar field
	 */
	app.View.Toolbar = Backbone.View.extend({

		events: {
			// нажатие на кнопки
			"click .texteditabler-bar-button": "textaction"
		},

		initialize: function() {
			this.$el.html( app.templates.initToolbarTemplate( this.model.attributes ) );
			return this;
		},

		textaction: function(event){
			event.preventDefault();
			if ($(event.currentTarget).data('action')){
				vent.trigger('textaction', { action : $(event.currentTarget).data('action') } );
			}
		},
			



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