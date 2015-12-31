var React = require('react');
// using props
module.exports= React.createClass({

	
	render:function(){
		var containerStyle = {
			border:'1px solid black',
			width:this.props.w, 
			height:this.props.h,
			position:this.props.position||'absolute',
			left:this.props.x,
			top:this.props.y,
			backgroundColor:this.props.bgColor,
			backgroundImage:this.props.bgImg?'url('+this.props.bgImg+')':'',
			backgroundRepeat:'no-repeat',
			overflow:this.props.overflow||'hidden'
		};
		//console.log(this.props.className+' '+this.props.bgColor+' hehe');
		return (
			<div className={this.props.className||'container'} title={this.props.title} tabIndex={-1} style={containerStyle} data-id={this.props.id} data-type={this.props.type} >
			{this.props.children}
			</div>
		);
	}
});