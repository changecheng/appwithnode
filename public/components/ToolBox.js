var React = require('react');
var AddWidgetButton = require('./button/AddWidgetButton');
module.exports= React.createClass({
	render:function(){
		var defaultCanvas = {
			name:'new Canvas',
			id:0,
			z:0,
			w:400,
			h:300,
			x:100,
			y:50,
			background:'rgba(255,255,255,1)',
			widgetList:[]
		};
		var defaultWidget = {
			name:'new Widget',
			id:0,
			type:'button',
			w:100,
			h:100,
			x:100,
			y:100,
			background:'gray'
		};
		return (
			<div className='toolbox-wrapper'>
				Tool Box
				<AddWidgetButton name='Canvas' element={{type:'canvas',content:defaultCanvas}} />
				<AddWidgetButton name='Widget' element={{type:'widget',content:defaultWidget}} />
			</div>
		);
	}
});