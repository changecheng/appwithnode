var Actions = require('../actions/actions');
var Reflux = require('reflux');
module.exports = Reflux.createStore({
	init:function(){
		this.listenTo(Actions.updateProject,this.onUpdateProject);
	},
	onUpdateProject:function(projectElem){
		//projectElem: {elem:'page/tagList',value:''}
		this.trigger(projectElem);
	}
});