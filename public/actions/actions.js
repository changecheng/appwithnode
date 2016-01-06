var Reflux = require('reflux');
var Actions = Reflux.createActions([
		"addElement","changeAttr","setTarget","saveData","changePage","updateLayers",
		"updatePageViewer","addNewPage","updateProject","undo","redo"
	]);
module.exports= Actions;