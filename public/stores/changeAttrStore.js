var Actions = require('../actions/actions');
var Reflux = require('reflux');

module.exports = Reflux.createStore({
	init:function(){
		this.listenTo(Actions.changeAttr,this.onChangeAttr);
	},
	onChangeAttr:function(name, value){
		this.trigger(name, value);
	}
});