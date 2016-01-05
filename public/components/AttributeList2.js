var React = require('react');
var ReactDOM = require('react-dom');
var Container = require('./Container');
var Container2 = require('./Container2');
var Actions = require('../actions/actions');
var setTargetStore = require('../stores/setTargetStore');
var RB = require('react-bootstrap');
var $ = require('jquery');
//RB modules
var SplitButton = RB.SplitButton;

//
module.exports= React.createClass({
	getInitialState:function(){
		return {
			target:{},
			elemData:{},
			oldValue:'',
			curSubCanvasIdx:0,
			tagList:this.props.tagList,
			curSubCanvasName:'',
			imageList:this.props.imageList
		};	
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
			case 'subCanvasList':
				this.setState({curSubCanvasName:value});
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
	handleAddTag:function(tag){
		var tagList = this.state.tagList;
		for (var i = 0; i <  tagList.length; i++) {
			if ( tagList[i] == tag){
				return;
			}
		}
		tagList.push(tag);
		this.setState({tagList:tagList});
		Actions.updateProject({elem:'tagList',value:tagList});
	},
	findMax:function(list,key){
		var i = 0;
		var j ;
		if (list.length>1) {
			for (var k = 0; k < list.length; k++) {
				if (list[k][key]>=list[i][key]) {
					i=k;
				};
			};
		}
		return i;
	},
	handleAddSubCanvas:function(sc){
		var elemData = this.state.elemData;
		for (var i = 0; i < elemData.subCanvasList.length; i++) {
			if(elemData.subCanvasList[i].name == sc){
				return ;
			}
		};
		var newSC = {
            name: sc,
            type: "subCanvas",
            id: "1.0.0",
            zIndex: 0,
            bgColor: "white",
            bgImg: "",
            widgetList: []
        }
        if (elemData.subCanvasList.length) {
        	var maxSCId = elemData.subCanvasList[this.findMax(elemData.subCanvasList,'id')].id;
	        var Ids = maxSCId.split('.');
	        Ids[Ids.length-1] = parseInt(Ids[Ids.length-1]) + 1;
	        newSC.id = Ids.join('.');
        }else{
        	newSC.id = elemData.id + '.0';
        }
        
		elemData.subCanvasList.push(newSC);
		this.setState({elemData:elemData});
	},
	handleKeyPress:function(e){
		if (e.keyCode == 13) {
			//enter
			//trigger update on editor
			if (e.target.name == 'tag') {
				this.handleAddTag(e.target.value);
			}else if (e.target.name == 'subCanvasList'){
				this.handleAddSubCanvas(e.target.value);
			}
			console.log('trigger');
			Actions.changeAttr(this.state.target,this.state.elemData);
			this.setState({oldValue:''});
		};
	},
	handleBlur:function(e){
		var oldValue = this.state.oldValue;
		var name = e.target.name;
		if (oldValue!='') {
			
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
				if (name=='subCanvasList') {
					this.refs['subCanvasList'].value = oldValue;
					return;
				}
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
	handleListLineClick:function(target,i){
		switch (target){
			case 'tag':
			var elemData = this.state.elemData;
			elemData.tag = this.state.tagList[i];
			this.setState({elemData:elemData});
			Actions.changeAttr(this.state.target,this.state.elemData);
			break;
			case 'subCanvasList':
			var elemData = this.state.elemData;
			elemData.curSubCanvasIdx = i;
			this.setState({curSubCanvasIdx:i,elemData:elemData,curSubCanvasName:elemData.subCanvasList[elemData.curSubCanvasIdx].name});
			Actions.changeAttr(this.state.target,this.state.elemData);
			break;
			case 'bgImg':
			var elemData = this.state.elemData;
			elemData.bgImg = this.state.imageList[i];
			this.setState({elemData:elemData});
			Actions.changeAttr(this.state.target,this.state.elemData);
			break;
		}
	},
	handleListButtonClick:function(target,i){
		switch (target){
			case 'tag':
			var tagList = this.state.tagList;
			tagList.splice(i,1);
			this.setState({tagList:tagList});
			Actions.updateProject({elem:'tagList',value:tagList});
			break;
			case 'subCanvasList':
			var subCanvasList = this.state.elemData.subCanvasList;
			subCanvasList.splice(i,1);
			if (subCanvasList.length==0) {
				this.handleAddSubCanvas('defaultsc');
			};
			if (this.state.curSubCanvasIdx > i) {
				this.setState({curSubCanvasIdx:this.state.curSubCanvasIdx-1});
			}else if (this.state.curSubCanvasIdx == i) {
				this.setState({curSubCanvasIdx:0});
			};
			this.setState({subCanvasList:subCanvasList});
			Actions.changeAttr(this.state.target,this.state.elemData);
			break;
			case 'bgImg':
			var imageList = this.state.imageList;
			imageList.splice(i,1);
			this.setState({imageList:imageList});
			Actions.updateProject({elem:'imageList',value:imageList});
			break;
		}
	},
	handleBgImgUpload:function(e){
		console.log(e);
	},
	handleUpdateImageList:function(filename){
		var imageList = this.state.imageList;
		imageList.push(filename);
		this.setState({imageList:imageList});
		Actions.updateProject({elem:'imageList',value:imageList});
		//set img to current file

	},
	handleBgImgUploadComplete:function(e){
		console.log(this.refs.file.files[0]);
		// console.log(this.refs.uploadForm.getDOMNode());
		//console.log(e);
		var fd = new FormData();    
		var file = this.refs.file.files[0]
	    fd.append('file',file);
	    console.log(fd);
	    var self = this;
	    $.ajax({
	        url: '/api/upload',
	        data: fd,
	        processData: false,
	        contentType: false,
	        type: 'POST',
	        success: function(data){
	            console.log(data);
	            console.log('upload ok');
	            self.handleUpdateImageList(file.name);
	        }
	    });
	    e.preventDefault();
	},
	componentDidMount:function(){
		this.us_setTarget = setTargetStore.listen(this.handleSetTarget);
	},
	componentWillReceiveProps:function(newProps){
		this.setState({tagList:newProps.tagList,imageList:newProps.imageList});
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
					<AttributeLabel name='SubCanvasList' /><AttributeDropDown name='subCanvasList' ref='subCanvasList' value={this.state.curSubCanvasName} items={subCanvasList.map(function (sc) {
						return sc.name;
					})||[]} handleListLineClick={this.handleListLineClick.bind(this,'subCanvasList')} handleListButtonClick={this.handleListButtonClick.bind(this,'subCanvasList')} buttonLabel='x' />
					</AttributeLine>
				
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
					<AttributeLabel name='Background Image' />
					<form ref='uploadForm' encType='multipart/form-data'  >
					<input ref='file' type="file" className='bgimg-uploader' onChange={this.handleBgImgUploadComplete} />
				
					</form>
					<AttributeDropDown name='bgImg' ref='bgImg' value={this.state.elemData.bgImg||''} items={this.state.imageList||[]} handleListLineClick={this.handleListLineClick.bind(this,'bgImg')} handleListButtonClick={this.handleListButtonClick.bind(this,'bgImg')} buttonLabel='x' />
					</AttributeLine>
					<AttributeLine>
					<AttributeLabel name='Background Color' /><AttributeInput name='bgColor' ref='bgColor' value={this.state.elemData.bgColor||''} /> 
					</AttributeLine>
				</AttributeGroup>
				<AttributeGroup groupTitle='Tag'>
					<AttributeLine>
					<AttributeLabel name='Tags' /><AttributeDropDown name='tag' ref='tag' value={this.state.elemData.tag||''} items={this.state.tagList||[]} handleListLineClick={this.handleListLineClick.bind(this,'tag')} handleListButtonClick={this.handleListButtonClick.bind(this,'tag')} buttonLabel='x' />
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
		//console.log(this.refs.list);
		this.setState({hidden:!this.state.hidden});
	},
	handleListLineClick:function(i){
		this.props.handleListLineClick(i);
	},
	handleListButtonClick:function(i){
		this.props.handleListButtonClick(i);
	},
	render:function(){
		var listitems = this.props.items;

		return (
			<div className='attribute-dropdown'>
			<input className='attribute-dropdown-input' name={this.props.name} ref={this.props.ref} type={this.props.type||'text'} value={this.props.value||''} />
			<button className='attribute-dropdown-botton' onClick={this.handleClick} >List</button>
			<ul ref='list'  className='attribute-dropdown-list' hidden={this.state.hidden} >
				{listitems.map(function(item,i){
					return <li key={i} className='attribute-dropdown-listline'>
							<div className='attribute-dropdown-listline-item' onClick={this.handleListLineClick.bind(this,i)}>{item}</div><button className='attribute-dropdown-listline-button' onClick={this.handleListButtonClick.bind(this,i)}>{this.props.buttonLabel||''}</button>
						</li>;
				}.bind(this))}
			</ul>
			</div>
		);
	}
});