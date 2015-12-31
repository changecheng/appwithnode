var React = require('react');

module.exports= React.createClass({
	getInitialState:function(){
		return {
			x:this.props.x,
			y:this.props.y,
			w:this.props.w||100,
			h:this.props.h||100,
			zIndex:this.props.zIndex||0,
			bgColor:this.props.bgColor,
			bgImg:this.props.bgImg,
			canDrag:this.props.canDrag||true,
			canScale:this.props.canScale||true,
			mouseDown:false,
			click:false,
			dragging:false,
			scaling:false,
			lastPosition:{x:0,y:0}
		};
	},
	updateMove:function(e){
		var x = this.state.x;
		var y = this.state.y;
		var lastPosition = this.state.lastPosition;
		var offset = {x:e.pageX - lastPosition.x , y: e.pageY - lastPosition.y };
		x += offset.x;
		y += offset.y;
		lastPosition.x += offset.x;
		lastPosition.y += offset.y;
		this.setState({x:x,y:y,lastPosition:lastPosition});

	},
	handleDrag:function(e){
		this.updateMove(e);
		//e.preventDefault();
	},
	handleDragEnd:function(e){
		this.setState({dragging:false});	
	},
	handleDragStart:function(e){
		//save position
		
		console.log('start');
		

	},
	handleClick:function(e){
		//console.log(e);

		
		if (this.state.click) {
			if (this.props.onClick != undefined) {this.props.onClick(e);};
			// var w = this.state.w;
			// var h = this.state.h;
			// w+= 10;
			// h+= 10;
			// this.setState({w:w,h:h});
		};
	},
	mouseOnBorder:function(e){
		console.log(e);
		console.log(e.clientX+': '+e.clientY+': '+e.target.clientWidth+
			': '+e.target.clientHeight);
	},
	handleScale:function(e){
		
	},
	handleMouseUp:function(e){
		this.setState({dragging:false,mouseDown:false});
	},
	handleMouseOut:function(e){
		this.setState({dragging:false,mouseDown:false});
	},
	handleMouseMove:function(e){
		e.preventDefault();
		this.setState({click:false});
		if (this.state.mouseDown) {
			//dragging or scaling
			if (this.state.canDrag) {
				this.handleDrag(e);
				this.setState({dragging:true});
			}else if (this.state.canScale){
				this.handleScale(e);
				this.setState({scaling:true});
			}


			
		};
	},
	handleMouseDown:function(e){
		e.preventDefault();
		e.stopPropagation();
		var lastPosition = this.state.lastPosition;
		lastPosition.x = e.pageX;
		lastPosition.y = e.pageY;
		//this.mouseOnBorder(e);
		this.setState({lastPosition:lastPosition,mouseDown:true,click:true});
	},
	componentWillReceiveProps:function(nextprops){
			this.setState({bgColor:nextprops.bgColor});
	},
	render:function(){
		var containerStyle = {
			border:'1px solid black',
			width:this.state.w, 
			height:this.state.h,
			position:'absolute',
			left:this.state.x,
			top:this.state.y,
			backgroundColor:this.state.bgColor,
			backgroundImage:'url('+this.state.bgImg+')',
			backgroundRepeat:'no-repeat',
			overflow:this.props.overflow||'hidden'
		};
		console.log(this.props.className+' '+this.props.bgColor+' hehe');
		return (
			<div className={this.props.className||'container'} title={this.props.title} onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp} onMouseOut={this.handleMouseOut} onClick={this.handleClick} style={containerStyle}  >
			{this.props.children}
			</div>
		);
	}
});