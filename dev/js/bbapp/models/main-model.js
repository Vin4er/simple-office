"use strict";
(function() {
	app.Model.Main = Backbone.Model.extend({
		defaults: {
			"default": {},
			"colorpicker": {},
			"font-type": {},
			"table": {}
		},
		initialize: function() {
			return this;
		},
	});
})();