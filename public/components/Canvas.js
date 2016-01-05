var React = require('react');
var Container = require('./Container');
var Container2 = require('./Container2');
var SubCanvas = require('./SubCanvas');
module.exports= React.createClass({
	
	render:function(){
		var content = this.props.content;
		// var subCanvasList = (content.subCanvasList||[]).map(function(sc,i){
		// 	return (
		// 		<SubCanvas key={i} content={sc} w={content.w} h={content.h} x={content.x} y={content.y}  />
		// 	);
		// });
		var curSubCanvas = content.subCanvasList[content.curSubCanvasIdx];
		var subCanvasList = [curSubCanvas].map(function(sc,i){
			return (
				<SubCanvas key={i} content={sc} w={content.w} h={content.h} x={content.x} y={content.y}  />
			);
		});
		return (
			<Container2 className='canvas' title={content.name||'canvas'} name={content.name} id={content.id} type='canvas' w={content.w||400} h={content.h||200} x={content.x||0} y={content.y||0}  >
				{subCanvasList}
			</Container2>
		);
	}
});