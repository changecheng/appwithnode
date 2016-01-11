var React = require('react');
module.exports= React.createClass({
	handleClick:function(i,e){
		e.preventDefault();
		this.props.handleClick(i,e);
	},
	render:function(){
		var items = this.props.items;
		return (
			<div className={this.props.class||'contextmenu'} >
   				{items.map(function(item,i){
   					if (item.type=='menuItem') {
   						return (
   							<div key={i} className='menuitem' onClick={this.handleClick.bind(this,item.eventKey)} >
   								{item.content}
   							</div>
   						);
   					}else if(item.type=='divider'){
   						return (
   							<div key={i} className='divider' >
   								{item.content}
   							</div>
   						);
   					}
   				}.bind(this))}
			</div>
		);
	}
});	