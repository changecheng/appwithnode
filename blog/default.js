var React = require('react');
var ReactDOM = require('react-dom');
var RB = require('react-bootstrap');
// require('../public/css/bootstrap-css/bootstrap.css');
// require('../public/css/bootstrap-css/bootstrap-theme.css');
var Navbar = RB.Navbar;
var Nav = RB.Nav;
var NavItem = RB.NavItem;
var BlogHeader = React.createClass({
	render:function(){
		return (
			<Navbar defaultExpanded={false}>
				<Navbar.Header>
					<Navbar.Brand>
						<a href='/index.html'>Zzen1sS</a>
					</Navbar.Brand>
					<Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse>
					<Nav pullRight>
						<NavItem eventKey={1} href='/archive.html' >Archive</NavItem>
						<NavItem eventKey={2} href='/pages.html' >Pages</NavItem>
						<NavItem eventKey={3} href='/categories.html' >Category</NavItem>
						<NavItem eventKey={4} href='/tags.html' >Tags</NavItem>
						<NavItem eventKey={5} href='/about.html' >About</NavItem>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
});

ReactDOM.render(<BlogHeader />,document.getElementById('header'));