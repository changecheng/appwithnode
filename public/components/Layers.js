var React = require('react');
var updateLayersStore = require('../stores/updateLayersStore');
module.exports= React.createClass({
	getInitialState:function(){
		return 	{page:{
			// name:'page1',
			// type:'page',
			// canvasList:[
			// 	{
			// 		name:'canvas1',
			// 		type:'canvas',
			// 		subCanvasList:[
			// 			{
			// 				name:'sc1',
			// 				type:'subCanvas'
			// 			}
			// 		]
			// 	},
			// 	{
			// 		name:'canvas2',
			// 		type:'canvas',
			// 		subCanvasList:[
			// 			{
			// 				name:'sc2',
			// 				type:'subCanvas'
			// 			}
			// 		]
			// 	}
			// ]
		}}
	},
	handleUpdate:function(page){
		this.setState({page:page});
	},
	componentDidMount:function(){
		this.us_updateLayers = updateLayersStore.listen(this.handleUpdate);	
	},
	comonentWillUnmount:function(){
		this.us_updateLayers();
	},
	render:function(){
		return (
			<div className='layers' >
			    <span>Layers</span>
			    <LayerGroup content={this.state.page} />
			</div>
		);
	}
});

var LayerGroup = React.createClass({
	getInitialState:function(){
		return {collapse:false};	
	},
	handleCollapse:function(e){
		e.preventDefault();
		this.setState({collapse:!this.state.collapse});
	},
	componentWillReceiveProps:function(){
		this.setState({collapse:false});	
	},
	render:function(){
		var content = this.props.content||{};
		var layerChildren=[];
		if (content) {
			switch (content.type){
				case 'page':
				layerChildren = content.canvasList;
				break;
				case 'canvas':
				layerChildren = content.subCanvasList;
				break;
				case 'subCanvas':
				layerChildren = content.widgetList;
				break;
				case 'widget':
				layerChildren = content.texList;
				break;
			}
		};
		
		layerChildren = layerChildren||[];
		return (
			<div className='layergroup' >
			<span onClick={this.handleCollapse} >{content.name||''}</span>
			<ul hidden={this.state.collapse}>
				
				{layerChildren.map(function(child,i){
					return (<li key={i} ><LayerGroup content={child} /> </li> );
				})}
			</ul>
			</div>
		);
	}
});

var LayerTitle = React.createClass({
	
	render:function(){
		return (
			<span >{this.props.name}</span>
		);
	}
});

// var LayerLine = React.createClass({
	
// });