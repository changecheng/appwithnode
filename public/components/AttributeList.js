var React = require('react');
var Actions = require('../actions/actions');
var setTargetStore = require('../stores/setTargetStore');


module.exports = React.createClass({
	getInitialState:function(){
		return {
			obj:{
				name:'default',
				x:0,
				y:0
			},
			dirty:false,
			oldValue:''
		};
	},
	convertValue:function(value,type){
		console.log(type);
		//string to valuetype
		if (type=='number') {
			if (value!='') {
				return parseInt(value);
			}else{
				return 0;
			}
			
		};
		return value;
		
	},
	handleChange:function(name,value,valueType){
		
		var obj = this.state.obj;
		var dirty = this.state.dirty;
		
		if (!dirty) {
			dirty = true;
			var oldValue = this.state.oldValue;
			oldValue = this.convertValue(obj[name]);
			this.setState({oldValue:oldValue,dirty:dirty});
		};
		

		obj[name] = this.convertValue(value,valueType);

		this.setState({obj:obj});
		//this.props.handleChange(name,value);
		
	},
	handleFocusOut:function(name){
		var dirty = this.state.dirty;
		var oldValue =this.state.oldValue;
		var obj = this.state.obj;
		if (dirty) {
			obj[name] = oldValue;
			dirty = false;
			this.setState({dirty:dirty,obj:obj});
		};
		console.log('focus out');
	},
	handleKeyPress:function(name,value,valueType){
		var dirty = this.state.dirty;
		dirty = false;
		this.setState({dirty:dirty});
		value = this.convertValue(value,valueType);
		Actions.changeAttr(name,value);
	},
	handleSetTarget:function(obj){
		this.setState({obj:obj});
		//console.log(this.state.obj);
	},
	componentDidMount:function(){
		this.us_setTarget = setTargetStore.listen(this.handleSetTarget);
	},
	componentWillUnmount:function(){
		this.us_setTarget();
	},
	render:function(){
		var obj = this.state.obj;
		var attrlineList = [];
		for (keyl in obj){
			attrlineList.push(<AttrLine key={keyl} name={keyl} value={obj[keyl]} valueType={typeof obj[keyl]} handleChange={this.handleChange} handleFocusOut={this.handleFocusOut} handleKeyPress={this.handleKeyPress} />);
		}
		return (
			<div className="attr-list" >
				<span className='attr-title'>Attributes</span>
				{attrlineList}
			</div>
		);
	}
});

var AttrLine = React.createClass({
	handleChange:function(e){
		// console.log(e);
		// console.log(typeof e.target.value);
		// console.log(this.props.valueType);
		e.preventDefault();
		this.props.handleChange(this.props.name,e.target.value,this.props.valueType);
	},
	handleFocusOut:function(){
		this.props.handleFocusOut(this.props.name);
	},
	handleKeyPress:function(e){
		// console.log('key press');
		// console.log(e);
		if (e.keyCode==13) {
			this.props.handleKeyPress(this.props.name,e.target.value,this.props.valueType);
		};	
	},
	render:function(){
		return (
			<div className="attr-line"  >
				<span className='attr-name'>{this.props.name}</span><input value={this.props.value} onChange={this.handleChange} onBlur={this.handleFocusOut} onKeyDown={this.handleKeyPress} />
			</div>
		);
	}
});
 