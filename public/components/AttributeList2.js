var React = require('react');
var Container = require('./Container');
var Container2 = require('./Container2');
var Actions = require('../actions/actions');
var setTargetStore = require('../stores/setTargetStore');
var RB = require('react-bootstrap');
module.exports= React.createClass({
	getInitialState:function(){
		return {target:{},elemData:{},oldValue:'',curSubCanvasIdx:0};	
	},
	handleChange:function(e){
		//console.log(e);
		var elemData = this.state.elemData;
		var name = e.target.name;
		var value = e.target.value;
		
		// console.log(subCanvas);
		// console.log(this.state.curSubCanvasIdx);
		switch (name){
			case 'name':
			case 'bgColor':
			case 'bgImg':
			case 'tag':
				elemData[name] = value;
				break;
			case 'w':
			case 'h':
			case 'x':
			case 'y':
				elemData[name] = parseInt(value);	
				break;
			case 'scName':
				var subCanvas = elemData.subCanvasList[this.state.curSubCanvasIdx];
				subCanvas.name = value;
				break;
			case 'scBgImg':
				var subCanvas = elemData.subCanvasList[this.state.curSubCanvasIdx];
				subCanvas.bgImg = value;
				break;
			case 'scBgColor':
				var subCanvas = elemData.subCanvasList[this.state.curSubCanvasIdx];
				subCanvas.bgColor = value;
				break;

			
		}
		this.setState({elemData:elemData});
		
	},
	handleFocus:function(e){
		var value = e.target.value;
		switch (e.target.name){
			case 'w':
			case 'h':
			case 'x':
			case 'y':
			value = parseInt(value);
			break;
		}
		this.setState({oldValue:value});
	},
	handleKeyPress:function(e){
		if (e.keyCode == 13) {
			//enter
			//trigger update on editor
			console.log('trigger');
			Actions.changeAttr(this.state.target,this.state.elemData);
			this.setState({oldValue:''});
		};
	},
	handleBlur:function(e){
		var oldValue = this.state.oldValue;
		if (oldValue!='') {
			var name = e.target.name;
			if (name=='scName'||name=='scBgImg'||name=='scBgColor') {
				var subCanvas = this.state.elemData.subCanvasList[this.state.curSubCanvasIdx];
				switch (name){
					case 'scName':
						subCanvas.name = oldValue;
						break;
					case 'scBgImg':
						subCanvas.bgImg = oldValue;
						break;
					case 'scBgColor':
						subCanvas.bgColor = oldValue;
						break;
				}
				this.setState({subCanvas:subCanvas});
			}else{
				var elemData = this.state.elemData;
				elemData[e.target.name] = oldValue;
				this.setState({elemData:elemData});
			}
			
		};
	},
	handleSetTarget:function(data){
		console.log(data);
		this.setState({target:data.target, elemData:data.data});	
	},
	componentDidMount:function(){
		this.us_setTarget = setTargetStore.listen(this.handleSetTarget);
	},
	componentWillUnmount:function(){
		this.us_setTarget();
	},
	render:function(){
		var subCanvasGroup;
		var subCanvasList =[];
		var curSubCanvas ={};
		if (this.state.target.type=='canvas') {
			subCanvasList = this.state.elemData.subCanvasList; 
			if (this.state.curSubCanvasIdx < subCanvasList.length) {
				curSubCanvas = subCanvasList[this.state.curSubCanvasIdx];
			}; 
		};
		
		
		if (curSubCanvas.id) {
			subCanvasGroup = (
				<AttributeGroup groupTitle='SubCanvas'>
					<AttributeLine>
						<AttributeLabel name='Name' /><AttributeInput name='scName' ref='scName' value ={curSubCanvas.name||''} />
					</AttributeLine>
					<AttributeLine>
					<AttributeLabel name='Background Image' /><AttributeInput name='scBgImg' ref='scBgImg' value={curSubCanvas.bgImg||''} /> 
					</AttributeLine>
					<AttributeLine>
					<AttributeLabel name='Background Color' /><AttributeInput name='scBgColor' ref='scBgColor' value={curSubCanvas.bgColor||''} /> 
					</AttributeLine>
				</AttributeGroup>
			);
		}else{
			subCanvasGroup = '';
		}
		return (
			<div className='attributelist' onChange={this.handleChange} onFocus={this.handleFocus} onKeyDown={this.handleKeyPress} onBlur={this.handleBlur}  >
				<AttributeGroup groupTitle='Basic Info'>
					<AttributeLine>
					<AttributeLabel name='Name' /><AttributeInput name='name' ref='name' value={this.state.elemData.name||''} /> 
					</AttributeLine>
				</AttributeGroup>
				<AttributeGroup groupTitle='Position & Size'>
					<AttributeLine>
					<AttributeLabel name='Width' /><AttributeInput type='number' name='w' ref='w' value={this.state.elemData.w||''} /> 
					</AttributeLine>
					<AttributeLine>
					<AttributeLabel name='Height' /><AttributeInput type='number' name='h' ref='h' value={this.state.elemData.h||''} /> 
					</AttributeLine>
					<AttributeLine>
					<AttributeLabel name='X' /><AttributeInput type='number' name='x' ref='x' value={this.state.elemData.x||''} /> 
					</AttributeLine>
					<AttributeLine>
					<AttributeLabel name='Y' /><AttributeInput type='number' name='y' ref='y' value={this.state.elemData.y||''} /> 
					</AttributeLine>
				</AttributeGroup>
				<AttributeGroup groupTitle='Background'>
					<AttributeLine>
					<AttributeLabel name='Background Image' /><AttributeInput name='bgImg' ref='bgImg' value={this.state.elemData.bgImg||''} /> 
					</AttributeLine>
					<AttributeLine>
					<AttributeLabel name='Background Color' /><AttributeInput name='bgColor' ref='bgColor' value={this.state.elemData.bgColor||''} /> 
					</AttributeLine>
				</AttributeGroup>
				<AttributeGroup groupTitle='Tag'>
					<AttributeLine>
					<AttributeLabel name='Tags' /><AttributeDropDown name='tag' ref='tag' value={this.state.elemData.tagList||''} items={['tag1','tag2']} />
					</AttributeLine>
				</AttributeGroup>
				{subCanvasGroup}
			</div>
		);
	}
});

