var React = require('react');
var Validator = require('./tools/Validator');
var ERRORS        = {
  FIRST_NAME_BLANK:  'First name is required.',
  LAST_NAME_BLANK:   'Last name is required.',
  MAIL_BLANK:        'email is required.',
  MAIL_INVAILD:      'Invalid Email address',
  MAIL_USED:         'Email has been occupied',
  PASS_BLANK:        'Passowrd is required.',
  PASS_INVALID:      'Please check the password length (8 to 32).',
  PASS_DONTMATCH:    'Entered passwords difference.'
};
module.exports= React.createClass({
	getInitialState:function(){
		return {
			formError:{
				firstName: {isBlank:false},
				lastName:{isBlank:false},
				mail:{isBlank:false,isInvalidFormat:false,isUsed:false},
				password:{isBlank:false,isInvalidFormat:false},
				confirmPassword:{notMatch:false}
			},
			userInfo:{
				firstName:'',
				lastName:'',
				mail:'',
				password:'',
				confirmPassword:''
			}
		};
	},
	validate:function(target){
		var formError = this.state.formError;
		var emailReg = /\w+@\w+(\.\w+)+/;
		var passReg = /\w{8,32}/;
		if (Validator.isEmpty(target.value)) {
				formError[target.name].isBlank = true;
			}else{
				formError[target.name].isBlank = false;
			}
		switch (target.name) {
			case 'mail':
			if (Validator.isInvalidFormat(target.value,emailReg)) {
				formError[target.name].isInvalidFormat = true;
			}else{
				formError[target.name].isInvalidFormat = false;
			}
			break;
			case 'password':
			if (Validator.isInvalidFormat(target.value,passReg)) {
				formError[target.name].isInvalidFormat = true;
			}else{
				formError[target.name].isInvalidFormat = false;
			}
			break;
			case 'confirmPassword':
			if (this.state.userInfo.password != target.value) {
				formError[target.name].notMatch = true;
			}else{
				formError[target.name].notMatch = false;
			}
			break;
		}

		this.setState({formError:formError});
		
	},
	handleChange:function(e){
		e.preventDefault();
		var userInfo = this.state.userInfo;
		userInfo[e.target.name] = e.target.value;
		this.setState({userInfo:userInfo});
		this.validate(e.target);

	},
	handleSubmit:function(e){
		e.preventDefault();
	},
	render:function(){
		return (
			<form className='form signup' onSubmit={this.handleSubmit}>
			<div className='field username'>
				<input name='firstName' type='text' placeholder='First Name' value={this.state.userInfo.firstName} onChange={this.handleChange} />
				<input name='lastName' type='text' placeholder='Last Name' value={this.state.userInfo.lastName} onChange={this.handleChange} />
			</div>
			<div className='field formerror'>
				{this.state.formError.firstName.isBlank? ERRORS.FIRST_NAME_BLANK:''}
				{this.state.formError.lastName.isBlank? ERRORS.FIRST_NAME_BLANK:''}
			</div>
			<div className='field mail'>
				<input name='mail' type='text' placeholder='Mail' value={this.state.userInfo.mail} onChange={this.handleChange} />
			</div>
			<div className='field formerror'>
				{this.state.formError.mail.isBlank? ERRORS.MAIL_BLANK:''}
				{this.state.formError.mail.isInvalidFormat? ERRORS.MAIL_INVAILD:''}
				{this.state.formError.mail.isUsed? ERRORS.MAIL_USED:''}
			</div>
			<div className='field password'>
				<input name='password' type='password' placeholder='Passowrd' value={this.state.userInfo.password} onChange={this.handleChange} />
			</div>
			<div className='field formerror'>
				{this.state.formError.password.isBlank? ERRORS.PASS_BLANK:''}
				{this.state.formError.password.isInvalidFormat? ERRORS.PASS_INVALID:''}
			</div>
			<div className='field confirmpassword'>
				<input name='confirmPassword' type='password' placeholder='Reinput Passowrd' value={this.state.userInfo.confirmPassword} onChange={this.handleChange} />
			</div>
			<div className='field formerror'>
				{this.state.formError.confirmPassword.notMatch? ERRORS.PASS_DONTMATCH:''}
			</div>
			<div className="field submit">
	           <input type="submit" value="Sigup" />
	         </div>
			</form>
		);
	}
});