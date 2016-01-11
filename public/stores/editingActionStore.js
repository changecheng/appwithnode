var Actions = require('../actions/actions');
var Reflux = require('reflux');
module.exports = Reflux.createStore({
	init:function(){
		this.listenTo(Actions.editingAction,this.onEditingAction);
	},
	onEditingAction:function(action,triggerList){
		this.trigger(action,triggerList);
	}
});