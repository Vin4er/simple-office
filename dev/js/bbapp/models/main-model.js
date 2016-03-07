"use strict";
(function() {
	app.Model.Main = Backbone.Model.extend({
		defaults: {
			"default": {},
			"colorpicker": {},
			"fontType": {},
			"table": {}
		},
		initialize: function() {
			return this;
		},
	});
})();