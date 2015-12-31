var React = require('react');
var Actions = require('../../actions/actions');

module.exports= React.createClass({
	handleClick:function(e){
		e.preventDefault();
		Actions.addElement(this.props.widget||'button');
	},
	render:function(){
		return (
			<button className='toolbox-button' onClick={this.handleClick}>{this.props.name||'Add'}</button>
		);
	}
});