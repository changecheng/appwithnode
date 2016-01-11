var React = require('react');
var editingActionStore = require('../stores/editingActionStore');
module.exports= React.createClass({
	getInitialState:function(){
		return {
			hidden:true,
			curAction:-1,
			action:{
				name:'default',
				content:[
					// ['add','tag1',0],
					// ['minus','tag2',1]
				]
			},
			triggerList:[]
		};	
	},
	handleChangeAction:function(target,value){
		if (this.state.curAction==-1) {
			return ;
		};
		// console.log(this.state.action.content);
		// console.log(this.state.curAction);
		var actionLine = this.state.action.content[this.state.curAction];
		//console.log(actionLine);
		switch (target){
			case 'op':
			actionLine[0] = value;
			break;
			case 'tag':
			actionLine[1] = value;
			break;
			case 'value':
			actionLine[2] = value;
			break;
		}
		this.setState({actionLine:actionLine});

	},
	handleNameChange:function(e){
		var name = this.state.action.name;
		this.setState({name:e.target.value});
	},
	handleRowClick:function(i,e){
		console.log(i);

		this.setState({curAction:i});
	},
	handleDelete:function(i){
		var actionList = this.state.action.content;
		actionList.splice(i,1);
		this.setState({curAction:-1,actionList:actionList});
	},
	handleAdd:function(){
		var actionList = this.state.action.content;
		actionList.push(['op','tag',0]);
		this.setState({curAction:actionList.length-1,actionList:actionList});
	},
	handleClose:function(){
		this.setState({hidden:true});	
	},
	handleEditingAction:function(action,triggerList){
		this.setState({hidden:false, action:action, triggerList:triggerList});
	},
	componentDidMount:function(){
		this.us_editingAction = editingActionStore.listen(this.handleEditingAction);	
	},
	componentWillUnmount:function(){
		this.us_editingAction();
	},
	render:function(){
		var action = this.state.action.content[this.state.curAction];
		var value = '';
		if (action) {
			value = action[2];
		};
		
		return (
			<div className='actionpanel' hidden={this.state.hidden}>
				<span>Name: </span> 
				<input className='actionpanel-name' disabled value={this.state.action.name} onChange={this.handleNameChange} />
				<button className='actionpanel-close' onClick={this.handleClose}>X</button>
			    <ActionAttrSlector tagList={this.props.tagList||[]} triggerList={this.state.triggerList||[]} changeAction={this.handleChangeAction} value={value} />
			    <ActionForm actionLines={this.state.action.content} handleRowClick={this.handleRowClick} handleDelete={this.handleDelete} handleAdd={this.handleAdd} />
			</div>
		);
	}
});

var ActionAttrSlector = React.createClass({
	handleDropdownChange:function(target,value){
		this.props.changeAction(target,value);
	},
	render:function(){
		return (
			<div className='actionpanel-attrslector'>
				<ActionDropDown items={['','On','Add','Minus']} hidden={true} handleDropdownChange={this.handleDropdownChange.bind(this,'op')} />
			    <ActionDropDown items={[''].concat(this.props.tagList).concat(this.props.triggerList)} hidden={true} handleDropdownChange={this.handleDropdownChange.bind(this,'tag')} />
			    <ActionDropDown items={[''].concat(this.props.tagList)} hidden={false} value={this.props.value} handleDropdownChange={this.handleDropdownChange.bind(this,'value')} />
			</div>
		);
	}
});

var ActionForm = React.createClass({
	handleRowClick:function(i,e){
		this.props.handleRowClick(i,e);
		//console.log(i,e);
	},
	handleDelete:function(i){
		this.props.handleDelete(i);
	},
	handleAdd:function(){
		this.props.handleAdd();
	},
	render:function(){
		//var self = this;
		var lines = this.props.actionLines||[];
		var actions=lines.map(function(line,i){
					return (
						<ActionLine key={i} actionLine={line} handleRowClick={this.handleRowClick.bind(this,i)} handleDelete={this.handleDelete.bind(this,i)} / >
					);
				}.bind(this));
		return (
			<table className='actionpanel-table'>
			<tbody className='actionpanel-table-body'>
				{ actions }
				<tr><td><button className='actionpanel-table-add' onClick={this.handleAdd} >Add</button></td></tr>
			</tbody>
			</table>
		);
	}	
});

var ActionLine = React.createClass({
	handleRowClick:function(e){
		e.preventDefault();
		this.props.handleRowClick(e);
	},
	handleDelete:function(e){
		e.preventDefault();
		e.stopPropagation();
		this.props.handleDelete();
	},
	render:function(){
		var line = this.props.actionLine;
		return (
			<tr tabIndex={-1} className='actionpanel-table-row' onClick={this.handleRowClick} >
			<td className='actionpanel-table-column'>{line[0]||''}</td>
			<td className='actionpanel-table-column'>{line[1]||''}</td>
			<td className='actionpanel-table-column'>{line[2]}</td>
			<td className='actionpanel-table-column'><button className='actionpanel-table-column-delete' onClick={this.handleDelete}>X</button></td>
			</tr>
		);
	}
});

var ActionDropDown = React.createClass({
	handleDropdownChange:function(e){
		//e.preventDefault();
		//console.log(e.target.value);
		this.props.handleDropdownChange(e.target.value);
	},
	render:function(){
		var items = (this.props.items||[]).map(function(item,i){
			return (
				<option key={i} className='actionpanel-dropdown-option' >
					{item}
				</option>);
		}.bind(this));
		return (
			<div className='actionpanel-dropdown'>
			<input className='actionpanel-dropdown-input' hidden={this.props.hidden||false} value={this.props.value||''} onChange={this.handleDropdownChange} />
			<select className='actionpanel-dropdown-dropdown' onChange={this.handleDropdownChange}>
				{items}
			</select>
			</div>
		);
	}
});