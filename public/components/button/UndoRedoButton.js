var React = require('react');
var Actions = require('../../actions/actions');

module.exports= React.createClass({
	handleClick:function(e){
		e.preventDefault();
		if (this.props.type=='undo') {
			Actions.undo();
		}else if (this.props.type =='redo'){
			Actions.redo();
		}
		
	},
	render:function(){
		return (
			<button className='toolbox-button' onClick={this.handleClick}>{this.props.name||'undo'}</button>
		);
	}
});