var Actions = require('../actions/actions');
var Reflux = require('reflux');
module.exports = Reflux.createStore({
	init:function(){
		this.listenTo(Actions.saveData,this.onSaveData);
	},
	onSaveData:function(){
		this.trigger();
	}
});