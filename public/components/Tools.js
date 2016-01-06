var React = require('react');
var AddWidgetButton = require('./button/AddWidgetButton');
var SaveDataButton = require('./button/SaveDataButton');
var UndoRedoButton = require('./button/UndoRedoButton');
module.exports= React.createClass({
	render:function(){
		return (
			<div className='tools'>
				<AddWidgetButton name='Button' widget='button' />
				<AddWidgetButton name ='Canvas' widget='canvas' />
				<SaveDataButton />
				<UndoRedoButton name='Undo' type='undo' />
				<UndoRedoButton name='Redo' type='redo' />
			</div>
		);
	}
});