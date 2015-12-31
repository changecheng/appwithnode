var React = require('react');
var Actions = require('../actions/actions');
var setTargetStore = require('../stores/setTargetStore');
var addElementStore = require('../stores/addElementStore');
var changeAttrStore = require('../stores/changeAttrStore');
var ToolBox = require('./ToolBox');
var ReactDOM = require('react-dom');
module.exports= React.createClass({
	getInitialState:function(){
		return {
			frame:{
				x:0,
				y:0,
				w:1000,
				h:800,
				bgColor:'black',
				bgImg:''
			},
			canvasList:[
				{
					name:'back',
					id:0,
					z:0,
					w:800,
					h:600,
					x:50,
					y:50,
					background:'rgba(255,0,0,0.4)',
					widgetList:[{
						name:'a',
						id:0,

						type:'button',
						w:100,
						h:50,
						x:100,
						y:140,
						background:'red'
					},
					{
						name:'c',
						id:1,

						type:'circle',
						r:20,
						x:100,
						y:100,
						background:'green'

					}
					]
				}
			],
			selected:[],
			activeCanvas:[],
			target:{},
			curCoords:{x:0,y:0}
		};
	},
	inBoundingRect:function(curCoords,widget,type){
		// console.log(curCoords);
		// console.log(widget);
		if (type=='widget') {
			if (widget.type=='button') {
				if (curCoords.x > widget.x && curCoords.x <(widget.x + widget.w)&&curCoords.y>widget.y &&curCoords.y<(widget.y+widget.h)) {
					return true;
				};
			}else if (widget.type == 'circle'){
				if (Math.pow((curCoords.x-widget.x),2)+Math.pow((curCoords.y-widget.y),2)<Math
					.pow(widget.r,2)) {
					return true;
				};
			}
		}else if (type=='canvas') {
			if (curCoords.x > widget.x && curCoords.x <(widget.x + widget.w)&&curCoords.y>widget.y &&curCoords.y<(widget.y+widget.h)) {
				return true;
			};
		};
		
		return false;
	},
	handleMouseDown:function(e){
		console.log('clicked');
		

		// for (elem in e.target){
		// 	console.log(elem+" ");
		// 	console.log(e.target[elem]);
		// }
		this.mouseAction('down',e);
		// var rect=ReactDOM.findDOMNode(this.refs.canvaswrap).getClientRects();
		// console.log('rect');
		// console.log(rect);
		// console.log(e.pageX+':'+e.pageY);
		// console.log(e.offsetX+':'+e.offsetY);
		// var x = Math.round(e.pageX - rect.left);
  //       var y = Math.round(e.pageY - rect.top);

  //       return { x, y };
	},
	handleMouseMove:function(e){
		// console.log('move');
		this.mouseAction('move',e);
	},
	handleMouseUp:function(e){
		console.log('up');
		this.mouseAction('up',e);
	},
	handleMouseClick:function(e){
		var curCoords = this.mouseAction('get',e);
		var selected = this.getSelectedElements(curCoords);
		var obj ;
		if (selected.length>0) {
			var selectedGroup = selected[0];
			if (selectedGroup.length>1) {
				obj = this.state.canvasList[selectedGroup[0]].widgetList[selectedGroup[1]];
			}else{
				obj = this.state.canvasList[selectedGroup[0]];
			}
		};
		this.setState({target:obj});
		Actions.setTarget(obj);
	},
	getSelectedElements:function(curCoords){
		var selected = []; //[[canvas,widget1,widget2],[]]
		var canvasList = this.state.canvasList;
		var activeCanvasList=[];
		var activeCanvas = this.state.activeCanvas;
		if (activeCanvas.length>0) {
			activeCanvasList = activeCanvas;
		}else{
			var i = canvasList.length;
			while(i>0){
				if (this.inBoundingRect(curCoords,canvasList[i-1],'canvas')) {
					activeCanvasList.push(i-1);
					break;
				};
				i=i-1;
			}
			
		};
		for (var i=activeCanvasList.length;i>0;i--){
			var selectedCanvas = [];

			var canvasId = activeCanvasList[i-1];
			selectedCanvas.push(canvasId);
			var canvas = canvasList[canvasId];
			var widgetList = canvas.widgetList;
			for (wIdx in widgetList){
				if (this.inBoundingRect(curCoords,widgetList[wIdx],'widget')) {
					selectedCanvas.push(wIdx);
				};
			}
			selected.push(selectedCanvas);
		}
		return selected;
	},
	mouseAction:function(type,e){
		if (type =='get'){
			// var dom=ReactDOM.findDOMNode(this.refs.canvaswrap);
			// console.log(dom);
			var mainpanel = this.refs.mainpanel;
			var rect = {left:e.target.offsetLeft,top:e.target.offsetTop};
			// console.log('rect');
			// console.log(rect);
			// console.log(e.pageX+':'+e.pageY);
			// console.log(e);
			//console.log(e.offsetX+':'+e.offsetY);
			var x = Math.round(e.pageX - rect.left+mainpanel.scrollLeft);
	        var y = Math.round(e.pageY - rect.top+mainpanel.scrollTop);

	        return { x, y };
		}else if (type=='down') {
			var curCoords = this.mouseAction('get',e);
			var selected = this.state.selected;
			this.setState({curCoords:curCoords});
			var selected = this.getSelectedElements(curCoords);
			// for (wlIndex in this.state.widgetLists){
			// 	wlist = this.state.widgetLists[wlIndex];
			// 	for (var i=0;i<wlist.length;i++){
			// 		if (this.inBoundingRect(curCoords,wlist[i])) {
			// 			selected.push({c:wlIndex,w:i});
			// 		};
			// 	}
			// }
			this.setState({selected:selected});
			//console.log('selected');
			//console.log(this.state.selected);
		}else if (type=='move'){
			var curCoords = this.mouseAction('get',e);
			var offSets={x:curCoords.x-this.state.curCoords.x,y:curCoords.y-this.state.curCoords.y};

			this.updateElements(offSets);
			this.setState({curCoords:curCoords});
		}else if (type=='up'){
			this.setState({selected:[]});
			this.setState({curCoords:{x:0,y:0}});
			
		}
	},
	updateElement:function(element,offsets){
		element.x += offsets.x;
		element.y += offsets.y;	
	},
	updateElements:function(offsets){
		var selected = this.state.selected;
		//console.log(selected);
		if (selected.length>0) {
			var canvasList = this.state.canvasList;
			for (var i=0;i<selected.length;i++){
				var selectedGroup = selected[i];
				var selectedGroupLength = selectedGroup.length;
				
				if (selectedGroupLength>1) {
					//update widgets
					var curCanvas = canvasList[selectedGroup[0]];
					for (var j = 1; j < selectedGroupLength; j++) {
						this.updateElement(curCanvas.widgetList[selectedGroup[j]],offsets);
						// curCanvas.widgetList[selectedGroup[j]].x+=offsets.x;
						// curCanvas.widgetList[selectedGroup[j]].y+=offsets.y;
					};
				}else if (selectedGroupLength>0){
					this.updateElement(canvasList[selectedGroup[0]],offsets);
					// var curCanvas = canvasList[selectedGroup[0]];
					// for (var j = 0; j < curCanvas.widgetList.length; j++) {
					// 	this.updateElement(curCanvas.widgetList[j],offsets);
					// 	// curCanvas.widgetList[selectedGroup[j]].x+=offsets.x;
					// 	// curCanvas.widgetList[selectedGroup[j]].y+=offsets.y;
					// };
				}
					
				
			}
			this.setState({canvasList:canvasList});
			this.redraw();
			this.update();
				
		};
		
	},
	drawFrame:function(offContext, frame){

		offContext.fillStyle=frame.background;
		// console.log(offContext.fillStyle);


		offContext.fillRect(0,0,frame.w,frame.h);

	},
	drawCanvas:function(offContext, canvas){

		offContext.fillStyle=canvas.background;
		//console.log('draw canvas');

		//offContext.fillRect(0,0,100,100);
		// console.log(canvas.x+" "+canvas.y+" "+canvas.w+" "+canvas.h+" "+canvas.background)
		offContext.fillRect(canvas.x,canvas.y,canvas.w,canvas.h);

	},
	drawWidget:function(offContext, widget){
		offContext.save();
		offContext.fillStyle = widget.background;
		if (widget.type=='button') {
			//drawrect
			offContext.fillRect(widget.x,widget.y,widget.w,widget.h);
		} else if (widget.type =='circle') {
			//draw arc
			offContext.beginPath();
			offContext.arc(widget.x,widget.y,widget.r,0,Math.PI*2,true);
			offContext.closePath();
			offContext.fill();
		};
		offContext.restore();

	},
	redraw:function(){
		//console.log(this.state.canvasList);
		var offCanvas = this.refs.offCanvas;
		offCanvas.width=this.state.frame.w;
		offCanvas.height=this.state.frame.h;
		var offContext = offCanvas.getContext('2d');
		//console.log('redraw');
		offContext.clearRect(0,0,offCanvas.width,offCanvas.height);
		this.drawFrame(offContext,this.state.frame);
		//this.drawCanvas(offContext,this.state.canvasList[0]);
		for (index in this.state.canvasList ){
			var canvas = this.state.canvasList[index];
			this.drawCanvas(offContext, canvas);
			var widgetList = canvas.widgetList;
			for (widgetIdx in widgetList){
				this.drawWidget(offContext, widgetList[widgetIdx]);
				//console.log(widgetIdx);
			}
		}
	},
	update:function(){
		//console.log('update');
		var canvas = this.refs.canvas;

		var offCanvas = this.refs.offCanvas;
		canvas.width = offCanvas.width;
		canvas.height = offCanvas.height;
		//console.log(canvas.width);
		var context = canvas.getContext('2d');
		context.drawImage(offCanvas,0,0,offCanvas.width,offCanvas.height);
	},
	copyObj:function(obj){
		var newObj = {};
		for (attr in obj){
			newObj[attr] = obj[attr];
		}
		return newObj;
	},
	handleAddElement:function(element){
		//console.log('handle add element');
		switch (element.type){
			case 'canvas':
				var newCanvas = this.copyObj(element.content);
				var canvasList = this.state.canvasList;
				newCanvas.z = canvasList.length;
				canvasList.push(newCanvas);
				this.setState({canvasList:canvasList});
				break;
			case 'widget':
				var newWidget = this.copyObj(element.content);
				var targetCanvasIdx=0;
				if (this.state.activeCanvas.length>0) {
					targetCanvasIdx = this.state.activeCanvas[0][0];
				}else{
					targetCanvasIdx = this.state.canvasList.length-1;
				}
				var targetcanvas = this.state.canvasList[targetCanvasIdx];
				targetcanvas.widgetList.push(newWidget);
				//console.log(this.state.canvasList);
				break;
		}
		this.redraw();
		this.update();
	},
	handleChangeAttr:function(name,value){
		// console.log('handleChangeAttr');

		var target = this.state.target;
		// console.log(target);
		// console.log(this.state.canvasList[0]);
		target[name] = value;
		this.setState({target:target});
		this.redraw();
		this.update();
	},
	componentDidMount:function(){
		//console.log('did mount');
		this.redraw();
		this.update();
		this.us_addElement = addElementStore.listen(this.handleAddElement);
		this.us_changeAttr = changeAttrStore.listen(this.handleChangeAttr);
	},
	componentWillUnmount:function(){
		this.us_addElement();
		this.us_changeAttr();
	},
	render:function(){
		return (
			<div className='editor-frame'>

				<div className='editor-mainpanel' ref='mainpanel' style={{width:'100%',overflow:'scroll'}}  >
					<div ref='canvaswrap' onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp} onClick={this.handleMouseClick} >
						<canvas className='canvas' ref='canvas'  >
						</canvas>
					</div>
					<div>
						<canvas className='offCanvas' ref='offCanvas' style={{display:'none'}} >
						</canvas>
					</div>

				</div>
				
			</div>
		);

	}
});