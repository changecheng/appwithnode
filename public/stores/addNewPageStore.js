var Actions = require('../actions/actions');
var Reflux = require('reflux');
module.exports = Reflux.createStore({
	init:function(){
		this.listenTo(Actions.addNewPage,this.onAddNewPage);
	},
	onAddNewPage:function(){
		this.trigger();
	}
});