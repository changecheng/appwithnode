var Actions = require('../actions/actions');
var Reflux = require('reflux');
module.exports = Reflux.createStore({
	init:function(){
		this.listenTo(Actions.updatePageViewer,this.onUpdatePageViewer);
	},
	onUpdatePageViewer:function(pageList){
		this.trigger(pageList);
	}
});