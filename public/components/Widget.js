var React = require('react');
var Container = require('./Container');
var Container2 = require('./Container2');
var Tex = require('./Tex');
module.exports= React.createClass({
	
	render:function(){
		var content = this.props.content;
		var texList = (content.texList||[]).map(function(tex,i){
			return (
				<Tex key={i} content={tex} w={content.w} h={content.h} x={content.x} y={content.y}  />
			);
		});
		return (
			<Container2 className='widget' title={content.name||'widget'} name={content.name} id={content.id} type='widget' w={content.w||400} h={content.h||200} x={content.x} y={content.y} bgColor={content.bgColor} bgImg={content.bgImg}  >
			</Container2>
		);
	}
});