var React = require('react');
var ReactDOM = require('react-dom');
var RB = require('react-bootstrap');
require('./public/css/bootstrap-css/bootstrap.css');
require('./public/css/bootstrap-css/bootstrap-theme.css');
var Carousel = RB.Carousel;
var CarouselItem = RB.CarouselItem;
var SliderImageFrame = React.createClass({
	render:function(){
		return (
			<Carousel>
				<CarouselItem>
					<img alt='1' width={256} height={256} src='./public/media/images/saber.png' />
					<div className='carousel-caption'>
						<h3>hehe</h3>
						<p>show something.</p>
					</div>
				</CarouselItem>
				<CarouselItem>
					<img alt='2' width={256} height={256} src='./public/media/images/saber.png' />
					<div className='carousel-caption'>
						<h3>hehe2</h3>
						<p>show something.</p>
					</div>
				</CarouselItem>
				<CarouselItem>
					<img alt='3' width={256} height={256} src='./public/media/images/saber.png' />
					<div className='carousel-caption'>
						<h3>hehe3</h3>
						<p>show something.</p>
					</div>
				</CarouselItem>
			</Carousel>
		);
	}
});
ReactDOM.render(<SliderImageFrame />,document.getElementById('sliderImageFrame'));
