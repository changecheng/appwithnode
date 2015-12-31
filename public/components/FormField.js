var React = require('react');
module.exports= React.createClass({
	handleChange:function(e){
		
	},
	render:function(){
		return (
			<div className='field'>
			<input name={this.props.name} type={this.props.type} placeholder={this.props.placeholder} value={this.props.value} onChange={this.handleChange} />
			</div>
		);
	}
});