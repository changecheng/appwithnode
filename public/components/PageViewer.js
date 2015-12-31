var React = require('react');
var Actions = require('../actions/actions');
var changePageStore = require('../stores/changePageStore');
var updatePageViewerStore = require('../stores/updatePageViewerStore');
module.exports= React.createClass({
	getInitialState:function(){
		return {pageList:this.props.pageList||[]};
	},
	// handleUpdatePageViewer:function(pageList){
	// 	this.setState({pageList:pageList});
	// },
	componentWillReceiveProps:function(newProps){
		//console.log(newProps);
		this.setState({pageList:newProps.pageList});	
	},
	// componentDidMount:function(){
	// 	this.us_updatePageViewer = updatePageViewerStore.listen(this.handleUpdatePageViewer);	
	// },
	// comonentWillUnmount:function(){
	// 	this.us_updatePageViewer();
	// },
	handleAddPage:function(){
		Actions.addNewPage();
	},
	render:function(){
		return (
			<div className='pageViewer'>
			<button className='addNewPage' onClick={this.handleAddPage} >+</button>
		    {this.state.pageList.map(function(page,i){
		    	return <SinglePageViewer index={i} page={page} key={i} />;
		    })}
			</div>

		);
	}
});

var SinglePageViewer=React.createClass({
	handleClick:function(e){
		//console.log(this.props.index);
		Actions.changePage(this.props.index);
	},
	render:function(){
		return (
			<div className='singlePageViewer' onClick={this.handleClick} >
				<div className='listNumber' >
					{this.props.index}
				</div>
				<div className='pageThumbnail'>
					<img className='thumbnail' src='' alt={this.props.index} />
				</div>
			</div>
		);
	}
});