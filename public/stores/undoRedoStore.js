var Actions = require('../actions/actions');
var Reflux = require('reflux');
module.exports = Reflux.createStore({
	init:function(){
		this.listenTo(Actions.undo,this.onUndo);
		this.listenTo(Actions.redo,this.onRedo);
	},
	onUndo:function(){
		this.trigger('undo');
	},
	onRedo:function(){
		this.trigger('redo')
	}
});