var AttributeGroup = React.createClass({
	render:function(){
		return (
			<ul className='attribute-group' >
				<div className='attribute-group-title'>
					{this.props.groupTitle||''}
				</div>
				{this.props.children}
			</ul>
		);
	}
});

var AttributeLine = React.createClass({
	render:function(){
		return (
			<li className='attribute-line'>
				{this.props.children}
			</li>
		);
	}
});

var AttributeLabel = React.createClass({
	render:function(){
		return (
			<span className='attribute-label'>
			{this.props.name}
			</span>
		);
	}
});

var AttributeInput = React.createClass({
	render:function(){
		return (
			<input className='attribute-input' name={this.props.name} ref={this.props.ref} type={this.props.type||'text'} value={this.props.value} />
		);
	}
});

var AttributeDropDown = React.createClass({
	getInitialState:function(){
		return {hidden:false};	
	},
	handleClick:function(e){
		console.log(this.refs.list);
		this.setState({hidden:!this.state.hidden});
	},
	render:function(){
		var listitems = this.props.items;

		return (
			<div className='attribute-dropdown'>
			<input className='attribute-dropdown-input' name={this.props.name} ref={this.props.ref} type={this.props.type||'text'} value={this.props.value} />
			<button className='attribute-dropdown-botton' onClick={this.handleClick} >List</button>
			<ul ref='list'  className='attribute-dropdown-list' hidden={this.state.hidden} >
				{listitems.map(function(item,i){
					return <li key={i} className='attribute-dropdown-listline'>
							{item}
						</li>;
				})}
			</ul>
			</div>
		);
	}
});