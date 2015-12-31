var Actions = require('../actions/actions');
var Reflux = require('reflux');
module.exports = Reflux.createStore({
	init:function(){
		this.listenTo(Actions.addElement,this.onAddElement);
	},
	onAddElement:function(element){
		this.trigger(element);
	}
});