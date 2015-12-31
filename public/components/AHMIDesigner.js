var React = require('react');
var Actions = require('../actions/actions');
var setTargetStore = require('../stores/setTargetStore');
var addElementStore = require('../stores/addElementStore');
var ToolBox = require('./ToolBox');
var Editor = require('./Editor');
var AttributeList = require('./AttributeList');
module.exports= React.createClass({
	render:function(){
		return (
			<div className='designer-main-body'>
				<ToolBox />
				<Editor />
				<AttributeList />
			</div>
		);
	}
});