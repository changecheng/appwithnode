var React = require('react');
var Container = require('./Container');
var Container2 = require('./Container2');
var Canvas = require('./Canvas');

module.exports= React.createClass({
	
	render:function(){
		var canvasList = this.props.canvasList;
		var canvases = canvasList.map(function(canvas,i){
			return (<Canvas content={canvas} key={i} />);
		}.bind(this)
		);
		return (
			<Container2 className='page' title='page' type='page' id={this.props.id} w={this.props.w||800} h={this.props.h||800} x={0} y={0} bgColor={this.props.bgColor} bgImg={this.props.bgImg} >
			{canvases}
			</Container2>
		);
	}
});