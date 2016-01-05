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
module.exports= React.createClass({
	getInitialState:function(){
		return {
			project:{
				name:"defaultProject",
				author:"xx",
				w:800,
				h:600,
				pageList:[],
				tagList:[]
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
	        this.setState({project: data});
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
		console.log(pageList);
		this.setState({pageList:pageList});
		console.log(this.state.project.pageList);
		//Actions.updatePageViewer(pageList);
	},
	handleUpdateProject:function(projectElem){
		switch (projectElem.elem){
			case 'page':
			var pageList = this.state.project.pageList;
			pageList[this.state.curPageIdx] = projectElem.value;
			this.setState({pageList:pageList});	
			break;
			case 'tagList':
			var project = this.state.project;
			project.tagList = projectElem.value;
			this.setState({project:project});
			break;
		}
		
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
	componentDidMount:function(){
		this.loadProject();
		this.us_changePage = changePageStore.listen(this.handleChangePage);
		this.us_addNewPage = addNewPageStore.listen(this.handleAddNewPage);
		this.us_updateProject = updateProjectStore.listen(this.handleUpdateProject);
		this.us_saveData = saveDataStore.listen(this.handleSaveData);
	},
	componentWillUnmount:function(){
		this.us_changePage();
		this.us_addNewPage();
		this.us_updateProject();
		this.us_saveData();
	},
	render:function(){
		var project = this.state.project;
		return (
			<div>
				<Tools />
				<PageViewer pageList={project.pageList} />
				<EditorD w={project.w} h={project.h} page={project.pageList[this.state.curPageIdx]||{}} />
				<div className='rightcolumn'>
					<AttributeList2 tagList={project.tagList} />
					<Layers page={project.pageList[this.state.curPageIdx]||{}} />
				</div>
			</div>
		);
	}
});
