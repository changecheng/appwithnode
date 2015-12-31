var React = require('react');
var Container = require('./Container');
var Container2 = require('./Container2');
module.exports= React.createClass({
	handleClick:function(e){
		console.log(e);
	},
	render:function(){
		return (
			<Container2 className='frame' title='frame' onClick={this.handleClick} w={this.props.w||800} h={this.props.h||800} position='relative' x={0} y={0} >
			{this.props.children}
			</Container2>
		);
	}
});