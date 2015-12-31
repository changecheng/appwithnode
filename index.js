require('./public/css/style.css');
var React = require('react');
var ReactDOM = require('react-dom')
var Editor = require('./public/components/Editor');
var AHMIDesigner = require('./public/components/AHMIDesigner');
ReactDOM.render(<AHMIDesigner />,document.getElementById('editor'));