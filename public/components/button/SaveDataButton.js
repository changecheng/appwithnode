var React = require('react');
var Actions = require('../../actions/actions');

module.exports= React.createClass({
	handleClick:function(e){
		e.preventDefault();
		Actions.saveData();
	},
	render:function(){
		return (
			<button className='toolbox-button' onClick={this.handleClick}>Save Data</button>
		);
	}
});