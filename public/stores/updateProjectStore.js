var Actions = require('../actions/actions');
var Reflux = require('reflux');
module.exports = Reflux.createStore({
	init:function(){
		this.listenTo(Actions.updateProject,this.onUpdateProject);
	},
	onUpdateProject:function(page){
		this.trigger(page);
	}
});