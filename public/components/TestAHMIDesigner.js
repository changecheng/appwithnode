var React = require('react');
var ReactDOM = require('react-dom');

var EditorD = require('./EditorD');
var AttributeList2 = require('./AttributeList2');
var Tools = require('./Tools');
var Layers = require('./Layers');
var PageViewer = require('./PageViewer');
var $ = require('jquery');
var Actions = require('../actions/actions');
var changePageStore = require('../stores/changePageStore');
var addNewPageStore = require('../stores/addNewPageStore');
var updateProjectStore = require('../stores/updateProjectStore');
var saveDataStore = require('../stores/saveDataStore');
var undoRedoStore = require('../stores/undoRedoStore');
module.exports= React.createClass({
	getInitialState:function(){
		return {
			projectQueue:{curIdx:0,queue:[]},
			undoRedoQueue:{curIdx:0,queue:[]},
			project:{
				name:"defaultProject",
				author:"xx",
				w:800,
				h:600,
				pageList:[],
				tagList:[],
				images:[]
			},
			curPageIdx:0
		};	
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
	parseProject:function(){
		var project = this.state.project;
		//console.log(this.state.page);
		// this.setState({w:project.w,h:project.h});
		// Actions.updatePageViewer(this.state.project.pageList||[]);
	},
	loadProject:function(){
		//var url = 'file:///Volumes/Macintosh%20HD/Work/html/appwithnode/public/data/pageData.json';
		var url = '/api/project';
		$.ajax({
	      url: url,
	      dataType: 'json',
	      cache: false,
	      success: function(data) {
	      	console.log(data);
	        this.setState({project: data,projectQueue:{curIdx:0,queue:[this.deepCopy(data)]}});
	        // this.parseProject();
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(url, status, err.toString());
	      }.bind(this)
	    });	
	},
	handleSaveData:function(){
		//var url = 'file:///Volumes/Macintosh%20HD/Work/html/appwithnode/public/data/pageData_save.json';
		var url = '/api/project';
		//console.log(JSON.stringify(this.state.page,null,4));
		$.ajax({
	      url: url,
	      dataType: 'text',
	      type: 'POST',
	      data: {data:JSON.stringify(this.state.project)},
	      success: function(data) {
	        console.log('ok');
	        console.log(data);
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(url, status, err.toString());
	      }.bind(this)
	    });
	},
	handleChangePage:function(pageIdx){
		this.setState({curPageIdx:pageIdx});
	},
	handleAddNewPage:function(){
		console.log('add new page');
		var pageList = this.state.project.pageList;
		var newPage = {
			name:"defaultPage",
			type:"page",
			id:"0",
			w:this.state.project.w,
			h:this.state.project.h,
			bgImg:"",
			bgColor:"white",
			canvasList:[],
			pageActionList:[],
			tagList:[]
		};
		if (pageList.length) {
			var pageMaxId =pageList[this.findMax(pageList,'id')].id;
			newPage.id = ""+(parseInt(pageMaxId)+1);
		}else{
			newPage.id = "0";
		}
		pageList.push(newPage);
		//console.log(pageList);
		this.setState({pageList:pageList});
		//console.log(this.state.project.pageList);
		//Actions.updatePageViewer(pageList);
	},
	handleUpdateProject:function(projectElem){
		// console.log(this.state.project.pageList);
		var undo={type:'',oldValue:''};
		switch (projectElem.elem){
			case 'page':
			// console.log(this.state.project.pageList);
			var pageList = this.state.project.pageList;
			// console.log(pageList[0]);
			// console.log(projectElem);
			// undo.type = 'page';
			// undo.oldValue = {pageIdx:this.state.curPageIdx,page:pageList.slice(0)[this.state.curPageIdx]};
			pageList[this.state.curPageIdx] = projectElem.value;

			this.setState({pageList:pageList});	

			break;
			case 'tagList':
			var project = this.state.project;
			// undo.type = 'tagList';
			// undo.oldValue = project.tagList.slice(0);
			project.tagList = projectElem.value;
			this.setState({project:project});
			break;
			case 'imageList':
			var images = this.state.project.images;
			// undo.type = 'imageList';
			// undo.oldValue = images.slice(0);
			this.setState({images:projectElem.value});
			break;
		}
		// var undoRedoQueue = this.state.undoRedoQueue;
		// undoRedoQueue.queue[undoRedoQueue.curIdx] = undo;
		// undoRedoQueue.curIdx = (undoRedoQueue.curIdx+1)%5;
		// this.setState({undoRedoQueue:undoRedoQueue});

		var projectQueue = this.state.projectQueue;
		projectQueue.queue = projectQueue.queue.slice(0,projectQueue.curIdx+1);
		//projectQueue.queue.push([this.state.project].slice(0)[0]);
		projectQueue.queue.push(this.deepCopy(this.state.project));
		if (projectQueue.curIdx + 1 >5){
			projectQueue.queue.shift();
		}else{
			projectQueue.curIdx = projectQueue.curIdx + 1;
		}
		this.setState({projectQueue:projectQueue});
		
	},
	deepCopy:function(obj){
		var newObj = new Object();
		if (typeof obj !='object') {
			return obj;
		};
		for (var key in obj){
			if (typeof(obj[key])=='object') {
				if (obj[key] instanceof Array) {
					//newObj[key] = obj[key].slice(0);
					newObj[key] = [];
					for (var i=0;i<obj[key].length;i++){
						newObj[key].push(this.deepCopy(obj[key][i]));
					}
				}else{
					newObj[key] = this.deepCopy(obj[key]);
				}
				
			}else{
				newObj[key] = obj[key];
			}
		}
		return newObj;
	},
	handleSaveData:function(){
		//var url = 'file:///Volumes/Macintosh%20HD/Work/html/appwithnode/public/data/pageData_save.json';
		var url = '/api/project';
		//console.log(JSON.stringify(this.state.page,null,4));
		$.ajax({
	      url: url,
	      dataType: 'text',
	      type: 'POST',
	      data: {data:JSON.stringify(this.state.project)},
	      success: function(data) {
	        console.log('ok');
	        console.log(data);
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(url, status, err.toString());
	      }.bind(this)
	    });
	},
	handleUndoRedo:function(type){
		switch (type){
			case 'undo':
			var projectQueue = this.state.projectQueue;
			if (projectQueue.curIdx>0) {
				console.log(projectQueue.queue[projectQueue.curIdx-1]);
				this.setState({project:projectQueue.queue[projectQueue.curIdx-1]});

				projectQueue.curIdx=projectQueue.curIdx-1;
				this.setState({projectQueue:projectQueue});

			};
			break;
			case 'redo':
			var projectQueue = this.state.projectQueue;
			if (projectQueue.curIdx<projectQueue.queue.length-1) {
				this.setState({project:projectQueue.queue[projectQueue.curIdx+1]});
				projectQueue.curIdx = projectQueue.curIdx+1;
				this.setState({projectQueue:projectQueue});
			};
			break;
		}
	},
	componentDidMount:function(){
		this.loadProject();
		this.us_changePage = changePageStore.listen(this.handleChangePage);
		this.us_addNewPage = addNewPageStore.listen(this.handleAddNewPage);
		this.us_updateProject = updateProjectStore.listen(this.handleUpdateProject);
		this.us_saveData = saveDataStore.listen(this.handleSaveData);
		this.us_undoRedo = undoRedoStore.listen(this.handleUndoRedo);
	},
	componentWillUnmount:function(){
		this.us_changePage();
		this.us_addNewPage();
		this.us_updateProject();
		this.us_saveData();
		this.us_undoRedo();
	},
	render:function(){
		var project = this.state.project;
		return (
			<div>
				<Tools />
				<PageViewer pageList={project.pageList} />
				<EditorD w={project.w} h={project.h} page={project.pageList[this.state.curPageIdx]||{}} />
				<div className='rightcolumn'>
					<AttributeList2 tagList={project.tagList} imageList={project.images} />
					<Layers page={project.pageList[this.state.curPageIdx]||{}} />
				</div>
			</div>
		);
	}
});
