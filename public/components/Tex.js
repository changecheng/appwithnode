var React = require('react');
var Container = require('./Container');
var Container2 = require('./Container2');
module.exports= React.createClass({
	
	render:function(){
		var content = this.props.content;
		return (
			<Container2 className='tex' title={content.name||'tex'} name={content.name} id={content.id} type='tex' w={content.w||200} h={content.h||200} x={content.x} y={content.y} bgColor={content.bgColor} bgImg={content.bgImg}  >
			</Container2>
		);
	}
});