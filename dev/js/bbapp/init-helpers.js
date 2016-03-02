(function(){
	window.vent = _.extend({}, Backbone.Events);
	window.template = function(id) {
		var ID = '#'+id;
		return _.template( $(ID).html() );
	};

})();
