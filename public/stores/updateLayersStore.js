var Actions = require('../actions/actions');
var Reflux = require('reflux');
module.exports = Reflux.createStore({
	init:function(){
		this.listenTo(Actions.updateLayers,this.onUpdateLayers);
	},
	onUpdateLayers:function(page){
		this.trigger(page);
	}
});