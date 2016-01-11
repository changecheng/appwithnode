var React = require('react');
var ReactDOM = require('react-dom');
var Container = require('./Container');
var Frame = require('./Frame');
var Page = require('./Page');
var Widget = require('./Widget');
var Layers = require('./Layers');

var Actions = require('../actions/actions');
var setTargetStore = require('../stores/setTargetStore');
var addElementStore = require('../stores/addElementStore');
var changeAttrStore = require('../stores/changeAttrStore');
// var saveDataStore = require('../stores/saveDataStore');
var changePageStore = require('../stores/changePageStore');
// var addNewPageStore = require('../stores/addNewPageStore');


module.exports= React.createClass({
	getInitialState:function(){
		return {
			w:this.props.w,
			h:this.props.h,
			page:this.props.page,
			chosen:[],
			draggingElems:[],
			showAttrElem:'',
			lastMousePoint:{x:0,y:0},
			dragging:false
		};
	},
	componentWillReceiveProps:function(newProps){
		//console.log(newProps);
		this.setState({w:newProps.w,h:newProps.h,page:newProps.page});
	},
	handleClick:function(e){
		//console.log(e.target.dataset);
		var clickedDom = {type:'',id:''};
		// var chosen = this.state.chosen;
		switch (e.target.dataset.type){
			case 'subcanvas':
			clickedDom.type = e.target.parentNode.dataset.type;
			clickedDom.id = e.target.parentNode.dataset.id;
			break;
			case 'canvas':
			
			case 'widget':
			clickedDom.type = e.target.dataset.type;
			clickedDom.id = e.target.dataset.id;
			break;
			case 'page':
			this.setState({chosen:[]});
			clickedDom.type = e.target.dataset.type;
			clickedDom.id = e.target.dataset.id;
			break;

		}
		
		// chosen=[];
		// chosen.push(clickedDom);
		// this.setState({chosen:chosen});
		// console.log(this.state.chosen);
		// console.log(chosen);
		//console.log(this.state.project.pageList[0]);
		targetData = this.findTargetData('get',clickedDom,0);
		this.setState({chosen:[clickedDom], showAttrElem:targetData});
		Actions.setTarget({target:clickedDom,data:(targetData||{})}||{});
	},
	// loadPage:function(){
	// 	//var url = 'file:///Volumes/Macintosh%20HD/Work/html/appwithnode/public/data/pageData.json';
	// 	var url = '/api/page';
	// 	$.ajax({
	//       url: url,
	//       dataType: 'json',
	//       cache: false,
	//       success: function(data) {
	//       	console.log(data);
	//         this.setState({page: data});
	//         this.parsePage();
	//       }.bind(this),
	//       error: function(xhr, status, err) {
	//         console.error(url, status, err.toString());
	//       }.bind(this)
	//     });	
	// },
	// loadProject:function(){
	// 	//var url = 'file:///Volumes/Macintosh%20HD/Work/html/appwithnode/public/data/pageData.json';
	// 	var url = '/api/project';
	// 	$.ajax({
	//       url: url,
	//       dataType: 'json',
	//       cache: false,
	//       success: function(data) {
	//       	console.log(data);
	//         this.setState({project: data});
	//         this.parseProject();
	//       }.bind(this),
	//       error: function(xhr, status, err) {
	//         console.error(url, status, err.toString());
	//       }.bind(this)
	//     });	
	// },
	// parseProject:function(){
	// 	var project = this.state.project;
	// 	//console.log(this.state.page);
	// 	this.setState({w:project.w,h:project.h});
	// 	Actions.updatePageViewer(this.state.project.pageList||[]);
	// },
	handleChangeAttr:function(target,data){
		this.findTargetData('set',target,data);
		Actions.updateProject({elem:'page',value:this.state.page});
	},
	// handleSaveData:function(){
	// 	//var url = 'file:///Volumes/Macintosh%20HD/Work/html/appwithnode/public/data/pageData_save.json';
	// 	var url = '/api/project';
	// 	//console.log(JSON.stringify(this.state.page,null,4));
	// 	$.ajax({
	//       url: url,
	//       dataType: 'text',
	//       type: 'POST',
	//       data: {data:JSON.stringify(this.state.project)},
	//       success: function(data) {
	//         console.log('ok');
	//         console.log(data);
	//       }.bind(this),
	//       error: function(xhr, status, err) {
	//         console.error(url, status, err.toString());
	//       }.bind(this)
	//     });
	// },
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
	findIdx:function(list,key,value){
		if (list.length) {
			for (var i = 0; i < list.length; i++) {
				if (list[i][key] == value){
					return i;
				}
			};
		}else{
			return 0;
		}
		return 0;
	},
	findCurActiveSubCanvas:function(){
		var chosen = this.state.chosen;
		var page = this.state.page;
		if (chosen.length==0) {
			var canvasIdx = this.findMax(page.canvasList,'zIndex');
			var subCanvasIdx = this.findMax(page.canvasList[canvasIdx].subCanvasList,'zIndex');
			return {canvas:canvasIdx,subCanvas:subCanvasIdx};
		}else{
			//if canvas activated
			var chosenDom = chosen[0];
			if (chosenDom.type == 'widget') {
				var Ids = chosenDom.id.split('.');
				chosenDom.id = Ids[0]+'.'+Ids[1];
			};
			var canvasIdx = this.findIdx(page.canvasList,'id',chosenDom.id)
			return {canvas:canvasIdx,subCanvas:page.canvasList[canvasIdx].curSubCanvasIdx};
		}
		
		
	},
	handleAddElement:function(widget){
		var page = this.state.page;
		switch (widget){
			case 'button':
			
			var defaultButton = {
				name:"default",
				type:"widget",
				id:"0.0.0.0",
				w:50,
				h:50,
				x:100,
				y:100,
				zIndex:0,
				bgColor:"green",
				currentSlice:0,
				texList:[],
				triggerList:['Click'],
				tag:'',
				action:{
					name:'default',
					content:[]
				}
			}
			var curActiveSubCanvasIdx = this.findCurActiveSubCanvas();

			var curActiveSubCanvas=page.canvasList[curActiveSubCanvasIdx.canvas].subCanvasList[curActiveSubCanvasIdx.subCanvas];
			var scId = curActiveSubCanvas.id;
			if(curActiveSubCanvas.widgetList.length){
				var curMaxId = curActiveSubCanvas.widgetList[this.findMax(curActiveSubCanvas.widgetList,'id')].id;
				// console.log(curMaxId);
				var ids = curMaxId.split('.');
				// console.log(ids);
				// console.log(ids[-1]);
				defaultButton.id = ids.slice(0,-1).join('.')+'.'+(parseInt(ids[ids.length-1])+1);
				// console.log(defaultButton.id);
			}else{
				defaultButton.id = scId+'.0';
			}
			//defaultButton.id = scId+"."+curActiveSubCanvas.widgetList.length;
			curActiveSubCanvas.widgetList.push(defaultButton);
			// console.log(curActiveSubCanvas);
			// this.setState({curActiveSubCanvas:curActiveSubCanvas});
			break;
			case 'canvas':
			var defaultCanvas = {
				name:"canvas1",
				type:"canvas",
				id:"0.0",
				w:400,
				h:400,
				x:50,
				y:50,
				zIndex:0,
				curSubCanvasIdx:0,
				subCanvasList:[
					{
						name:"defaultSC",
						type:"subCanvas",
						id:"0.0.0",
						zIndex:0,
						bgColor:"rgba(255,255,255,0)",
						bgImg:"",
						widgetList:[]
					}
				],
				triggerList:[],
				action:{
					name:'default',
					content:[]
				},
				tag:''
			}
			if (page.canvasList.length) {
				var curMaxIds = page.canvasList[this.findMax(page.canvasList,'id')].id.split('.');
				console.log(curMaxIds);
				defaultCanvas.id = page.id +"."+ (parseInt(curMaxIds[curMaxIds.length-1]) + 1);

			}else{
				defaultCanvas.id = page.id +"."+ "0";
			}
			defaultCanvas.subCanvasList[0].id = defaultCanvas.id+".0";
			page.canvasList.push(defaultCanvas);
			console.log(defaultCanvas);
			console.log(page);
			break;
		}
		this.setState({page:page});
		Actions.updateProject({elem:'page',value:page});
	},
	// handleChangePage:function(index){
	// 	//console.log(index);
	// 	this.setState({page:this.state.project.pageList[index]});
	// 	Actions.updateLayers(this.state.page);
	// },
	// handleAddNewPage:function(){
	// 	var pageList = this.state.project.pageList;
	// 	var newPage = {
	// 		name:"defaultPage",
	// 		type:"page",
	// 		id:"0",
	// 		w:this.state.project.w,
	// 		h:this.state.project.h,
	// 		bgImg:"",
	// 		bgColor:"white",
	// 		canvasList:[],
	// 		pageActionList:[],
	// 		tagList:[]
	// 	};
	// 	if (pageList.length) {
	// 		var pageMaxId =pageList[this.findMax(pageList,'id')].id;
	// 		newPage.id = ""+(parseInt(pageMaxId)+1);
	// 	}else{
	// 		newPage.id = "0";
	// 	}
	// 	pageList.push(newPage);
	// 	this.setState({pageList:pageList});
	// 	Actions.updatePageViewer(pageList);
	// },
	componentDidMount:function(){
		
		this.us_changeAttr = changeAttrStore.listen(this.handleChangeAttr);
		//this.us_saveData = saveDataStore.listen(this.handleSaveData);
		this.us_addElement = addElementStore.listen(this.handleAddElement);
		//this.us_changePage = changePageStore.listen(this.handleChangePage);
		//this.us_addNewPage = addNewPageStore.listen(this.handleAddNewPage);
	},
	componentWillUnmount:function(){
		this.us_changeAttr();
		//this.us_saveData();
		this.us_addElement();
		//this.us_changePage();
		//this.us_addNewPage();
	},
	handleMouseDown:function(e){
		var type = e.target.dataset.type;
		var id = e.target.dataset.id;
		var chosen = this.state.chosen;
		var lastMousePoint = this.state.lastMousePoint;
		var clickedDom={type:'',id:''};
		this.setState({lastMousePoint:{x:e.pageX,y:e.pageY}});
		switch (type){
			case 'page':
			case 'canvas':
			var dataset = e.target.dataset;
			clickedDom = {type:dataset.type,id:dataset.id};
			
			break;
			case 'subcanvas':
			//update canvas
			var dataset = e.target.parentNode.dataset;
			clickedDom = {type:dataset.type,id:dataset.id};
			
			break;
			case 'widget':
			var dataset = e.target.dataset;
			clickedDom = {type:dataset.type,id:dataset.id};
			
			break;
		}
		var hit = false;
		if (chosen.length) {
			for (var i = 0; i < chosen.length; i++) {
				if (chosen[i].type == clickedDom.type && chosen[i].id == clickedDom.id){
					hit = true;
					this.setState({draggingElems:chosen.slice(0)});
				}
				break;
			};
			if (!hit) {
				this.setState({draggingElems:[clickedDom]});
			};
		}else{
			this.setState({draggingElems:[clickedDom]});
		}

	},
	deleteTargetData:function(target){
		var page = this.state.page;
		switch (target.type){
			case 'canvas':
				var ids = target.id.split(".").map(function(id){
					return parseInt(id);
				});
				//console.log(ids);
				for (var i = 0; i < page.canvasList.length; i++) {
					page.canvasList.splice(i,1);
					break;
				};
				
				break;
			case 'widget':
				var ids = target.id.split(".").map(function(id){
					return parseInt(id);
				});
				//console.log(ids);
				for (var i = 0; i < page.canvasList.length; i++) {
					if(page.canvasList[i].id == [ids[0],ids[1]].join('.')){
						var canvas = page.canvasList[i];
						for (var j = 0; j < canvas.subCanvasList.length; j++) {
							if(canvas.subCanvasList[j].id == [ids[0],ids[1],ids[2]].join('.')){
								//find subcanvas
								var sc = canvas.subCanvasList[j];
								for (var k = 0;k<sc.widgetList.length;k++){
									if(sc.widgetList[k].id == target.id){
										
										sc.widgetList.splice(k,1);
									}
								}
								break;
							}
						};
						break;
					}
				};
				
				break;
		}
		this.setState({page:page});
		// Actions.updateProject(page);
	},
	findTargetData:function(operate,target,value){
		var page = this.state.page;
		var set = operate=='set' ? true: false;
		switch (target.type){
			case 'page':
				if (set) {
					page = value;
					this.setState({page:page});
				}else{
					return page;
				}
				break;
			case 'canvas':
				var ids = target.id.split(".").map(function(id){
					return parseInt(id);
				});
				//console.log(ids);
				for (var i = 0; i < page.canvasList.length; i++) {
					//console.log(page.canvasList[i].id);
					if(page.canvasList[i].id == [ids[0],ids[1]].join('.')){
						if (set){
							page.canvasList[i] = value;
							this.setState({page:page});
						}else {
							return page.canvasList[i];
						}
						break;
					}
				};
				
				break;
			case 'widget':
				var ids = target.id.split(".").map(function(id){
					return parseInt(id);
				});
				//console.log(ids);
				for (var i = 0; i < page.canvasList.length; i++) {
					if(page.canvasList[i].id == [ids[0],ids[1]].join('.')){
						var canvas = page.canvasList[i];
						for (var j = 0; j < canvas.subCanvasList.length; j++) {
							if(canvas.subCanvasList[j].id == [ids[0],ids[1],ids[2]].join('.')){
								//find subcanvas
								var sc = canvas.subCanvasList[j];
								for (var k = 0;k<sc.widgetList.length;k++){
									if(sc.widgetList[k].id == target.id){
										var widget = sc.widgetList[k];
										if (set){
											widget = value;
											this.setState({page:page});
										}else {
											return widget;
										}
									}
								}
								break;
							}
						};
						break;
					}
				};
				
				break;
			
		}
		
	},
	handleMouseMove:function(e){
		var draggingElems = this.state.draggingElems;
		var lastMousePoint = this.state.lastMousePoint;
		var offset = {x:e.pageX - lastMousePoint.x,y: e.pageY - lastMousePoint.y};
		this.setState({lastMousePoint:{x:e.pageX,y:e.pageY}});
		var targetData;
		if (draggingElems.length) {
			this.setState({dragging:true});
			//elem chosen
			for (var i = 0; i < draggingElems.length; i++) {
				targetData = this.findTargetData('get',draggingElems[i],0);
				if (targetData.type!="") {
					targetData.x += offset.x;
					targetData.y += offset.y;
					this.setState({targetData:targetData});
				};
				
			};
		};
	},
	handdleMouseUp:function(e){
		//console.log(this.state.draggingElems == this.state.chosen);
		if (this.state.dragging) {
			//trigger update
			Actions.updateProject({elem:'page',value:this.state.page});
		};
		this.setState({dragging:false,draggingElems:[]});
	},
	handleMouseOut:function(e){
		if (this.state.dragging) {
			//trigger update
			Actions.updateProject({elem:'page',value:this.state.page});
		};
		this.setState({dragging:false,draggingElems:[]});
	},
	handleKeyPress:function(e){
		e.preventDefault();
		var chosen = this.state.chosen;
		//console.log(chosen);
		if (chosen.length) {
			switch (e.keyCode){
				case 46:
				case 8:
					console.log('delete');
					for (var i = 0;i< chosen.length;i++){
						this.deleteTargetData(chosen[i]);
					}
					Actions.updateProject({elem:'page',value:this.state.page});
					
				break;
			}
		};
		
	},
	render:function(){
		var page = this.state.page;
		var pageDom="";
		if (page.id) {
			pageDom=<Page key={page.id} w={page.w} h={page.h} x={page.x} y={page.y}  id={page.id} canvasList={page.canvasList||[]} bgColor={page.bgColor} bgImg={page.bgImg}>
			</Page>
		};
		//console.log(page.backgroundColor);
		return (
			<div className='editor' onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseUp={this.handdleMouseUp} onMouseOut={this.handleMouseOut} onClick={this.handleClick} onKeyDown={this.handleKeyPress} >
				<Frame w={this.state.w} h={this.state.h}  >
					{pageDom}
				</Frame>
			</div>
		);
	}
});