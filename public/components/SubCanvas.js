var React = require('react');
var Container = require('./Container');
var Container2 = require('./Container2');
var Widget = require('./Widget');

module.exports= React.createClass({
	
	render:function(){
		var content = this.props.content;
		var widgetList = (content.widgetList||[]).map(function(widget,i){
			return (
				<Widget key={i} content={widget} w={content.w} h={content.h} x={content.x} y={content.y}  />
			);
		});
		return (
			<Container2 className='subcanvas' title={content.name||'subCanvas'} name={content.name} id={content.id} type='subcanvas' w={this.props.w||400} h={this.props.h||200} x={0} y={0} bgColor={content.bgColor} bgImg={content.bgImg}  >
				{widgetList}
			</Container2>
		);
	}
});