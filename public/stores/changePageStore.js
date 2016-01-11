var Actions = require('../actions/actions');
var Reflux = require('reflux');

module.exports = Reflux.createStore({
	init:function(){
		this.listenTo(Actions.changePage,this.onChangePage);
	},
	onChangePage:function(index,type){
		this.trigger(index,type);
	}
});