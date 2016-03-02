var app = {};

//
var TXTEDTBLR = {
    init: function(id, settings){
        app.mainModel = new app.Model.Main( settings )

        app.mainView = new app.View.Main({ el: id, model: app.mainModel });
        return app.mainView;
    },
    destroy: function(){
       app.mainView.remove()
    },
};





(function(){
	app = {
		View: {},
		Model: {},
		Collection: {},
		Router: {},
        templates:  {
            initContentEditable: function(data){
                return window.template("contentEditableTemplate")(data);
            },

            initToolbarTemplate: function(data){
                return window.template("toolbarTemplate")(data);
            },

            initEditableTemplate: function(data){
                return window.template("editableTemplate")(data);
            }
        }
	};


})();
